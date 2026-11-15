import React, { useState, useRef } from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Large Interactive Mars Terrain Map
 * Includes:
 * - Color-coded topographical elevation altimetry
 * - Color-coded slope analysis visualization (Flat <5°, Moderate 5-15°, Steep >15°)
 * - Rocky and uneven surface roughness overlays
 * - Interactive hazard warning markers
 * - Martian coordinate grid (meridians and parallels)
 * - Click-to-Inspect probe reticle at any location
 * - Live crosshair coordinate readout (Simulated Lat/Lon/Elevation/Slope)
 * - Sector selection and hover tooltips
 */
export default function InteractiveTerrainMap({
  regions = [],
  hazards = [],
  selectedRegionId,
  onSelectRegion,
  selectedHazardId,
  onSelectHazard,
  inspectedPoint,
  onInspectMapPoint,
  mapMode = 'elevation', // 'elevation' | 'slope' | 'roughness' | 'standard'
  highlightSlopeType = 'all', // 'all' | 'flat' | 'moderate' | 'steep'
  layers = { elevation: true, roughness: true, hazards: true, grid: true, poi: true },
  pois = [],
  selectedPoiId = null,
  onSelectPoi = null,
  activeRoute = null,
  routeStart = null,
  routeDest = null,
  routeSelectMode = null, // 'start' | 'dest' | null
  onSelectRoutePoint = null
}) {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoveredHazard, setHoveredHazard] = useState(null);
  const [hoveredPoi, setHoveredPoi] = useState(null);
  const [cursorTelemetry, setCursorTelemetry] = useState({
    lat: "18.38°N",
    lon: "77.58°E",
    estElevation: "-2,530 m",
    estSlope: "4.2°",
    estGrade: "7.3%",
    slopeCategory: "Flat / Low Incline",
    active: false,
    x: 440,
    y: 220
  });

  const svgRef = useRef(null);

  // Map dimensions
  const mapWidth = 800;
  const mapHeight = 500;

  // Helper to compute simulated coordinates from SVG (x, y)
  const computeTelemetryAt = (x, y) => {
    // y: 0 is 80°N, 250 is Equator 0°, 500 is 80°S
    const latDeg = Math.round((250 - y) / (250 / 80));
    const latStr = latDeg >= 0 ? `${latDeg}°N` : `${Math.abs(latDeg)}°S`;

    // x: 0 is 0°E, 800 is 360°E
    const lonDeg = Math.round((x / mapWidth) * 360);
    const lonStr = `${lonDeg}°E`;

    // Simulated elevation calculation from map features
    let estElev = -2000;
    let estSlopeVal = 3.5;
    let terrainType = "Sedimentary Regolith Plain";
    let roughness = "Moderate (0.35m boulder dispersion)";
    let unevenIndex = "35 / 100";

    const distOlympus = Math.hypot(x - 180, y - 210);
    const distValles = Math.hypot(x - 330, y - 310);
    const distHellas = Math.hypot(x - 530, y - 380);

    if (distOlympus < 75) {
      // Near Olympus Mons
      estElev = Math.round(7000 + (75 - distOlympus) * 220);
      estSlopeVal = distOlympus < 35 ? 28.5 : 14.8;
      terrainType = "Extrusive Basalt Lava Flows & Sharp Scoria";
      roughness = "High (0.85m vesicular blocks)";
      unevenIndex = "82 / 100";
    } else if (distValles < 85) {
      // Near Valles Marineris
      estElev = Math.round(-4200 - (85 - distValles) * 18);
      estSlopeVal = distValles < 30 ? 24.0 : 8.5;
      terrainType = "Hydrated Sulfate Stratified Canyon Floor";
      roughness = "High-Variable (deep gullies and talus scree)";
      unevenIndex = "68 / 100";
    } else if (distHellas < 75) {
      // Hellas Basin
      estElev = -7200;
      estSlopeVal = 2.1;
      terrainType = "Deep Impact Regolith with Eolian Sand Drift";
      roughness = "Low-Moderate (0.25m smooth drift)";
      unevenIndex = "22 / 100";
    } else if (y < 160) {
      // Northern Lowlands / Utopia
      estElev = -3850;
      estSlopeVal = 1.1;
      terrainType = "Uniform Permafrost Regolith with Polygonal Ice Ground";
      roughness = "Low (0.12m pebble field)";
      unevenIndex = "12 / 100";
    }

    // Slope category
    let slopeCategory = "Flat / Level (<5°)";
    if (estSlopeVal > 15) slopeCategory = "Steep Slope (>15°)";
    else if (estSlopeVal >= 5) slopeCategory = "Moderate Incline (5°–15°)";

    const rad = (estSlopeVal * Math.PI) / 180;
    const estGrade = `${Math.round(Math.tan(rad) * 1000) / 10}%`;

    return {
      latStr,
      lonStr,
      estElev,
      estElevationStr: estElev > 0 ? `+${estElev.toLocaleString()} m` : `${estElev.toLocaleString()} m`,
      estSlopeVal,
      estSlopeStr: `${estSlopeVal.toFixed(1)}°`,
      estGrade,
      slopeCategory,
      terrainType,
      roughness,
      unevenIndex
    };
  };

  // Handle mouse move for live crosshair telemetry HUD
  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = mapWidth / rect.width;
    const scaleY = mapHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const tel = computeTelemetryAt(x, y);

    setCursorTelemetry({
      lat: tel.latStr,
      lon: tel.lonStr,
      estElevation: tel.estElevationStr,
      estSlope: tel.estSlopeStr,
      estGrade: tel.estGrade,
      slopeCategory: tel.slopeCategory,
      active: true,
      x: Math.round(x),
      y: Math.round(y)
    });
  };

  const handleMouseLeave = () => {
    setCursorTelemetry(prev => ({ ...prev, active: false }));
  };

  // Handle click on map to set interactive inspection point
  const handleMapClick = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = mapWidth / rect.width;
    const scaleY = mapHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const tel = computeTelemetryAt(x, y);

    const customPoint = {
      id: `probe-${Math.round(x)}-${Math.round(y)}`,
      name: `Sensor Probe at ${tel.latStr}, ${tel.lonStr}`,
      lat: tel.latStr,
      lon: tel.lonStr,
      mapCoords: { x: Math.round(x), y: Math.round(y) },
      elevationM: tel.estElev,
      slopeDeg: tel.estSlopeVal,
      terrainType: tel.terrainType,
      roughness: tel.roughness,
      unevenIndex: tel.unevenIndex
    };

    if (routeSelectMode && onSelectRoutePoint) {
      onSelectRoutePoint(customPoint, routeSelectMode);
    } else if (onInspectMapPoint) {
      onInspectMapPoint(customPoint);
    }
  };

  const inspectorPin = inspectedPoint?.mapCoords || { x: 440, y: 220 };

  return (
    <div className={styles.mapContainer}>
      {/* Top Map HUD Bar */}
      <div className={styles.mapHudBar}>
        <div className={styles.hudStatusBlock}>
          <span className={styles.pulseRadarDot} />
          <span className={styles.hudStatusText}>
            ORBITAL RADAR • {mapMode.toUpperCase()} VISUALIZATION MODE
          </span>
        </div>

        <div className={styles.telemetryReadout}>
          <span>CURSOR: <strong>{cursorTelemetry.lat}, {cursorTelemetry.lon}</strong></span>
          <span className={styles.telemetryDivider}>|</span>
          <span>ELEV: <strong>{cursorTelemetry.estElevation}</strong></span>
          <span className={styles.telemetryDivider}>|</span>
          <span>SLOPE: <strong>{cursorTelemetry.estSlope} ({cursorTelemetry.estGrade})</strong></span>
          <span className={styles.telemetryDivider}>|</span>
          <span style={{ color: cursorTelemetry.estSlopeVal > 15 ? '#ef4444' : cursorTelemetry.estSlopeVal > 5 ? '#f59e0b' : '#10b981' }}>
            {cursorTelemetry.slopeCategory}
          </span>
          <span className={styles.simulatedPill}>SIMULATED DATA</span>
        </div>
      </div>

      {/* SVG Interactive Map */}
      <div className={styles.svgViewport}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className={styles.marsMapSvg}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleMapClick}
          role="img"
          aria-label="Interactive Martian Topographical Map"
          style={{ cursor: 'crosshair' }}
        >
          <defs>
            {/* Background planetary base gradient */}
            <radialGradient id="marsBase" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#1e130c" />
              <stop offset="50%" stopColor="#150f14" />
              <stop offset="100%" stopColor="#080a12" />
            </radialGradient>

            {/* Olympus Mons elevation volcano gradient */}
            <radialGradient id="olympusElev" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#fca5a5" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#ea580c" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.15" />
            </radialGradient>

            {/* Hellas Basin deep depression gradient */}
            <radialGradient id="hellasDepression" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#312e81" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#431407" stopOpacity="0.05" />
            </radialGradient>

            {/* Rough terrain hatching pattern */}
            <pattern id="roughTerrainPattern" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#ea580c" strokeWidth="1.2" strokeOpacity="0.55" />
              <circle cx="6" cy="6" r="1.4" fill="#f97316" fillOpacity="0.7" />
            </pattern>

            {/* Extreme boulder scree pattern */}
            <pattern id="boulderPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.2" fill="#ef4444" fillOpacity="0.8" />
              <circle cx="12" cy="10" r="2.5" fill="#f87171" fillOpacity="0.75" />
              <line x1="2" y1="12" x2="8" y2="14" stroke="#dc2626" strokeWidth="1.2" strokeOpacity="0.6" />
            </pattern>
          </defs>

          {/* Map Base Canvas */}
          <rect width={mapWidth} height={mapHeight} fill="url(#marsBase)" />

          {/* =================================================================
              LAYER 1: TOPOGRAPHY & COLOR-CODED ELEVATION / SLOPE HEATMAP
             ================================================================= */}
          {layers.elevation && (
            <g id="elevation-layer" opacity="0.95">
              {/* Northern Lowlands (Vastitas Borealis / Utopia depression: -3800m) */}
              <path
                d="M 0 0 L 800 0 L 800 170 Q 600 190 400 160 Q 200 180 0 170 Z"
                fill={mapMode === 'slope' ? '#064e3b' : '#111827'}
                fillOpacity={mapMode === 'slope' ? '0.5' : '0.75'}
              />
              <path
                d="M 0 0 L 800 0 L 800 140 Q 550 160 380 130 Q 180 150 0 135 Z"
                fill={mapMode === 'slope' ? '#065f46' : '#0f172a'}
                fillOpacity={mapMode === 'slope' ? '0.6' : '0.85'}
              />

              {/* Southern Highlands (Cratered crust, higher datum: 0m to +2500m) */}
              <path
                d="M 0 260 Q 250 240 500 270 Q 700 250 800 270 L 800 500 L 0 500 Z"
                fill={mapMode === 'slope' ? '#78350f' : '#431407'}
                fillOpacity="0.35"
              />

              {/* Hellas Impact Basin (Deepest basin on Mars, -8200m) */}
              <ellipse cx="530" cy="380" rx="75" ry="50" fill="url(#hellasDepression)" />
              <ellipse cx="530" cy="380" rx="75" ry="50" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <text x="530" y="385" fill="#a5b4fc" fontSize="9" textAnchor="middle" letterSpacing="0.08em" opacity="0.75">
                HELLAS BASIN (-8,200m)
              </text>

              {/* Olympus Mons Shield Volcano (+21,200m peak) */}
              <circle cx="180" cy="210" r="55" fill="url(#olympusElev)" />
              <circle cx="180" cy="210" r="55" fill="none" stroke="#f97316" strokeWidth="1.2" opacity="0.6" />
              <circle cx="180" cy="210" r="38" fill="none" stroke="#fca5a5" strokeWidth="1.2" strokeDasharray="4 2" opacity="0.7" />
              <circle cx="180" cy="210" r="20" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
              <circle cx="180" cy="210" r="6" fill="#ffffff" opacity="0.95" />
              <text x="180" y="240" fill="#fecaca" fontSize="9" fontWeight="600" textAnchor="middle" letterSpacing="0.05em">
                OLYMPUS MONS (+21.2km)
              </text>

              {/* Tharsis Montes Volcanic Chain (Ascraeus, Pavonis, Arsia) */}
              <g opacity="0.7">
                <circle cx="230" cy="225" r="14" fill="#ea580c" opacity="0.5" />
                <circle cx="250" cy="265" r="15" fill="#ea580c" opacity="0.5" />
                <circle cx="270" cy="305" r="16" fill="#ea580c" opacity="0.5" />
                <text x="260" y="220" fill="#fdba74" fontSize="8" opacity="0.8">THARSIS MONTES</text>
              </g>

              {/* Valles Marineris Canyon System (-4000m to -7000m depth) */}
              <g id="valles-marineris">
                <path
                  d="M 265 295 Q 320 315 380 325 Q 430 330 470 305"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 265 295 Q 320 315 380 325 Q 430 330 470 305"
                  fill="none"
                  stroke="#1e1b4b"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 265 295 Q 320 315 380 325 Q 430 330 470 305"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.8"
                />
                <text x="365" y="340" fill="#fca5a5" fontSize="8.5" letterSpacing="0.06em" textAnchor="middle">
                  VALLES MARINERIS (-4,120m)
                </text>
              </g>

              {/* Major Impact Craters with Rims */}
              {/* Jezero Crater */}
              <circle cx="440" cy="220" r="26" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" opacity="0.85" />
              <path d="M 425 210 Q 435 220 445 215" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
              <text x="440" y="208" fill="#38bdf8" fontSize="8" fontWeight="600" textAnchor="middle">
                JEZERO DELTA
              </text>

              {/* Gale Crater */}
              <circle cx="610" cy="300" r="22" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" opacity="0.85" />
              <circle cx="610" cy="300" r="5" fill="#f97316" opacity="0.75" />
              <text x="610" y="290" fill="#fdba74" fontSize="8" textAnchor="middle">GALE CRATER</text>

              {/* Utopia Planitia Basin */}
              <ellipse cx="575" cy="130" rx="65" ry="35" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <text x="575" y="133" fill="#7dd3fc" fontSize="8" textAnchor="middle" letterSpacing="0.05em">
                UTOPIA LOWLANDS
              </text>
            </g>
          )}

          {/* =================================================================
              SLOPE ANALYSIS COLOR-CODED OVERLAY (When Mode is Slope or Highlight)
             ================================================================= */}
          {(mapMode === 'slope' || highlightSlopeType !== 'all') && (
            <g id="slope-analysis-layer">
              {/* Flat Slopes (<5°): Utopia & Lowlands (Green) */}
              {(highlightSlopeType === 'all' || highlightSlopeType === 'flat') && (
                <g opacity="0.7">
                  <ellipse cx="575" cy="130" rx="60" ry="30" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.2" />
                  <rect x="525" y="115" width="100" height="15" rx="3" fill="#064e3b" fillOpacity="0.85" />
                  <text x="575" y="126" fill="#34d399" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    🟢 FLAT SLOPE (1.1° / 1.9%)
                  </text>
                </g>
              )}

              {/* Moderate Slopes (5°-15°): Jezero & Gale Terraces (Amber) */}
              {(highlightSlopeType === 'all' || highlightSlopeType === 'moderate') && (
                <g opacity="0.75">
                  <circle cx="440" cy="220" r="25" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.2" />
                  <rect x="390" y="235" width="105" height="15" rx="3" fill="#78350f" fillOpacity="0.85" />
                  <text x="442" y="246" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    🟡 MODERATE (4.2° / 7.3%)
                  </text>
                </g>
              )}

              {/* Steep Slopes (>15°): Olympus Rupes & Valles Scarp (Red Warning) */}
              {(highlightSlopeType === 'all' || highlightSlopeType === 'steep') && (
                <g opacity="0.85">
                  <circle cx="180" cy="210" r="50" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                  <rect x="125" y="160" width="110" height="16" rx="3" fill="#7f1d1d" fillOpacity="0.9" stroke="#ef4444" strokeWidth="1" />
                  <text x="180" y="172" fill="#fca5a5" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    🔴 STEEP SCARP (14.8°–34.2°)
                  </text>
                </g>
              )}
            </g>
          )}

          {/* =================================================================
              LAYER 2: ROCKY & UNEVEN TERRAIN OVERLAY (If Layer Enabled)
             ================================================================= */}
          {layers.roughness && (
            <g id="roughness-layer">
              {/* Olympus Mons Basaltic Apron (Jagged Scree Zone) */}
              <path
                d="M 170 170 C 230 160 250 240 220 270 C 180 290 140 260 130 220 Z"
                fill="url(#boulderPattern)"
                opacity="0.85"
              />
              <rect x="135" y="275" width="105" height="15" rx="3" fill="#0b0f19" fillOpacity="0.8" stroke="#ef4444" strokeWidth="0.8" />
              <text x="140" y="286" fill="#fca5a5" fontSize="7.5" fontWeight="600">
                ⚠️ JAGGED BASALT BLOCKS
              </text>

              {/* Valles Marineris Scarp Scree & Landslip Band */}
              <path
                d="M 280 285 Q 330 305 385 315 L 390 325 Q 335 315 285 295 Z"
                fill="url(#roughTerrainPattern)"
                opacity="0.9"
              />
              <rect x="300" y="345" width="115" height="15" rx="3" fill="#0b0f19" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="0.8" />
              <text x="305" y="356" fill="#fbbf24" fontSize="7.5" fontWeight="600">
                ⚠️ TALUS SCREE & SLIP RISK
              </text>

              {/* Jezero Delta Sand Wave Drift Field */}
              <ellipse cx="452" cy="226" rx="14" ry="9" fill="url(#roughTerrainPattern)" opacity="0.85" />
            </g>
          )}

          {/* =================================================================
              LAYER 3: COORDINATE GRID & LAT/LON PARALLELS (If Layer Enabled)
             ================================================================= */}
          {layers.grid && (
            <g id="grid-layer" opacity="0.4" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 4">
              <line x1="0" y1="62" x2="800" y2="62" />
              <line x1="0" y1="156" x2="800" y2="156" />
              <line x1="0" y1="250" x2="800" y2="250" stroke="#475569" strokeWidth="1.2" strokeDasharray="none" />
              <line x1="0" y1="344" x2="800" y2="344" />
              <line x1="0" y1="438" x2="800" y2="438" />

              <line x1="133" y1="0" x2="133" y2="500" />
              <line x1="266" y1="0" x2="266" y2="500" />
              <line x1="400" y1="0" x2="400" y2="500" stroke="#475569" strokeWidth="1.2" strokeDasharray="none" />
              <line x1="533" y1="0" x2="533" y2="500" />
              <line x1="666" y1="0" x2="666" y2="500" />

              <text x="5" y="60" fill="#64748b" fontSize="8">60°N</text>
              <text x="5" y="154" fill="#64748b" fontSize="8">30°N</text>
              <text x="5" y="248" fill="#94a3b8" fontSize="8" fontWeight="600">0° EQUATOR</text>
              <text x="5" y="342" fill="#64748b" fontSize="8">30°S</text>
              <text x="5" y="436" fill="#64748b" fontSize="8">60°S</text>

              <text x="135" y="495" fill="#64748b" fontSize="8">60°E</text>
              <text x="268" y="495" fill="#64748b" fontSize="8">120°E</text>
              <text x="402" y="495" fill="#94a3b8" fontSize="8" fontWeight="600">180°E</text>
              <text x="535" y="495" fill="#64748b" fontSize="8">240°E</text>
              <text x="668" y="495" fill="#64748b" fontSize="8">300°E</text>
            </g>
          )}

          {/* =================================================================
              LAYER 4: INTERACTIVE REGION SECTOR NODES
             ================================================================= */}
          <g id="regions-layer">
            {regions.map((reg) => {
              const isSelected = reg.id === selectedRegionId;
              const coords = reg.mapCoords || { x: 400, y: 250 };

              return (
                <g
                  key={reg.id}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRegion(reg.id);
                  }}
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  style={{ cursor: 'pointer' }}
                  className={styles.mapRegionNode}
                >
                  {/* Selection Radar Rings */}
                  {isSelected && (
                    <>
                      <circle cx="0" cy="0" r="26" fill="none" stroke="#38bdf8" strokeWidth="1.5" className={styles.radarPing} />
                      <circle cx="0" cy="0" r="19" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
                    </>
                  )}

                  {/* Core Node Marker */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 8 : 6}
                    fill={isSelected ? '#38bdf8' : '#f97316'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Sector Title Label */}
                  <g transform="translate(0, 18)">
                    <rect
                      x="-55"
                      y="-10"
                      width="110"
                      height="16"
                      rx="3"
                      fill="#070a13"
                      fillOpacity="0.88"
                      stroke={isSelected ? '#38bdf8' : '#334155'}
                      strokeWidth={isSelected ? 1.5 : 0.8}
                    />
                    <text
                      x="0"
                      y="1"
                      fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                      fontSize="8"
                      fontWeight={isSelected ? '700' : '500'}
                      textAnchor="middle"
                    >
                      {reg.name.split(' - ')[0]}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* =================================================================
              LAYER 5: HAZARD DETECTION MARKERS (If Layer Enabled)
             ================================================================= */}
          {layers.hazards && (
            <g id="hazards-layer">
              {hazards.map((haz) => {
                const isSelected = haz.id === selectedHazardId;
                const isHovered = hoveredHazard?.id === haz.id;
                const coords = haz.mapCoords || { x: 410, y: 240 };
                const severity = (haz.severity || 'MEDIUM').toUpperCase();
                const isObserved = haz.observationType === 'OBSERVED';

                let markerColor = '#f59e0b'; // Medium (Amber)
                if (severity === 'HIGH' || severity === 'CRITICAL') markerColor = '#ef4444'; // High (Red)
                else if (severity === 'LOW') markerColor = '#10b981'; // Low (Green)

                return (
                  <g
                    key={haz.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHazard(haz.id);
                    }}
                    onMouseEnter={() => setHoveredHazard(haz)}
                    onMouseLeave={() => setHoveredHazard(null)}
                    style={{ cursor: 'pointer' }}
                    className={styles.mapHazardMarker}
                  >
                    {/* Pulsing halo */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 16 : 12}
                      fill="none"
                      stroke={markerColor}
                      strokeWidth={isSelected ? 2 : 1.2}
                      strokeDasharray={isObserved ? 'none' : '3 2'}
                      className={styles.hazardPulse}
                      opacity={isSelected ? 1 : 0.65}
                    />

                    {/* Distinct Marker Geometry: Circle for Observed, Diamond for Estimated */}
                    {isObserved ? (
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 9 : 7}
                        fill={markerColor}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <polygon
                        points="0,-9 9,0 0,9 -9,0"
                        fill={markerColor}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Symbol / Glyph */}
                    <text x="0" y="3" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                      {isObserved ? '●' : '!'}
                    </text>

                    {/* Tooltip on hover or selection */}
                    {(isHovered || isSelected) && (
                      <g transform="translate(14, -28)" pointerEvents="none">
                        <rect
                          x="0"
                          y="0"
                          width="180"
                          height="50"
                          rx="4"
                          fill="#0b0f19"
                          stroke={markerColor}
                          strokeWidth="1.2"
                          filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.8))"
                        />
                        <text x="8" y="14" fill="#f8fafc" fontSize="8" fontWeight="bold">
                          {haz.title.length > 25 ? haz.title.substring(0, 23) + '...' : haz.title}
                        </text>
                        <text x="8" y="26" fill={markerColor} fontSize="7.5" fontWeight="600">
                          {severity} RISK • {haz.type || haz.category}
                        </text>
                        <text x="8" y="36" fill={isObserved ? '#38bdf8' : '#c084fc'} fontSize="7" fontWeight="500">
                          {isObserved ? '🛰️ OBSERVED (HiRISE/CTX)' : '🧪 ESTIMATED (Simulated Altimetry)'}
                        </text>
                        <text x="8" y="46" fill="#94a3b8" fontSize="6.8">
                          📍 {haz.coordinates || haz.location} • Click to inspect
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* =================================================================
              LAYER 6: ACTIVE INSPECTION LOCATION PIN / RETICLE
             ================================================================= */}
          {inspectorPin && !activeRoute && (
            <g transform={`translate(${inspectorPin.x}, ${inspectorPin.y})`} pointerEvents="none">
              <circle cx="0" cy="0" r="16" fill="none" stroke="#22d3ee" strokeWidth="1.5" className={styles.radarPing} />
              <polygon points="0,-12 6,-2 0,4 -6,-2" fill="#22d3ee" stroke="#ffffff" strokeWidth="1" />
              <circle cx="0" cy="-2" r="2" fill="#0f172a" />
              <rect x="-45" y="-28" width="90" height="14" rx="3" fill="#080b13" stroke="#22d3ee" strokeWidth="0.8" />
              <text x="0" y="-18" fill="#22d3ee" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                PROBE TARGET
              </text>
            </g>
          )}

          {/* =================================================================
              LAYER 7: EXPERIMENTAL ROUTE PLANNING VISUALIZATION
             ================================================================= */}
          {/* Active Generated Route Path */}
          {activeRoute && activeRoute.pathD && (
            <g id="route-layer" pointerEvents="none">
              {/* Outer Glow Halo */}
              <path
                d={activeRoute.pathD}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="7"
                strokeOpacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main Glowing Traverse Line */}
              <path
                d={activeRoute.pathD}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Intermediate Waypoints along the Route */}
              {activeRoute.waypoints && activeRoute.waypoints.slice(1, -1).map((wp) => (
                <g key={wp.step} transform={`translate(${wp.mapCoords.x}, ${wp.mapCoords.y})`}>
                  <circle cx="0" cy="0" r="4.5" fill="#080c16" stroke="#22d3ee" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="2" fill="#ffffff" />
                </g>
              ))}
            </g>
          )}

          {/* Start Location Pin [A] */}
          {(routeStart || activeRoute?.startLocation) && (
            (() => {
              const startObj = routeStart || activeRoute.startLocation;
              const sCoords = startObj.mapCoords || { x: 440, y: 220 };
              return (
                <g transform={`translate(${sCoords.x}, ${sCoords.y})`} pointerEvents="none">
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#10b981" strokeWidth="1.5" className={styles.radarPing} />
                  <circle cx="0" cy="0" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="3.5" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    A
                  </text>
                  <g transform="translate(0, -18)">
                    <rect x="-35" y="-12" width="70" height="15" rx="3" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
                    <text x="0" y="-2" fill="#34d399" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                      START [A]
                    </text>
                  </g>
                </g>
              );
            })()
          )}

          {/* Destination Location Pin [B] */}
          {(routeDest || activeRoute?.destLocation) && (
            (() => {
              const destObj = routeDest || activeRoute.destLocation;
              const dCoords = destObj.mapCoords || { x: 570, y: 130 };
              return (
                <g transform={`translate(${dCoords.x}, ${dCoords.y})`} pointerEvents="none">
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" className={styles.radarPing} />
                  <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="3.5" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    B
                  </text>
                  <g transform="translate(0, -18)">
                    <rect x="-35" y="-12" width="70" height="15" rx="3" fill="#7f1d1d" stroke="#ef4444" strokeWidth="0.8" />
                    <text x="0" y="-2" fill="#fca5a5" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                      DEST [B]
                    </text>
                  </g>
                </g>
              );
            })()
          )}

          {/* =================================================================
              LAYER 8: SCIENTIFIC POINTS OF INTEREST (POIs)
             ================================================================= */}
          {layers.poi && pois.length > 0 && (
            <g id="poi-layer">
              {pois.map((poi) => {
                const isSelected = poi.id === selectedPoiId;
                const isHovered = hoveredPoi?.id === poi.id;
                const coords = poi.mapCoords || { x: 400, y: 250 };

                return (
                  <g
                    key={poi.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectPoi) onSelectPoi(poi.id);
                    }}
                    onMouseEnter={() => setHoveredPoi(poi)}
                    onMouseLeave={() => setHoveredPoi(null)}
                    style={{ cursor: 'pointer' }}
                    className={styles.mapPoiMarker}
                  >
                    {/* Pulsing scientific beacon halo */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.8"
                        className={styles.radarPing}
                      />
                    )}

                    {/* Scientific Diamond Marker */}
                    <polygon
                      points="0,-12 12,0 0,12 -12,0"
                      fill={isSelected ? '#0284c7' : '#080c16'}
                      stroke={isSelected ? '#38bdf8' : '#f59e0b'}
                      strokeWidth={isSelected ? 2 : 1.4}
                    />

                    {/* Science Glyph / Icon */}
                    <text x="0" y="3.5" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">
                      {poi.icon || '🔬'}
                    </text>

                    {/* POI Name Badge */}
                    <g transform="translate(0, 18)">
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="15"
                        rx="3"
                        fill="#080c16"
                        fillOpacity="0.9"
                        stroke={isSelected ? '#38bdf8' : '#334155'}
                        strokeWidth={isSelected ? 1.5 : 0.8}
                      />
                      <text
                        x="0"
                        y="1"
                        fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                        fontSize="7.5"
                        fontWeight={isSelected ? 'bold' : '600'}
                        textAnchor="middle"
                      >
                        {poi.name.length > 14 ? poi.name.substring(0, 12) + '...' : poi.name}
                      </text>
                    </g>

                    {/* Rich Tooltip on Hover */}
                    {(isHovered || isSelected) && (
                      <g transform="translate(16, -30)" pointerEvents="none">
                        <rect
                          x="0"
                          y="0"
                          width="190"
                          height="52"
                          rx="4"
                          fill="#0b0f19"
                          stroke="#38bdf8"
                          strokeWidth="1.2"
                          filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.85))"
                        />
                        <text x="8" y="14" fill="#f8fafc" fontSize="8" fontWeight="bold">
                          🔬 {poi.name}
                        </text>
                        <text x="8" y="26" fill="#38bdf8" fontSize="7.2" fontWeight="600">
                          {poi.category}
                        </text>
                        <text x="8" y="37" fill="#cbd5e1" fontSize="6.8">
                          📍 {poi.coordinates} • Elev: {poi.elevation}
                        </text>
                        <text x="8" y="47" fill="#94a3b8" fontSize="6.5" fontStyle="italic">
                          Click to inspect verified geological characteristics
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Dynamic Interactive Crosshair on Hover */}
          {cursorTelemetry.active && (
            <g transform={`translate(${cursorTelemetry.x}, ${cursorTelemetry.y})`} pointerEvents="none">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="-18" y1="0" x2="-6" y2="0" stroke="#38bdf8" strokeWidth="1" />
              <line x1="6" y1="0" x2="18" y2="0" stroke="#38bdf8" strokeWidth="1" />
              <line x1="0" y1="-18" x2="0" y2="-6" stroke="#38bdf8" strokeWidth="1" />
              <line x1="0" y1="6" x2="0" y2="18" stroke="#38bdf8" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Map Info Footer: Scale Bar & Mode-Aware Color Legend */}
      <div className={styles.mapFooterBar}>
        {/* Scale Bar */}
        <div className={styles.scaleBarGroup}>
          <div className={styles.scaleBarLine}>
            <div className={styles.scaleBarTick} />
            <div className={styles.scaleBarTick} />
            <div className={styles.scaleBarTick} />
          </div>
          <span className={styles.scaleBarLabel}>0 — 500 — 1,000 km (Simulated Scale)</span>
        </div>

        {/* Legend dependent on current Map Mode */}
        {mapMode === 'slope' ? (
          <div className={styles.elevationLegend}>
            <span className={styles.legendLabel}>Slope Classification:</span>
            <div className={styles.slopeLegendColors}>
              <span style={{ color: '#34d399' }}>● Flat (&lt;5°)</span>
              <span style={{ color: '#fbbf24' }}>● Moderate (5°–15°)</span>
              <span style={{ color: '#f87171' }}>● Steep (&gt;15°)</span>
            </div>
          </div>
        ) : (
          <div className={styles.elevationLegend}>
            <span className={styles.legendLabel}>Elevation Datum:</span>
            <div className={styles.legendGradient} />
            <div className={styles.legendValues}>
              <span>-8 km (Basin)</span>
              <span>0 m (Datum)</span>
              <span>+21 km (Peak)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
