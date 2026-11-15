/**
 * Simulated Mars Data for Member 3: Terrain Analysis, Hazard Identification, Mission Planning
 * 
 * DISCLAIMER: ALL DATA IS SIMULATED FOR RESEARCH PROTOTYPING AND ROBOTIC RECONNAISSANCE.
 * NOT CERTIFIED FOR CREWED MISSIONS OR ASTRONAUT TRANSIT.
 */

export const SIMULATED_REGIONS = [
  {
    id: "reg-01",
    name: "Jezero Crater - Delta Front",
    quadrant: "MC-13 Syrtis Major",
    coordinates: "18.38°N, 77.58°E",
    mapCoords: { x: 440, y: 220 },
    baseElevation: "-2,530 m",
    elevationMeters: -2530,
    elevationMinMeters: -2680,
    elevationMaxMeters: -2380,
    traversabilityScore: 82, // out of 100
    slopeAngle: "4.2°",
    slopeAngleNum: 4.2,
    maxSlopeAngle: "16.5°",
    slopeStatus: "Stable (Low Incline)",
    soilComposition: "Clay-rich lacustrine mudstone with olivine-rich sand dunes",
    surfaceRoughness: "Moderate (0.35 m mean boulder dispersion)",
    rockRoughness: {
      rockinessRating: "Moderate",
      meanBoulderSizeM: 0.35,
      rockAbundancePercent: 18,
      soilBearingCapacityKPa: 145,
      unevenIndex: "35 / 100",
      bedrockType: "Stratified Sedimentary Shales"
    },
    slopeDistribution: {
      gentle: 72,
      moderate: 22,
      severe: 6
    },
    elevationProfile: [
      { point: "Western Rim", distKm: 0, altM: -2380 },
      { point: "Delta Apron", distKm: 3, altM: -2470 },
      { point: "Kodiak Butte Base", distKm: 6, altM: -2530 },
      { point: "Delta Scarp", distKm: 9, altM: -2505 },
      { point: "Crater Floor Central", distKm: 12, altM: -2560 },
      { point: "Lacustrine Flat", distKm: 15, altM: -2580 }
    ],
    recommendedSpeed: "2.8 km/h",
    description: "Ancient river delta deposit offering relatively consolidated sedimentary terraces with high scientific value but occasional loose eolian sand traps.",
    hazardIds: ["haz-101", "haz-102", "haz-109"]
  },
  {
    id: "reg-02",
    name: "Olympus Mons - Eastern Basaltic Apron",
    quadrant: "MC-09 Tharsis",
    coordinates: "18.65°N, 226.20°E",
    mapCoords: { x: 190, y: 215 },
    baseElevation: "+8,200 m",
    elevationMeters: 8200,
    elevationMinMeters: 7400,
    elevationMaxMeters: 9600,
    traversabilityScore: 48,
    slopeAngle: "14.8°",
    slopeAngleNum: 14.8,
    maxSlopeAngle: "34.2°",
    slopeStatus: "Severe Slope Warning",
    soilComposition: "Dense basaltic lava sheets, razor-sharp scoria, and vesicular boulders",
    surfaceRoughness: "High (0.85 m jagged vesicular blocks)",
    rockRoughness: {
      rockinessRating: "Extreme / Hazardous",
      meanBoulderSizeM: 0.85,
      rockAbundancePercent: 44,
      soilBearingCapacityKPa: 310,
      unevenIndex: "82 / 100",
      bedrockType: "Extrusive Basaltic Shield Lava"
    },
    slopeDistribution: {
      gentle: 24,
      moderate: 48,
      severe: 28
    },
    elevationProfile: [
      { point: "Outer Glacis", distKm: 0, altM: 7400 },
      { point: "Basalt Terrace A", distKm: 4, altM: 7900 },
      { point: "Escarpment Foot", distKm: 8, altM: 8200 },
      { point: "Rupes Incline", distKm: 12, altM: 8950 },
      { point: "Lava Ridge", distKm: 16, altM: 9600 }
    ],
    recommendedSpeed: "1.2 km/h",
    description: "Steep volcanic incline with sharp igneous shards and sheer scarp precipices. Demands conservative wheel torque and frequent path corrections.",
    hazardIds: ["haz-103", "haz-104"]
  },
  {
    id: "reg-03",
    name: "Valles Marineris - Candor Chasma Floor",
    quadrant: "MC-18 Coprates",
    coordinates: "6.52°S, 284.10°E",
    mapCoords: { x: 310, y: 310 },
    baseElevation: "-4,120 m",
    elevationMeters: -4120,
    elevationMinMeters: -4800,
    elevationMaxMeters: -3200,
    traversabilityScore: 64,
    slopeAngle: "8.5°",
    slopeAngleNum: 8.5,
    maxSlopeAngle: "26.0°",
    slopeStatus: "Moderate Incline / Scree Risk",
    soilComposition: "Sulfate-rich hydrated deposits layered with loose eolian drift sand",
    surfaceRoughness: "High-Variable (deep gullies and talus scree slopes)",
    rockRoughness: {
      rockinessRating: "High-Variable",
      meanBoulderSizeM: 0.55,
      rockAbundancePercent: 31,
      soilBearingCapacityKPa: 95,
      unevenIndex: "68 / 100",
      bedrockType: "Hydrated Sulfates & Talus Breccia"
    },
    slopeDistribution: {
      gentle: 45,
      moderate: 35,
      severe: 20
    },
    elevationProfile: [
      { point: "Chasma North Scarp", distKm: 0, altM: -3200 },
      { point: "Talus Slope Upper", distKm: 3, altM: -3650 },
      { point: "Layered Sulfate Mound", distKm: 7, altM: -4120 },
      { point: "Trench Axis", distKm: 11, altM: -4550 },
      { point: "Southern Talus Bed", distKm: 15, altM: -4300 }
    ],
    recommendedSpeed: "1.9 km/h",
    description: "Deep canyon valley floor with layered sulfate mounds and unstable talus slopes along the trench walls.",
    hazardIds: ["haz-105"]
  },
  {
    id: "reg-04",
    name: "Utopia Planitia - Smooth Lowlands",
    quadrant: "MC-06 Casius",
    coordinates: "46.70°N, 117.50°E",
    mapCoords: { x: 570, y: 130 },
    baseElevation: "-3,850 m",
    elevationMeters: -3850,
    elevationMinMeters: -4000,
    elevationMaxMeters: -3700,
    traversabilityScore: 94,
    slopeAngle: "1.1°",
    slopeAngleNum: 1.1,
    maxSlopeAngle: "3.8°",
    slopeStatus: "Optimal (Flat Plain)",
    soilComposition: "Uniform regolith overlying subsurface water-ice permafrost",
    surfaceRoughness: "Low (0.12 m uniform pebble field)",
    rockRoughness: {
      rockinessRating: "Minimal",
      meanBoulderSizeM: 0.12,
      rockAbundancePercent: 6,
      soilBearingCapacityKPa: 220,
      unevenIndex: "12 / 100",
      bedrockType: "Periglacial Regolith Over Water Ice"
    },
    slopeDistribution: {
      gentle: 94,
      moderate: 5,
      severe: 1
    },
    elevationProfile: [
      { point: "Lowland Sector Alpha", distKm: 0, altM: -3860 },
      { point: "Polygonal Ice Ground", distKm: 5, altM: -3854 },
      { point: "Subsurface Radar Target", distKm: 10, altM: -3850 },
      { point: "Permafrost Plain East", distKm: 15, altM: -3842 },
      { point: "Scalloped Depression", distKm: 20, altM: -3848 }
    ],
    recommendedSpeed: "4.5 km/h",
    description: "Extensive northern lowland plains offering optimal rover traction, flat ground, and shallow subsurface ice deposits.",
    hazardIds: ["haz-106"]
  },
  {
    id: "reg-05",
    name: "Gale Crater - Mount Sharp Foothills",
    quadrant: "MC-23 Aeolis",
    coordinates: "5.38°S, 137.44°E",
    mapCoords: { x: 610, y: 300 },
    baseElevation: "-4,450 m",
    elevationMeters: -4450,
    elevationMinMeters: -4550,
    elevationMaxMeters: -3900,
    traversabilityScore: 76,
    slopeAngle: "5.8°",
    slopeAngleNum: 5.8,
    maxSlopeAngle: "18.2°",
    slopeStatus: "Moderate Stepped Terraces",
    soilComposition: "Hematite, smectite clays, and sulfate-bearing stratified mudstone",
    surfaceRoughness: "Moderate-High (stepped caprock and yardang ridges)",
    rockRoughness: {
      rockinessRating: "Moderate-High",
      meanBoulderSizeM: 0.42,
      rockAbundancePercent: 22,
      soilBearingCapacityKPa: 165,
      unevenIndex: "48 / 100",
      bedrockType: "Stratified Lacustrine Sediments"
    },
    slopeDistribution: {
      gentle: 62,
      moderate: 29,
      severe: 9
    },
    elevationProfile: [
      { point: "Bradbury Landing", distKm: 0, altM: -4520 },
      { point: "Yellowknife Bay", distKm: 3, altM: -4500 },
      { point: "Bagnold Dune Field", distKm: 6, altM: -4475 },
      { point: "Murray Butte Base", distKm: 10, altM: -4430 },
      { point: "Vera Rubin Ridge", distKm: 14, altM: -4380 }
    ],
    recommendedSpeed: "2.4 km/h",
    description: "Complex sedimentary sequence at the base of Aeolis Mons, exhibiting inverted channels, wind-carved yardangs, and hematite ridges.",
    hazardIds: ["haz-107", "haz-108"]
  }
];

export const SIMULATED_HAZARDS = [
  {
    id: "haz-101",
    regionId: "reg-01",
    title: "Active Sand Ripple Field (Wheel Trap Risk)",
    type: "Uneven Terrain",
    severity: "HIGH",
    observationType: "OBSERVED", // Supported by actual MRO HiRISE optical imaging
    sourceDetails: "MRO HiRISE Stereo Pair (ESP_065321_1985) confirmed dune wavelength & height",
    coordinates: "18.39°N, 77.56°E",
    mapCoords: { x: 450, y: 225 },
    radiusMeters: 320,
    slopeImpact: "High wheel sinkage > 14 cm; loose granular shearing prevents traction.",
    description: "Unconsolidated active sand ripple field across the lower delta front. Loose coarse grains fail under wheel shear, inducing severe slippage and chassis high-centering risk.",
    mitigation: "Engage six-wheel differential locking; enforce 0.5 km/h creep; detour via northern consolidated mudstone terrace.",
    icon: "🏖️"
  },
  {
    id: "haz-102",
    regionId: "reg-01",
    title: "Jezero Rim Escarpment & Fractured Scarp",
    type: "Crater & Caldera",
    severity: "MEDIUM",
    observationType: "OBSERVED", // Confirmed by orbital imagery
    sourceDetails: "High-resolution MRO Context Camera (CTX) mosaic mapping",
    coordinates: "18.52°N, 77.42°E",
    mapCoords: { x: 425, y: 210 },
    radiusMeters: 850,
    slopeImpact: "Local slope up to 16.5°; loose breccia blocks line the crater wall.",
    description: "Steep impact crater wall boundary featuring stepped fault scarps, shattered impact breccia blocks, and restricted egress gullies.",
    mitigation: "Ascend strictly through designated paleochannel gap; maintain continuous visual odometry to avoid boulder fields.",
    icon: "🌋"
  },
  {
    id: "haz-103",
    regionId: "reg-02",
    title: "Olympus Mons Jagged Basaltic Blockfield",
    type: "Rocky Obstacle",
    severity: "HIGH",
    observationType: "ESTIMATED", // Derived from simulated radar backscatter
    sourceDetails: "Estimated from MOLA roughness RMS and radar backscatter simulation",
    coordinates: "18.62°N, 226.15°E",
    mapCoords: { x: 205, y: 210 },
    radiusMeters: 1400,
    slopeImpact: "44% rock coverage; mean boulder diameter 0.85 m exceeds chassis ground clearance (0.45 m).",
    description: "Dense fields of vesicular basalt boulders and volcanic slag resulting from ancient flank eruptions. Sharp rock edges threaten wheel gouging and drive-train entrapment.",
    mitigation: "Autonomous stereo obstacle avoidance pathing; execute 150 m buffer bypass; maximum speed capped at 1.0 km/h.",
    icon: "🪨"
  },
  {
    id: "haz-104",
    regionId: "reg-02",
    title: "Olympus Mons Basal Scarp Precipice",
    type: "Steep Slope",
    severity: "HIGH",
    observationType: "OBSERVED", // MOLA & HiRISE verified
    sourceDetails: "MOLA altimetry track elevation drop confirmed over 6,000 meters vertical",
    coordinates: "18.80°N, 225.80°E",
    mapCoords: { x: 175, y: 195 },
    radiusMeters: 3500,
    slopeImpact: "Vertical basalt cliff wall with local slopes between 28.5° and 34.2°.",
    description: "Colossal boundary scarp surrounding the Olympus shield volcano. The terrain drops sheer into the surrounding plains, creating an impassable barrier and lethal rollover hazard.",
    mitigation: "Strict exclusion zone! Rover navigation system must enforce an automated 500 m standoff perimeter from the scarp lip.",
    icon: "⚠️"
  },
  {
    id: "haz-105",
    regionId: "reg-03",
    title: "Candor Chasma Acute Talus Landslip",
    type: "Steep Slope",
    severity: "HIGH",
    observationType: "ESTIMATED", // Derived from slope modeling
    sourceDetails: "Slope stability simulation based on simulated sulfate sediment angle of repose",
    coordinates: "6.48°S, 284.05°E",
    mapCoords: { x: 325, y: 315 },
    radiusMeters: 1200,
    slopeImpact: "Slope angle 26.0° to 32.0°; exceeds sediment angle of repose.",
    description: "Unstable talus slope composed of pulverized hydrated sulfate beds and loose breccia. Gravitational sliding triggers progressive scree slips when traversed by wheeled vehicles.",
    mitigation: "Traverse exclusively along the central flat chasma floor; avoid scarp toe vibrations; deploy ground radar prior to approach.",
    icon: "📉"
  },
  {
    id: "haz-106",
    regionId: "reg-04",
    title: "Utopia Planitia Sublimation Pits",
    type: "Uneven Terrain",
    severity: "LOW",
    observationType: "ESTIMATED", // Derived from subsurface dielectric radar simulation
    sourceDetails: "Simulated SHARAD shallow radar dielectric anomaly & permafrost model",
    coordinates: "46.72°N, 117.55°E",
    mapCoords: { x: 585, y: 135 },
    radiusMeters: 250,
    slopeImpact: "Mild surface depression 0.4 m to 1.1 m depth; slope 1.1° to 3.5°.",
    description: "Scalloped periglacial thermokarst depressions formed by subsurface ice sublimation. Minor ground undulation with negligible traction loss.",
    mitigation: "Nominal rover speed (3.5–4.5 km/h) permitted; monitor wheel torque sensors for soft permafrost patches.",
    icon: "❄️"
  },
  {
    id: "haz-107",
    regionId: "reg-05",
    title: "Aeolis Yardang Bedrock Puncture Fins",
    type: "Rocky Obstacle",
    severity: "MEDIUM",
    observationType: "OBSERVED", // Curiosity rover traverse ground observation
    sourceDetails: "Curiosity Rover Mastcam & Hazcam optical observations along yardang corridor",
    coordinates: "5.42°S, 137.50°E",
    mapCoords: { x: 620, y: 310 },
    radiusMeters: 480,
    slopeImpact: "Stepped bedrock fins up to 0.7 m tall with razor wind-carved crests.",
    description: "Inverted wind-carved yardangs and resistant hematite ridges protruding vertically from the regolith. Capable of puncturing aluminum wheel treads.",
    mitigation: "Engage visual odometry rock-avoidance; speed capped at 1.5 km/h; navigate along eolian gravel conduits between yardang fins.",
    icon: "🪨"
  },
  {
    id: "haz-108",
    regionId: "reg-05",
    title: "Gale Crater Central Peak Debris Fan",
    type: "Crater & Caldera",
    severity: "LOW",
    observationType: "OBSERVED", // HiRISE optical validation
    sourceDetails: "MRO HiRISE validated alluvial sediment fan with consolidated pebble pavement",
    coordinates: "5.35°S, 137.40°E",
    mapCoords: { x: 605, y: 295 },
    radiusMeters: 750,
    slopeImpact: "Consistent 4.5° incline; firm gravelly surface pavement.",
    description: "Consolidated alluvial fan spreading outward from Mount Sharp's northern flank. Minimal obstacle density; provides relatively safe transit corridor.",
    mitigation: "Maintain standard drive telemetry; low risk of wheel entrapment or catastrophic slip.",
    icon: "🌋"
  },
  {
    id: "haz-109",
    regionId: "reg-01",
    title: "Regional Dust Storm Inflow (Atmospheric)",
    type: "Atmospheric & Dust",
    severity: "MEDIUM",
    observationType: "OBSERVED", // MARCI daily global weather scan
    sourceDetails: "Mars Color Imager (MARCI) orbital scan tracking regional atmospheric dust veil",
    coordinates: "19.10°N, 76.80°E",
    mapCoords: { x: 410, y: 195 },
    radiusMeters: 45000,
    slopeImpact: "Zero direct structural hazard; optical opacity tau > 2.2.",
    description: "Atmospheric dust veil approaching Jezero Crater. Airborne fines obscure optical navigation cameras and reduce solar panel power generation by 65%.",
    mitigation: "Prepare battery reserves; park rover into wind-sheltered lee of Kodiak Butte; calibrate laser retroreflectors for low visibility.",
    icon: "🌪️"
  }
];

export const SIMULATED_MISSION_ROUTES = [
  {
    id: "rte-alpha",
    name: "Delta Stratigraphy Survey (Route Alpha)",
    regionId: "reg-01",
    totalDistanceKm: 14.2,
    estimatedDurationHours: 6.5,
    estimatedPowerKwh: 3.4,
    hazardRiskIndex: "Moderate Risk",
    waypoints: [
      { step: 1, name: "Landing Zone 'Octavia'", lat: "18.375°N", lon: "77.581°E", elevation: "-2540m", objective: "System diagnostics & wheel telemetry check" },
      { step: 2, name: "Kodiak Butte Overlook", lat: "18.382°N", lon: "77.570°E", elevation: "-2510m", objective: "Multi-spectral panoramic imaging of bottomset beds" },
      { step: 3, name: "Delta Scarp Base (Sample Site 1)", lat: "18.391°N", lon: "77.562°E", elevation: "-2495m", objective: "Core sample collection from fine-grained mudstones" },
      { step: 4, name: "Safe Haven Plateau", lat: "18.398°N", lon: "77.555°E", elevation: "-2480m", objective: "Solar recharge & overnight communications relay" }
    ]
  },
  {
    id: "rte-beta",
    name: "Northern Ice Plain Fast Traverse (Route Beta)",
    regionId: "reg-04",
    totalDistanceKm: 28.6,
    estimatedDurationHours: 7.2,
    estimatedPowerKwh: 4.8,
    hazardRiskIndex: "Low Risk",
    waypoints: [
      { step: 1, name: "Base Station Arcadia", lat: "46.680°N", lon: "117.480°E", elevation: "-3860m", objective: "Pre-traverse power & thermal check" },
      { step: 2, name: "Ice Horizon Sounding Point", lat: "46.710°N", lon: "117.520°E", elevation: "-3852m", objective: "High-frequency radar depth profiling of pure ice" },
      { step: 3, name: "Polygonal Ground Depot", lat: "46.745°N", lon: "117.580°E", elevation: "-3845m", objective: "Automated sample cache deployment" }
    ]
  }
];

export const MAP_TOPOGRAPHY_FEATURES = [
  { id: "feat-olympus", name: "Olympus Mons (21.2 km)", cx: 180, cy: 210, r: 55, type: "volcano" },
  { id: "feat-tharsis", name: "Tharsis Montes Volcanic Arc", x1: 220, y1: 220, x2: 270, y2: 320, type: "ridge" },
  { id: "feat-valles", name: "Valles Marineris Chasma", d: "M 270 290 Q 320 310 380 320 Q 420 325 460 305", type: "canyon" },
  { id: "feat-jezero", name: "Jezero Crater Basin", cx: 440, cy: 220, r: 28, type: "crater" },
  { id: "feat-utopia", name: "Utopia Lowland Basin", cx: 580, cy: 130, rx: 70, ry: 40, type: "basin" },
  { id: "feat-gale", name: "Gale Crater & Mt Sharp", cx: 610, cy: 300, r: 24, type: "crater" },
  { id: "feat-hellas", name: "Hellas Impact Basin (-8.2 km)", cx: 530, cy: 380, rx: 65, ry: 45, type: "basin" }
];

export const SCIENTIFIC_POIS = [
  {
    id: "poi-olympus",
    name: "Olympus Mons",
    category: "Volcanic Shield & Caldera",
    icon: "🌋",
    coordinates: "18.65°N, 226.20°E",
    lat: "18.65°N",
    lon: "226.20°E",
    mapCoords: { x: 180, y: 210 },
    elevation: "+21,229 m (Summit Datum)",
    elevationM: 21229,
    dimensions: "624 km diameter; 6 nested caldera pits",
    geologicalEpoch: "Amazonian to Hesperian (Active plume)",
    shortDescription: "The largest known volcano in the Solar System, towering 21.2 km above the Martian datum.",
    geologicalCharacteristics: "A gigantic effusive basaltic shield volcano built from successive fluid lava flows over millions of years. The absence of tectonic plate motion on Mars allowed the crust to remain stationary over a hot mantle plume, accumulating colossal vertical relief. The volcano is circumscribed by the Olympus Rupes basal scarp rising up to 8 km sheer above the plains.",
    verifiedScientificFacts: [
      "Official IAU Feature ID: 4426; first observed by telescopic astronomers as 'Nix Olympica'.",
      "Confirmed by Mariner 9, Viking Orbiter, MGS MOLA, and Mars Express HRSC stereoscopic mapping.",
      "Summit atmospheric pressure is only ~0.72 mbar (near-vacuum, ~8% of surface datum).",
      "Caldera depression measures 80 km × 60 km across with floor depth up to 3.2 km."
    ],
    sampleReconData: {
      traversabilityScore: 35,
      terrainDifficulty: "Extreme Hazard",
      chassisSuitability: "Restricted (Basal scarp requires specialized crawler / winch)",
      primaryObjective: "Basaltic magma differentiation & lava tube cavern reconnaissance"
    }
  },
  {
    id: "poi-valles",
    name: "Valles Marineris",
    category: "Tectonic Rift Canyon",
    icon: "峡",
    coordinates: "6.50°S, 284.10°E",
    lat: "6.50°S",
    lon: "284.10°E",
    mapCoords: { x: 365, y: 320 },
    elevation: "-4,120 m to -7,000 m",
    elevationM: -4120,
    dimensions: "4,000 km long; up to 200 km wide; up to 7 km deep",
    geologicalEpoch: "Hesperian (Tectonic extensional rifting)",
    shortDescription: "The colossal equatorial grand canyon of Mars, spanning nearly a quarter of the planetary circumference.",
    geologicalCharacteristics: "A colossal tectonic graben rift system created during the uplift and crustal stretching of the Tharsis volcanic swell. Subsequent catastrophic collapse, subterranean sapping by ancestral aquifers, and gigantic talus landslides widened the chasms into sheer-walled trenches containing massive interior layered sulfate deposits.",
    verifiedScientificFacts: [
      "Official IAU Feature ID: 6386; discovered by Mariner 9 in 1971 and named in honor of the spacecraft.",
      "CRISM spectrometer on MRO confirmed abundant hydrated magnesium/iron sulfates (kieserite, polyhydrated sulfates) on the chasma floor.",
      "Subsurface talus scree landslides have traveled over 100 km across the canyon bottom.",
      "Canyon floor atmospheric pressure is substantially higher than planetary average, aiding aerodynamic deceleration."
    ],
    sampleReconData: {
      traversabilityScore: 64,
      terrainDifficulty: "Moderate-High",
      chassisSuitability: "Favorable along floor center; extreme along scarp margins",
      primaryObjective: "Sedimentary sulfate stratigraphy & paleohydrology investigation"
    }
  },
  {
    id: "poi-jezero",
    name: "Jezero Crater",
    category: "Fluvial & Lacustrine Basin",
    icon: "🏖️",
    coordinates: "18.38°N, 77.58°E",
    lat: "18.38°N",
    lon: "77.58°E",
    mapCoords: { x: 440, y: 220 },
    elevation: "-2,530 m datum",
    elevationM: -2530,
    dimensions: "45 km diameter; 250 m thick river delta fan",
    geologicalEpoch: "Noachian to Early Hesperian (~3.8–3.5 Ga)",
    shortDescription: "An ancient impact crater lake fed by an energetic river system with preserved clay and carbonate delta deposits.",
    geologicalCharacteristics: "Hosts a prominent fan-shaped sedimentary river delta fed by Neretva Vallis, which breached the western crater rim. The lacustrine strata contain smectite clays, Fe/Mg carbonates, and olivine fines, preserving fine-grained mudstones formed in a neutral-pH aqueous environment ideal for astrobiological biosignature preservation.",
    verifiedScientificFacts: [
      "Official IAU Feature ID: 2840; selected as the NASA Mars 2020 mission landing site.",
      "Perseverance rover landed on February 18, 2021; confirmed igneous crater floor rocks overlain by lacustrine delta strata.",
      "Ingenuity Mars Helicopter completed 72 powered atmospheric flights across Jezero terrain.",
      "Over 24 sealed geological core sample tubes cached on the surface for Mars Sample Return."
    ],
    sampleReconData: {
      traversabilityScore: 82,
      terrainDifficulty: "Moderate",
      chassisSuitability: "Optimal on mudstone benches; caution on loose sand ripples",
      primaryObjective: "Astrobiological biosignature collection & delta sediment caching"
    }
  },
  {
    id: "poi-gale",
    name: "Gale Crater & Mount Sharp",
    category: "Sedimentary Stratigraphy",
    icon: "🏔️",
    coordinates: "5.38°S, 137.44°E",
    lat: "5.38°S",
    lon: "137.44°E",
    mapCoords: { x: 610, y: 300 },
    elevation: "-4,450 m floor; +5,500 m peak relief",
    elevationM: -4450,
    dimensions: "154 km diameter; 5.5 km central sedimentary mound",
    geologicalEpoch: "Late Noachian to Early Amazonian",
    shortDescription: "Impact basin holding a towering 5.5 km mountain of layered sediments recording Mars' transition from wet to arid climate.",
    geologicalCharacteristics: "Aeolis Mons (Mount Sharp) rises from the crater floor, exposing thousands of sedimentary strata. Lower layers feature fluvio-lacustrine mudstones deposited in ancient freshwater lakes (Yellowknife Bay), transitioning upward into sulfate-bearing sandstones and eolian yardangs recording the drying of Mars.",
    verifiedScientificFacts: [
      "Official IAU Feature ID: 2154; exploration target of NASA's Curiosity rover (MSL) since August 2012.",
      "Curiosity verified long-lived freshwater lake conditions capable of supporting microbial habitability.",
      "Sample Analysis at Mars (SAM) instrument detected indigenous organic molecules in 3.5-billion-year-old mudstone.",
      "Confirmed cyclic atmospheric methane variations and active seasonal regolith moisture exchange."
    ],
    sampleReconData: {
      traversabilityScore: 76,
      terrainDifficulty: "Moderate",
      chassisSuitability: "Proven wheeled mobility across stepped caprock terraces",
      primaryObjective: "Climate epoch boundary profiling & organic carbon preservation"
    }
  },
  {
    id: "poi-hellas",
    name: "Hellas Planitia (Hellas Basin)",
    category: "Giant Impact Basin",
    icon: "🪐",
    coordinates: "42.70°S, 70.00°E",
    lat: "42.70°S",
    lon: "70.00°E",
    mapCoords: { x: 530, y: 380 },
    elevation: "-8,200 m (Deepest point on Mars)",
    elevationM: -8200,
    dimensions: "2,300 km diameter; 9 km total rim-to-floor relief",
    geologicalEpoch: "Early Noachian (~4.1–3.8 Ga, Late Heavy Bombardment)",
    shortDescription: "The deepest and largest well-preserved impact basin on Mars, and one of the largest in the Solar System.",
    geologicalCharacteristics: "Formed by the catastrophic impact of a massive protoplanet ~4 billion years ago. Its extreme depth creates the highest surface atmospheric pressure on Mars (~12.4 mbar), which occasionally exceeds the triple point of pure water. The basin interior contains lobate debris aprons with thick buried water-ice glaciers insulated beneath rocky regolith.",
    verifiedScientificFacts: [
      "Official IAU Feature ID: 2426; mapped extensively by MGS MOLA altimetry and Mars Express OMEGA.",
      "SHARAD radar confirmed hundreds of meters of glacial ice preserved under rocky debris aprons.",
      "Primary genesis zone for global planetary dust storms triggered by intense solar heating and wind shear.",
      "Atmospheric density enables superior aerodynamic braking performance compared to all other Martian regions."
    ],
    sampleReconData: {
      traversabilityScore: 68,
      terrainDifficulty: "Moderate",
      chassisSuitability: "Excellent on flat floor; caution near dust storm season",
      primaryObjective: "Glacial subsurface ice sounding & dense atmosphere flight testing"
    }
  },
  {
    id: "poi-utopia",
    name: "Utopia Planitia",
    category: "Periglacial Lowland & Subsurface Ice",
    icon: "❄️",
    coordinates: "46.70°N, 117.50°E",
    lat: "46.70°N",
    lon: "117.50°E",
    mapCoords: { x: 570, y: 130 },
    elevation: "-3,850 m datum",
    elevationM: -3850,
    dimensions: "3,300 km diameter; extensive northern lowlands",
    geologicalEpoch: "Amazonian to Hesperian",
    shortDescription: "Vast northern plains basin holding giant polygon fractures and colossal buried sheets of pure water ice.",
    geologicalCharacteristics: "A periglacial landscape shaped by freeze-thaw thermal contraction and eolian sediment mantling. SHARAD ground-penetrating radar revealed an underground water-ice deposit holding as much volume as Lake Superior, buried just 1 to 10 meters beneath the insulating surface regolith.",
    verifiedScientificFacts: [
      "Official IAU Feature ID: 6271; landing site of NASA Viking 2 (1976) and China's Zhurong rover (2021).",
      "MRO SHARAD radar mapped an underground ice sheet spanning 375,000 km² with thickness up to 170 m.",
      "Zhurong rover ground-penetrating radar identified layered subsurface paleoflood deposits.",
      "Scalloped depressions demonstrate ongoing permafrost sublimation and micro-terrain collapse."
    ],
    sampleReconData: {
      traversabilityScore: 94,
      terrainDifficulty: "Low",
      chassisSuitability: "Highest mobility rating on Mars; smooth uniform regolith",
      primaryObjective: "ISRU subsurface water ice extraction & periglacial regolith mechanics"
    }
  }
];
