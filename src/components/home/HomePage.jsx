// Mission Control Homepage & Central Project Portal
// Interplanetary Survival Guide: Martian Map
// Unified NASA Aerospace Exploration System

import React from 'react';
import { useMarsMission } from '../../context/MarsMissionContext';
import {
  Compass,
  Radio,
  Route,
  Satellite,
  Globe,
  Database,
  Shield,
  Layers,
  Flame,
  Wind,
  Camera,
  LineChart,
  Mountain,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Target,
  Clock,
  Activity,
  Droplets,
  Sparkles,
  FileText
} from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const { navigateToModule, locations, setViewMode } = useMarsMission();

  const FEATURED_LANDMARKS = [
    {
      id: 'jezero-crater',
      name: 'Jezero Crater',
      subtitle: 'Mars 2020 Perseverance Delta',
      category: 'Active Rover Site',
      coords: '18.38°N, 77.58°E',
      elevation: -2500,
      viability: 88,
      accent: '#22c55e',
      desc: 'Ancient river delta lakebed rich in smectite clay minerals and river channel conglomerates. High biological preservation potential.'
    },
    {
      id: 'olympus-mons',
      name: 'Olympus Mons',
      subtitle: 'Solar System Megavolcano',
      category: 'Extreme Topography',
      coords: '18.65°N, 133.80°W',
      elevation: 21287,
      viability: 42,
      accent: '#f59e0b',
      desc: 'Extinct shield volcano rising 21.3 km above MOLA datum. Summit caldera reaches into the stratosphere with 0.5 mbar atmospheric pressure.'
    },
    {
      id: 'valles-marineris',
      name: 'Valles Marineris',
      subtitle: '4,000 km Tectonic Chasma',
      category: 'Canyon Escarpment',
      coords: '14.00°S, 59.20°W',
      elevation: -4500,
      viability: 74,
      accent: '#38bdf8',
      desc: 'Grand canyon rift spanning one quarter of Mars circumference. Sheer 8 km cliffs expose millions of years of layered Martian stratigraphy.'
    },
    {
      id: 'arcadia-planitia',
      name: 'Arcadia Planitia',
      subtitle: 'Candidate Colony Reserve',
      category: 'Glacial Reserve Base',
      coords: '39.30°N, 171.00°W',
      elevation: -3900,
      viability: 91,
      accent: '#06b6d4',
      desc: 'Vast smooth northern plains with abundant subsurface sheet ice 1-2.5 meters below surface. Prime candidate for human base ISRU water extraction.'
    },
    {
      id: 'hellas-planitia',
      name: 'Hellas Planitia',
      subtitle: 'Deepest Impact Basin',
      category: 'Atmospheric Lowland',
      coords: '42.70°S, 70.00°E',
      elevation: -7152,
      viability: 78,
      accent: '#a855f7',
      desc: 'Massive 2,300 km impact basin with Mars thickest atmosphere (~12.4 mbar). Increased natural cosmic radiation shielding at basin floor.'
    },
    {
      id: 'gale-crater',
      name: 'Gale Crater',
      subtitle: 'Curiosity Rover / Mount Sharp',
      category: 'Active Rover Site',
      coords: '4.59°S, 137.44°E',
      elevation: -4450,
      viability: 82,
      accent: '#3b82f6',
      desc: 'Central 5.5 km peak of sedimentary mudstone and sulfate salts. Curiosity rover confirmed ancient habitable freshwater lake conditions.'
    }
  ];

  const SURVIVAL_PILLARS = [
    {
      icon: Wind,
      title: 'Atmospheric Management',
      value: '95.3% CO2 • 7.2 hPa',
      badge: 'MOXIE Oxygen Protocol',
      desc: 'Ambient atmosphere is unbreathable and 100x thinner than Earth. Habitats require closed-loop solid oxide electrolysis (MOXIE) to convert atmospheric carbon dioxide into breathable O2.'
    },
    {
      icon: Droplets,
      title: 'ISRU Water Extraction',
      value: 'Radar Confirmed Glaciers',
      badge: 'Arcadia & Utopia Reservoirs',
      desc: 'Subsurface radar soundings (SHARAD) identify pure water ice sheets mere meters below surface dust. Direct thermal sublimation wellheads yield 4.5+ liters per colonist per Sol.'
    },
    {
      icon: Flame,
      title: 'Thermal Extremes & Insulation',
      value: '-18°C Day / -95°C Night',
      badge: 'THEMIS Thermal Inertia',
      desc: 'High diurnal swings cause severe mechanical thermal stress. Subsurface basalt regolith (-10cm) provides substantial thermal damping for habitat foundation insulation.'
    },
    {
      icon: AlertTriangle,
      title: 'Toxic Regolith Hazard',
      value: '0.5 - 1.0 wt% Perchlorates',
      badge: 'Severe Thyroid & Lung Toxin',
      desc: 'Martian dust contains toxic calcium and magnesium perchlorate salts (ClO4-). All astronauts returning from EVA traverses must undergo multi-stage ultrasonic regolith washdown.'
    }
  ];

  const handleQuickJump = (landmarkId) => {
    const loc = locations.find((l) => l.id === landmarkId) || FEATURED_LANDMARKS.find((l) => l.id === landmarkId);
    if (loc) {
      navigateToModule('member1-map', loc);
    } else {
      navigateToModule('member1-map');
    }
  };

  return (
    <div className="home-page-container">
      {/* Hero Mission Control Section */}
      <section className="home-hero-section">
        <div className="home-hero-backdrop-glow" />
        <div className="home-hero-content">
          <div className="home-mission-tagline">
            <span className="live-status-dot" />
            <span className="tagline-agency">NASA // JPL MARTIAN AREODESY SYSTEM</span>
          </div>

          <h1 className="home-hero-title">
            INTERPLANETARY SURVIVAL GUIDE
            <span className="home-hero-subtitle">MARTIAN MAP & AREOCENTRIC SURFACE SYSTEM</span>
          </h1>

          <p className="home-hero-lead">
            A unified planetary cartography, environmental telemetry, and robotic surface logistics platform engineered
            for human survival and scientific exploration on the surface of Mars. Navigate multi-spectral orbital mosaics,
            access authentic NASA mission data, and plan autonomous rover traverses.
          </p>

          {/* Quick Telemetry Strip */}
          <div className="home-telemetry-banner">
            <div className="telemetry-box">
              <span className="box-label"><Satellite className="w-3.5 h-3.5 text-cyan-400" /> Earth-Mars Distance</span>
              <span className="box-val">248,230,000 km</span>
              <span className="box-sub">Current Orbit Configuration</span>
            </div>
            <div className="telemetry-box">
              <span className="box-label"><Radio className="w-3.5 h-3.5 text-amber-400" /> Deep Space Delay</span>
              <span className="box-val font-mono">14m 18s</span>
              <span className="box-sub">One-Way Light Time (DSN)</span>
            </div>
            <div className="telemetry-box">
              <span className="box-label"><Clock className="w-3.5 h-3.5 text-purple-400" /> Martian Epoch</span>
              <span className="box-val">MY 37 • L_s 145.8°</span>
              <span className="box-sub">Northern Late Summer</span>
            </div>
            <div className="telemetry-box">
              <span className="box-label"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Active Fleets</span>
              <span className="box-val">6 Spacecraft</span>
              <span className="box-sub">3 Surface Rovers • 3 Orbiters</span>
            </div>
          </div>

          {/* Core Call to Action Buttons */}
          <div className="home-hero-actions">
            <button
              type="button"
              className="home-cta-btn cta-primary"
              onClick={() => navigateToModule('member1-map')}
            >
              <Compass className="w-5 h-5 mr-2 text-cyan-400" />
              <span>Launch Interactive Map</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <button
              type="button"
              className="home-cta-btn cta-secondary"
              onClick={() => navigateToModule('member2-nasa')}
            >
              <Radio className="w-5 h-5 mr-2 text-amber-400" />
              <span>Science & Telemetry</span>
            </button>

            <button
              type="button"
              className="home-cta-btn cta-secondary"
              onClick={() => navigateToModule('member3-planning')}
            >
              <Route className="w-5 h-5 mr-2 text-emerald-400" />
              <span>Terrain & Route Planner</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Planetary Exploration Capabilities */}
      <section className="home-modules-showcase">
        <div className="section-header">
          <div className="section-badge">CORE CAPABILITIES</div>
          <h2>Integrated Planetary Systems</h2>
          <p>High-precision cartography, scientific sensor telemetry, and surface traverse planning unified under one mission architecture.</p>
        </div>

        <div className="modules-grid-three">
          {/* Surface Cartography Card */}
          <div className="module-feature-card card-cartography">
            <div className="card-top-bar">
              <span className="feature-category-badge badge-cartography">ORBITAL CARTOGRAPHY</span>
              <span className="module-status-active">Operational</span>
            </div>
            <div className="card-icon-wrap">
              <Compass className="w-8 h-8 text-cyan-400" />
            </div>
            <h3>Interactive Mars Map & 3D Orbital Globe</h3>
            <p className="card-desc">
              High-precision planetary cartography featuring dual-engine 2D Canvas & 3D Three.js WebGL globe, real-time areocentric geodesy, and survival beacons.
            </p>
            <ul className="card-feature-list">
              <li>✓ <strong>Dual-Engine Projection</strong>: Equirectangular 2D map & photorealistic 3D Three.js globe</li>
              <li>✓ <strong>Multi-Spectral Optical Layers</strong>: Viking Mosaic, MOLA Topography, THEMIS IR, Ice Overlays</li>
              <li>✓ <strong>Geodesy HUD</strong>: Live cursor latitude, longitude, and MOLA datum elevation</li>
              <li>✓ <strong>Landmark Dossier</strong>: 25+ verified sites with survival viability scores (1-100)</li>
              <li>✓ <strong>Custom Beacon Deployment</strong>: Drop GPS survival supply markers across the surface</li>
            </ul>
            <div className="card-action-footer">
              <button
                type="button"
                className="module-launch-btn btn-m1"
                onClick={() => navigateToModule('member1-map')}
              >
                <span>Open Surface Map</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
              <button
                type="button"
                className="sub-launch-btn"
                onClick={() => {
                  setViewMode('3D');
                  navigateToModule('member1-map');
                }}
              >
                3D Globe Mode
              </button>
            </div>
          </div>

          {/* NASA Scientific Data Card */}
          <div className="module-feature-card card-telemetry">
            <div className="card-top-bar">
              <span className="feature-category-badge badge-telemetry">PDS SCIENCE ARCHIVE</span>
              <span className="module-status-active">Verified Telemetry</span>
            </div>
            <div className="card-icon-wrap">
              <Radio className="w-8 h-8 text-amber-400" />
            </div>
            <h3>Planetary Science & Environmental Telemetry</h3>
            <p className="card-desc">
              Authentic NASA mission feeds, rover atmospheric weather logs (MEDA), thermal regimes, regolith mineralogy, and live Mars Rover API photo galleries.
            </p>
            <ul className="card-feature-list">
              <li>✓ <strong>MEDA Weather Station</strong>: Calibrated 7-Sol diurnal pressure, temperature, and dust opacity</li>
              <li>✓ <strong>THEMIS Thermal Regimes</strong>: Global thermal inertia and diurnal surface vs subsurface damping</li>
              <li>✓ <strong>Mineralogical Assays</strong>: Regolith oxide abundance (SiO2, FeO, MgO) & toxic perchlorate alerts</li>
              <li>✓ <strong>Topography Benchmarks</strong>: Valles Marineris 250 km cross-section & MOLA 0m triple point datum</li>
              <li>✓ <strong>Rover Imagery Engine</strong>: Live NASA Open API query engine + curated JPL photo archives</li>
            </ul>
            <div className="card-action-footer">
              <button
                type="button"
                className="module-launch-btn btn-m2"
                onClick={() => navigateToModule('member2-nasa')}
              >
                <span>Explore NASA Data</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
              <button
                type="button"
                className="sub-launch-btn"
                onClick={() => navigateToModule('member2-nasa')}
              >
                Atmosphere & Weather
              </button>
            </div>
          </div>

          {/* Terrain & Route Planner Card */}
          <div className="module-feature-card card-logistics">
            <div className="card-top-bar">
              <span className="feature-category-badge badge-logistics">SURFACE LOGISTICS</span>
              <span className="module-status-active">Ready for Planning</span>
            </div>
            <div className="card-icon-wrap">
              <Route className="w-8 h-8 text-emerald-400" />
            </div>
            <h3>Terrain Analysis & Autonomous Route Planning</h3>
            <p className="card-desc">
              Robotic traverse logistics, real-time slope hazard identification, scientific points of interest, automated route planner, and executive mission dashboard.
            </p>
            <ul className="card-feature-list">
              <li>✓ <strong>Terrain Analysis Tool</strong>: Slope gauges, elevation cross-profiles, and surface roughness</li>
              <li>✓ <strong>Hazard Identification</strong>: Real-time warnings for dune slippage, boulder fields, and steep scarps</li>
              <li>✓ <strong>Scientific POIs</strong>: Authentic geological targets with custom scientific sampling criteria</li>
              <li>✓ <strong>Automated Route Planner</strong>: Waypoint logistics, distance calculations, and traverse profiles</li>
              <li>✓ <strong>Mission Dashboard</strong>: Executive briefing modal, operational status, and objective tracking</li>
            </ul>
            <div className="card-action-footer">
              <button
                type="button"
                className="module-launch-btn btn-m3"
                onClick={() => navigateToModule('member3-planning')}
              >
                <span>Launch Route Planner</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
              <button
                type="button"
                className="sub-launch-btn"
                onClick={() => navigateToModule('member3-planning')}
              >
                Hazard Identification
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Martian Landmarks Section */}
      <section className="home-landmarks-section">
        <div className="section-header">
          <div className="section-badge">PLANETARY TARGET SELECTION</div>
          <h2>Featured Martian Exploration Sites</h2>
          <p>Select any landmark to instantly lock target telemetry and view high-resolution cartography.</p>
        </div>

        <div className="landmarks-grid">
          {FEATURED_LANDMARKS.map((item) => (
            <div key={item.id} className="landmark-card">
              <div className="landmark-card-header">
                <span className="landmark-category" style={{ borderColor: item.accent, color: item.accent }}>
                  {item.category}
                </span>
                <span className="viability-badge" style={{ color: item.accent }}>
                  Viability: {item.viability}/100
                </span>
              </div>
              <h4>{item.name}</h4>
              <div className="landmark-sub">{item.subtitle}</div>
              <p className="landmark-desc">{item.desc}</p>
              <div className="landmark-meta">
                <span className="meta-coords font-mono">{item.coords}</span>
                <span className="meta-elev font-mono">
                  {item.elevation >= 0 ? `+${item.elevation}` : item.elevation}m MOLA
                </span>
              </div>
              <button
                type="button"
                className="landmark-jump-btn"
                onClick={() => handleQuickJump(item.id)}
              >
                <Target className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span>Fly to Location on Map</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interplanetary Survival Guide Directives */}
      <section className="home-survival-pillars">
        <div className="section-header">
          <div className="section-badge">INTERPLANETARY SURVIVAL PROTOCOLS</div>
          <h2>Core Environmental Constraints & Directives</h2>
          <p>Essential physiological and engineering directives required for sustained human life support on Mars.</p>
        </div>

        <div className="survival-pillars-grid">
          {SURVIVAL_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="pillar-card">
                <div className="pillar-icon-box">
                  <Icon className="w-6 h-6 text-orange-400" />
                </div>
                <div className="pillar-content">
                  <div className="pillar-header-row">
                    <h4>{pillar.title}</h4>
                    <span className="pillar-badge font-mono">{pillar.badge}</span>
                  </div>
                  <div className="pillar-value font-mono">{pillar.value}</div>
                  <p>{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission Science Provenance & Archives Section */}
      <section className="home-provenance-section">
        <div className="provenance-card">
          <div className="provenance-header">
            <Database className="w-6 h-6 text-cyan-400 mr-2" />
            <div>
              <h3>NASA Planetary Data System & Mission Archives</h3>
              <p className="text-slate-400 text-sm">Authentic scientific telemetry, optical imagery, laser altimetry, and rover datasets.</p>
            </div>
          </div>
          <div className="provenance-grid">
            <div className="provenance-item">
              <span className="provenance-tag">MOLA & Viking Archives</span>
              <h4>Orbital Altimetry & Optical Mosaics</h4>
              <p>Topography derived from Mars Global Surveyor MOLA laser altimetry (610.5 Pa equipotential datum) and true-color Viking Orbiter mosaics curated by USGS Astrogeology.</p>
            </div>
            <div className="provenance-item">
              <span className="provenance-tag">Mars 2020 & MSL Telemetry</span>
              <h4>In-Situ Atmospheric & Rover Observations</h4>
              <p>Calibrated 7-Sol diurnal meteorology records from the Perseverance MEDA weather station at Jezero Crater, combined with live NASA Mars Rover Photos Open API queries.</p>
            </div>
            <div className="provenance-item">
              <span className="provenance-tag">THEMIS & CRISM Science</span>
              <h4>Thermal Inertia & Mineralogical Assays</h4>
              <p>Diurnal surface and subsurface thermal damping curves from 2001 Mars Odyssey THEMIS, with CRISM hyperspectral mineral maps and regolith perchlorate risk alerts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
