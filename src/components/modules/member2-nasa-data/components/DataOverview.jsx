import React from 'react';
import {
  Globe,
  Radio,
  Compass,
  Activity,
  Flame,
  Layers,
  Mountain,
  Wind,
  Camera,
  LineChart,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import { MARS_PLANETARY_CONSTANTS } from '../data/authenticNasaDatasets.js';

export default function DataOverview({ onNavigateTab, onOpenSources, unit, tempConvert }) {
  const FLEET = [
    {
      name: "Perseverance Rover (Mars 2020)",
      type: "Surface Rover",
      site: "Jezero Crater (18.38° N, 77.58° E)",
      status: "Active Science Traverse",
      statusColor: "#10b981",
      primePayload: "MEDA Weather, Mastcam-Z, MOXIE O2, SuperCam, PIXL, SHERLOC",
      lastSol: "Sol 921+ (Current Operational Phase)",
      highlight: "Exploring ancient river delta deposits; confirmed hydrous clay minerals."
    },
    {
      name: "Curiosity Rover (MSL)",
      type: "Surface Rover",
      site: "Gale Crater - Mount Sharp (4.59° S, 137.44° E)",
      status: "Active Science Traverse",
      statusColor: "#10b981",
      primePayload: "REMS Weather, CheMin XRD, SAM Mass Spec, Mastcam, ChemCam",
      lastSol: "Sol 3820+ (Ascending Mount Sharp)",
      highlight: "Discovered ancient freshwater lake environment and organic carbon molecules."
    },
    {
      name: "Mars Reconnaissance Orbiter (MRO)",
      type: "High-Altitude Science Orbiter",
      site: "Sun-Synchronous Polar Orbit (~300 km)",
      status: "Active Global Mapping & Relay",
      statusColor: "#10b981",
      primePayload: "CRISM (Mineral Spectrometer), HiRISE (0.25m camera), SHARAD Radar",
      lastSol: "Operational since 2006",
      highlight: "Mapped global hydrated mineral deposits, valley networks, and subsurface ice."
    },
    {
      name: "2001 Mars Odyssey",
      type: "Orbital Mapper",
      site: "Circular Polar Orbit (~400 km)",
      status: "Longest Continual Mars Mission",
      statusColor: "#10b981",
      primePayload: "THEMIS (Thermal Emission Imaging System), GRS (Gamma Ray)",
      lastSol: "Operational since 2001",
      highlight: "Global thermal inertia mapping; discovered shallow subsurface water ice globally."
    },
    {
      name: "InSight Lander",
      type: "Stationary Geophysical Station",
      site: "Elysium Planitia (4.50° N, 135.62° E)",
      status: "Archived Ground Truth Baseline",
      statusColor: "#00f0ff",
      primePayload: "SEIS (Ultra-sensitive Seismometer), TWINS Weather, HP3 Heat Probe",
      lastSol: "Mission Concluded (Sol 1440 archive)",
      highlight: "Mapped Mars core-mantle boundary (core radius 1830 km) and 1300+ marsquakes."
    },
    {
      name: "MAVEN Orbiter",
      type: "Atmospheric & Ionospheric Scout",
      site: "Elliptical Orbit (150 - 6200 km)",
      status: "Active Upper Atmosphere Study",
      statusColor: "#10b981",
      primePayload: "IUVS Ultraviolet, NGIMS Gas & Ion Spec, SWEA Solar Wind",
      lastSol: "Operational since 2014",
      highlight: "Quantified solar wind stripping rates of Mars atmosphere over 4 billion years."
    }
  ];

  const QUICK_STATS = [
    { label: "Surface Gravity", value: "3.721 m/s²", sub: "38% of Earth gravity (0.38g)", icon: Activity, color: "var(--mars-cyan)" },
    { label: "Mean Solar Day (Sol)", value: "24h 39m 35s", sub: "1.027 Earth days", icon: Compass, color: "var(--mars-amber)" },
    { label: "Mean Radius", value: "3,389.5 km", sub: "53% of Earth radius", icon: Globe, color: "var(--mars-red-primary)" },
    { label: "Atmosphere Pressure", value: "610 - 1,155 Pa", sub: "Avg 0.6% Earth pressure (95.3% CO2)", icon: Wind, color: "var(--mars-green)" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner / Purpose */}
      <div className="nasa-card" style={{ background: 'linear-gradient(135deg, rgba(224, 90, 43, 0.12) 0%, rgba(14, 20, 32, 0.95) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="data-provenance-tag verified">
                Official NASA Scientific Integration
              </span>
              <span className="data-provenance-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                Module 2 of Interplanetary Survival Guide
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
              Mars Planetary Science & Environmental Baseline
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.35rem 0 0 0', maxWidth: '850px' }}>
              Ingesting verified observation archives and live API telemetries from NASA JPL, Goddard Space Flight Center, MRO CRISM, MGS MOLA, and the Mars 2020 Perseverance science team to empower interplanetary map navigation and survival logistics.
            </p>
          </div>
          <button onClick={onOpenSources} className="nasa-btn nasa-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={14} color="var(--mars-cyan)" />
            View Data Sources & Provenance
          </button>
        </div>

        {/* Quick Stat Tiles */}
        <div className="nasa-grid-4">
          {QUICK_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  <Icon size={14} color={stat.color} /> {stat.label}
                </div>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-hud)', color: '#fff', margin: '0.25rem 0' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Quick Nav Shortcuts */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <h3 className="nasa-card-title">
            <Layers size={18} color="var(--mars-red-primary)" />
            NASA Scientific Integration Domain Modules
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            CORE PLANETARY RESEARCH SECTORS
          </span>
        </div>

        <div className="nasa-grid-3">
          <div 
            onClick={() => onNavigateTab('atmosphere')}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover:border-orange-500"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Wind size={20} color="var(--mars-cyan)" />
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.95rem', margin: '0 0 0.35rem 0', color: '#fff' }}>
              Atmospheric Observations
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Perseverance MEDA 7-Sol observations, dust optical depth (Tau), pressure cycles & gas composition.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('thermal')}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover:border-orange-500"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Flame size={20} color="var(--mars-red-primary)" />
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.95rem', margin: '0 0 0.35rem 0', color: '#fff' }}>
              Thermal & Surface Energy
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Odyssey THEMIS thermal inertia, diurnal depth temp gradients, and night frost danger zones.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('geology')}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover:border-orange-500"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Layers size={20} color="var(--mars-amber)" />
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.95rem', margin: '0 0 0.35rem 0', color: '#fff' }}>
              Geological & Minerals
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              CRISM mineral spectral identification, hydrous smectite clays, regolith oxides, and toxic perchlorates.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('topography')}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover:border-orange-500"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Mountain size={20} color="#a855f7" />
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.95rem', margin: '0 0 0.35rem 0', color: '#fff' }}>
              Topography & Elevation
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              MOLA 0m datum reference, Olympus Mons (+21.2 km) to Hellas (-7.1 km), and canyon cross-sections.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('rover-imagery')}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover:border-orange-500"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Camera size={20} color="var(--mars-green)" />
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.95rem', margin: '0 0 0.35rem 0', color: '#fff' }}>
              Mars Rover Imagery
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Live NASA Rover API queries, Mastcam-Z stereo imagery, camera instrument filters & PDS archive IDs.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('charts')}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
            className="hover:border-orange-500"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <LineChart size={20} color="var(--mars-cyan)" />
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h4 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.95rem', margin: '0 0 0.35rem 0', color: '#fff' }}>
              Analytical Visualizations
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Interactive charts: Diurnal thermal swings, annual CO2 pressure cycle, and regolith mineral abundance.
            </p>
          </div>
        </div>
      </div>

      {/* Active NASA Fleet Telemetry Status Cards */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <h3 className="nasa-card-title">
            <Radio size={18} color="var(--mars-cyan)" />
            NASA Active & Landmark Mars Fleet Science Payloads
          </h3>
          <DataSourceBadge 
            source="NASA JPL Fleet Directory" 
            instrument="Integrated Ground Truth Telemetry" 
            date="Mission Epoch 2024"
            onClick={onOpenSources}
          />
        </div>

        <div className="nasa-grid-2">
          {FLEET.map((craft, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <h4 style={{ fontFamily: 'var(--font-hud)', color: '#fff', fontSize: '0.95rem', margin: 0 }}>
                  {craft.name}
                </h4>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: craft.statusColor, background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: craft.statusColor }}></span>
                  {craft.status}
                </span>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Location/Orbit:</strong> {craft.site}
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--mars-cyan)' }}>Payload:</strong> {craft.primePayload}
              </div>

              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                {craft.highlight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
