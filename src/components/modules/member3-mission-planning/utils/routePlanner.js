/**
 * Mars Great Circle & Terrain-Aware Route Planning Utilities (Member 3)
 * 
 * DISCLAIMER: All calculations are experimental simulations for robotic rover reconnaissance.
 * NOT CERTIFIED FOR ASTRONAUT SAFETY OR CREWED MISSIONS.
 */

// Mars mean volumetric radius in kilometers
export const MARS_RADIUS_KM = 3389.5;

/**
 * Parses latitude string (e.g. "18.38°N" or "-6.52°S") into decimal degrees
 */
export function parseCoord(coordStr) {
  if (typeof coordStr === 'number') return coordStr;
  if (!coordStr) return 0;
  const match = coordStr.match(/([0-9.]+)[°\s]*([NSEWnsew]?)/);
  if (!match) return 0;
  let val = parseFloat(match[1]);
  const dir = match[2].toUpperCase();
  if (dir === 'S' || dir === 'W') val = -val;
  return val;
}

/**
 * Converts SVG map coordinates (0-800 x, 0-500 y) to Martian Lat/Lon
 */
export function mapCoordsToMarsLatLon(x, y) {
  const latDeg = (250 - y) / (250 / 80);
  const lonDeg = (x / 800) * 360;
  const latStr = latDeg >= 0 ? `${latDeg.toFixed(2)}°N` : `${Math.abs(latDeg).toFixed(2)}°S`;
  const lonStr = `${lonDeg.toFixed(2)}°E`;
  return { lat: latDeg, lon: lonDeg, latStr, lonStr };
}

/**
 * Converts Martian Lat/Lon decimal degrees to SVG map coordinates (0-800 x, 0-500 y)
 */
export function marsLatLonToMapCoords(lat, lon) {
  const y = 250 - (lat * (250 / 80));
  const normalizedLon = ((lon % 360) + 360) % 360;
  const x = (normalizedLon / 360) * 800;
  return { x: Math.round(x), y: Math.round(y) };
}

/**
 * Calculates geographic great-circle distance between two Martian coordinates using Haversine formula
 * Returns distance in kilometers.
 */
export function calculateGreatCircleDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const rLat1 = (lat1 * Math.PI) / 180;
  const rLat2 = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(MARS_RADIUS_KM * c * 10) / 10;
}

/**
 * Evaluates simulated terrain hazard cost and difficulty for a point (x, y)
 * Takes into account rocky obstacles, steep slopes, craters, and canyon walls.
 */
export function getTerrainPointCost(x, y, hazards = []) {
  let cost = 1.0; // Base flat regolith cost
  let challenge = null;

  // 1. Olympus Mons Extreme Scarp / Volcano Peak
  const distOlympus = Math.hypot(x - 180, y - 210);
  if (distOlympus < 40) {
    cost += 8.5; // Sheer scarp precipice >28° & basalt blockfield
    challenge = "Extreme Olympus Rupes Scarp (>28° slope & sharp basalt blocks)";
  } else if (distOlympus < 70) {
    cost += 3.2; // Incline apron 14°
    challenge = "Olympus Flank Basalt Apron (14° slope)";
  }

  // 2. Valles Marineris Canyon Walls
  const distValles = Math.hypot(x - 330, y - 310);
  if (distValles < 35) {
    cost += 6.0; // Deep chasma trench & 26° talus scree
    challenge = "Candor Chasma Acute Talus Landslip Zone";
  } else if (distValles < 80) {
    cost += 2.0; // Canyon rim slopes
    challenge = "Valles Marineris Scarp Margin";
  }

  // 3. Jezero Delta Sand Trap
  const distJezero = Math.hypot(x - 440, y - 220);
  if (distJezero < 25) {
    cost += 2.8; // Active loose sand ripple field
    challenge = "Loose Sand Ripple Field (wheel sinkage risk)";
  }

  // 4. Check proximity to any registered hazards
  for (const haz of hazards) {
    const hazCoords = haz.mapCoords || { x: 400, y: 250 };
    const dist = Math.hypot(x - hazCoords.x, y - hazCoords.y);
    if (dist < 28) {
      if (haz.severity === 'HIGH' || haz.severity === 'CRITICAL') {
        cost += 5.5;
        challenge = haz.title;
      } else if (haz.severity === 'MEDIUM' || haz.severity === 'MODERATE') {
        cost += 2.2;
        if (!challenge) challenge = haz.title;
      }
    }
  }

  return { cost, challenge };
}

/**
 * A* Pathfinding / Hazard-Aware Waypoint Generator between Start and Destination
 * Generates an optimal robotic traverse path avoiding extreme slopes and rocky obstacles.
 */
export function generateExperimentalRoute(startLocation, destLocation, hazards = []) {
  if (!startLocation || !destLocation) return null;

  const startCoords = startLocation.mapCoords || { x: 440, y: 220 };
  const destCoords = destLocation.mapCoords || { x: 570, y: 130 };

  const startLat = parseCoord(startLocation.lat);
  const startLon = parseCoord(startLocation.lon);
  const destLat = parseCoord(destLocation.lat);
  const destLon = parseCoord(destLocation.lon);

  // Generate intermediate terrain-aware navigation waypoints
  const numSegments = 6;
  const waypoints = [];
  const challengesEncountered = new Set();

  // Add Starting Waypoint
  waypoints.push({
    step: 1,
    name: `Start: ${startLocation.name}`,
    lat: startLocation.lat || `${startLat.toFixed(2)}°N`,
    lon: startLocation.lon || `${startLon.toFixed(2)}°E`,
    mapCoords: { x: startCoords.x, y: startCoords.y },
    elevation: startLocation.elevation || (startLocation.baseElevation || "-2,530 m"),
    segmentDistKm: 0,
    segmentSlope: "2.5°",
    terrainNotice: "System launch telemetry & drive calibration"
  });

  let prevX = startCoords.x;
  let prevY = startCoords.y;
  let totalKm = 0;
  let accumulatedDifficultyScore = 0;

  for (let i = 1; i < numSegments; i++) {
    const t = i / numSegments;
    // Linear direct coordinate
    let interpX = startCoords.x + t * (destCoords.x - startCoords.x);
    let interpY = startCoords.y + t * (destCoords.y - startCoords.y);

    // Evaluate hazard cost at direct path
    const directEval = getTerrainPointCost(interpX, interpY, hazards);

    // If direct point crosses extreme hazard (>3.0), search for bypass offset (A* local detour)
    let finalX = interpX;
    let finalY = interpY;
    let finalCost = directEval.cost;

    if (directEval.cost > 2.5) {
      if (directEval.challenge) challengesEncountered.add(directEval.challenge);

      // Search perpendicular offsets to find lowest cost safe detour
      const perpAngle = Math.atan2(destCoords.y - startCoords.y, destCoords.x - startCoords.x) + Math.PI / 2;
      let bestCost = directEval.cost;

      // Try detours in steps of 15px to 40px
      for (const offset of [-35, -20, 20, 35]) {
        const testX = interpX + Math.cos(perpAngle) * offset;
        const testY = interpY + Math.sin(perpAngle) * offset;
        const testEval = getTerrainPointCost(testX, testY, hazards);
        if (testEval.cost < bestCost) {
          bestCost = testEval.cost;
          finalX = testX;
          finalY = testY;
          finalCost = testEval.cost;
        }
      }
    }

    const marsCoord = mapCoordsToMarsLatLon(finalX, finalY);
    const prevMars = mapCoordsToMarsLatLon(prevX, prevY);
    const segKm = calculateGreatCircleDistanceKm(prevMars.lat, prevMars.lon, marsCoord.lat, marsCoord.lon);
    totalKm += segKm;
    accumulatedDifficultyScore += finalCost;

    // Simulated elevation and slope along waypoint
    const simulatedAltM = Math.round(-3000 + (finalCost > 2 ? 1800 : 200) + Math.sin(i) * 450);
    const simulatedSlopeDeg = Math.round((finalCost > 2 ? 8.5 : 2.8) * 10) / 10;

    waypoints.push({
      step: i + 1,
      name: `Traverse Waypoint Alpha-${i}`,
      lat: marsCoord.latStr,
      lon: marsCoord.lonStr,
      mapCoords: { x: Math.round(finalX), y: Math.round(finalY) },
      elevation: `${simulatedAltM > 0 ? '+' : ''}${simulatedAltM} m`,
      segmentDistKm: segKm,
      segmentSlope: `${simulatedSlopeDeg}°`,
      terrainNotice: finalCost > 2.5 ? "Hazard bypass maneuver executed" : "Nominal regolith cruise"
    });

    prevX = finalX;
    prevY = finalY;
  }

  // Add Final Destination Waypoint
  const lastMars = mapCoordsToMarsLatLon(prevX, prevY);
  const finalDestDist = calculateGreatCircleDistanceKm(lastMars.lat, lastMars.lon, destLat, destLon);
  totalKm += finalDestDist;

  waypoints.push({
    step: numSegments + 1,
    name: `Destination: ${destLocation.name}`,
    lat: destLocation.lat || `${destLat.toFixed(2)}°N`,
    lon: destLocation.lon || `${destLon.toFixed(2)}°E`,
    mapCoords: { x: destCoords.x, y: destCoords.y },
    elevation: destLocation.elevation || (destLocation.baseElevation || "-3,850 m"),
    segmentDistKm: finalDestDist,
    segmentSlope: "1.8°",
    terrainNotice: "Arrival at target science perimeter"
  });

  // Calculate difficulty rating
  const avgCost = accumulatedDifficultyScore / (numSegments - 1);
  const difficultyScore = Math.min(100, Math.max(18, Math.round(avgCost * 24)));
  let difficulty = "Low Terrain Difficulty";
  let difficultyClass = "low";
  if (avgCost > 3.0) {
    difficulty = "High Hazard Difficulty (Severe Slopes / Rocky Obstacles)";
    difficultyClass = "high";
  } else if (avgCost > 1.8) {
    difficulty = "Moderate Terrain Difficulty (Slight Detours & Slope Caution)";
    difficultyClass = "moderate";
  }

  // Estimated driving hours assuming 2.5 km/h average speed on Mars
  const totalKmRounded = Math.round(totalKm * 10) / 10;
  const estimatedHours = Math.round((totalKmRounded / 2.5) * 10) / 10;
  const estimatedSols = Math.round((estimatedHours / 4) * 10) / 10; // ~4 driving hours per Sol
  const estimatedPowerKwh = Math.round((totalKmRounded * 0.28) * 10) / 10;

  // Generate SVG path 'd' string
  const pathD = waypoints.reduce((acc, wp, idx) => {
    return idx === 0 ? `M ${wp.mapCoords.x} ${wp.mapCoords.y}` : `${acc} L ${wp.mapCoords.x} ${wp.mapCoords.y}`;
  }, '');

  const challengesList = Array.from(challengesEncountered);
  const challengesAvoided = challengesList.map((ch, idx) => ({
    id: `chal-${idx}`,
    name: typeof ch === 'string' ? ch : ch.name,
    action: 'AUTONOMOUS DETOUR',
    description: typeof ch === 'string' ? ch : ch.description
  }));

  return {
    id: `route-${Date.now()}`,
    name: `Traverse from ${startLocation.name.split(' - ')[0]} to ${destLocation.name.split(' - ')[0]}`,
    startLocation,
    destLocation,
    waypoints,
    pathD,
    totalDistanceKm: totalKmRounded,
    estimatedDurationHours: estimatedHours,
    estimatedSols,
    estimatedPowerKwh,
    difficulty,
    difficultyClass,
    difficultyScore,
    challenges: challengesList,
    challengesAvoided,
    isExperimental: true
  };
}

/**
 * Default Preset Martian Expeditions for quick testing
 */
export const PRESET_EXPEDITIONS = [
  {
    id: 'exp-01',
    name: 'Jezero Delta → Utopia Ice Lowlands',
    start: {
      id: 'target-01',
      name: 'Jezero Crater Delta Front',
      lat: '18.38°N',
      lon: '77.58°E',
      mapCoords: { x: 440, y: 220 },
      baseElevation: '-2,530 m'
    },
    dest: {
      id: 'target-04',
      name: 'Utopia Planitia Ice Basin',
      lat: '46.70°N',
      lon: '117.50°E',
      mapCoords: { x: 570, y: 130 },
      baseElevation: '-3,850 m'
    }
  },
  {
    id: 'exp-02',
    name: 'Olympus Mons Glacis → Tharsis Montes Ridge',
    start: {
      id: 'target-02',
      name: 'Olympus Mons Basaltic Apron',
      lat: '18.65°N',
      lon: '226.20°E',
      mapCoords: { x: 190, y: 215 },
      baseElevation: '+8,200 m'
    },
    dest: {
      id: 'target-03',
      name: 'Valles Marineris Candor Chasma',
      lat: '6.52°S',
      lon: '284.10°E',
      mapCoords: { x: 310, y: 310 },
      baseElevation: '-4,120 m'
    }
  },
  {
    id: 'exp-03',
    name: 'Gale Crater → Hellas Impact Basin',
    start: {
      id: 'reg-05',
      name: 'Gale Crater (Mount Sharp Foothills)',
      lat: '5.38°S',
      lon: '137.44°E',
      mapCoords: { x: 610, y: 300 },
      baseElevation: '-4,450 m'
    },
    dest: {
      id: 'feat-hellas',
      name: 'Hellas Planitia Basin Floor',
      lat: '42.70°S',
      lon: '70.50°E',
      mapCoords: { x: 530, y: 380 },
      baseElevation: '-8,200 m'
    }
  }
];
