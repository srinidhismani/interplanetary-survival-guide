import React, { useState } from 'react';
import './styles/nasaData.css';
import {
  Globe,
  Radio,
  Flame,
  Layers,
  Mountain,
  Wind,
  Camera,
  LineChart,
  Database,
  ShieldCheck,
  Thermometer,
  Clock,
  Compass
} from 'lucide-react';

import DataOverview from './components/DataOverview.jsx';
import ThermalViewer from './components/ThermalViewer.jsx';
import GeologyMinerals from './components/GeologyMinerals.jsx';
import TopographyElevation from './components/TopographyElevation.jsx';
import AtmosphereObservations from './components/AtmosphereObservations.jsx';
import RoverImagery from './components/RoverImagery.jsx';
import DataVisualizer from './components/DataVisualizer.jsx';
import DatasetSourcesModal from './components/DatasetSourcesModal.jsx';
import { useMarsMission } from '../../../context/MarsMissionContext';

/**
 * Member 2 - NASA Scientific Data Integration Module
 * 
 * Interplanetary Survival Guide: Martian Map
 * 
 * Provides authentic NASA mission datasets, physical parameters, thermal regimes,
 * mineralogical compositions, topographic laser altimetry, atmospheric weather,
 * rover observations, and interactive data visualization.
 */
export default function NasaScientificDataModule({
  initialTab = 'overview',
  defaultUnit = 'C',
  showSharedHeader = true
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [unit, setUnit] = useState(defaultUnit); // 'C', 'K', 'F'
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Cross-module context integration with Member 1 & Member 3
  let missionCtx = null;
  try {
    missionCtx = useMarsMission();
  } catch (err) {
    // Standalone fallback
  }

  const activeLoc = missionCtx?.telemetryTarget || missionCtx?.selectedLocation;
  const navigateToModule = missionCtx?.navigateToModule;

  // Helper temperature converter
  const tempConvert = (celsiusVal) => {
    if (typeof celsiusVal !== 'number') return `${celsiusVal}`;
    if (unit === 'K') {
      return `${(celsiusVal + 273.15).toFixed(1)} K`;
    }
    if (unit === 'F') {
      return `${((celsiusVal * 9) / 5 + 32).toFixed(1)}°F`;
    }
    return `${celsiusVal > 0 ? `+${celsiusVal.toFixed(1)}` : celsiusVal.toFixed(1)}°C`;
  };

  return (
    <div className="nasa-module-root">
      {/* Top Telemetry & Mission Control HUD */}
      {showSharedHeader && (
        <header className="nasa-top-hud">
          <div className="nasa-brand">
            <div className="nasa-logo-badge">
              <Globe size={26} />
            </div>
            <div className="nasa-title-group">
              <h1>
                NASA SCIENTIFIC DATA & TELEMETRY
                <span className="data-provenance-tag verified" style={{ fontSize: '0.65rem' }}>
                  PDS VERIFIED
                </span>
              </h1>
              <div className="sub">
                Interplanetary Survival Guide: Martian Map • JPL & PDS Science Archive
              </div>
            </div>
          </div>

          <div className="nasa-telemetry-strip">
            <div className="telemetry-item">
              <span className="label">Mars Epoch</span>
              <span className="value">MY 37 • L_s 145.8°</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Jezero Sol</span>
              <span className="value">Sol 921 (Active)</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Atm. Pressure</span>
              <span className="value">768.5 Pa</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Dust Opacity</span>
              <span className="value">τ = 0.37</span>
            </div>

            {/* Unit Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                Temp Unit
              </span>
              <div className="unit-toggle-group">
                <button
                  className={`unit-toggle-btn ${unit === 'C' ? 'active' : ''}`}
                  onClick={() => setUnit('C')}
                >
                  °C
                </button>
                <button
                  className={`unit-toggle-btn ${unit === 'K' ? 'active' : ''}`}
                  onClick={() => setUnit('K')}
                >
                  K
                </button>
                <button
                  className={`unit-toggle-btn ${unit === 'F' ? 'active' : ''}`}
                  onClick={() => setUnit('F')}
                >
                  °F
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsSourcesModalOpen(true)}
              className="nasa-btn nasa-btn-outline"
              style={{ fontSize: '0.74rem', padding: '0.45rem 0.85rem' }}
            >
              <Database size={13} color="var(--mars-cyan)" />
              Dataset Provenance
            </button>
          </div>
        </header>
      )}

      {/* Live Cross-Module Signal Link Banner from Member 1 */}
      {activeLoc && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 20, 32, 0.9) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Radio size={16} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'var(--font-hud)', fontWeight: 700, letterSpacing: '0.08em' }}>
                TARGET TELEMETRY LOCK: SURFACE CARTOGRAPHY LINK
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                {activeLoc.name} <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>({activeLoc.lat >= 0 ? `${activeLoc.lat}°N` : `${Math.abs(activeLoc.lat)}°S`}, {activeLoc.lng >= 0 ? `${activeLoc.lng}°E` : `${Math.abs(activeLoc.lng)}°W`}{activeLoc.elevation !== undefined ? ` • Datum: ${activeLoc.elevation}m` : ''})</span>
              </div>
            </div>
          </div>

          {navigateToModule && (
            <button
              type="button"
              onClick={() => navigateToModule('member1-map', activeLoc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-hud)',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              <Compass size={13} />
              View Target on Map
            </button>
          )}
        </div>
      )}

      {/* Module Domain Navigation Tabs */}
      <nav className="nasa-nav-tabs">
        <button
          className={`nasa-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Radio size={15} /> Overview & Telemetry
        </button>
        <button
          className={`nasa-tab-btn ${activeTab === 'atmosphere' ? 'active' : ''}`}
          onClick={() => setActiveTab('atmosphere')}
        >
          <Wind size={15} /> Atmospheric Observations
        </button>
        <button
          className={`nasa-tab-btn ${activeTab === 'thermal' ? 'active' : ''}`}
          onClick={() => setActiveTab('thermal')}
        >
          <Flame size={15} /> Thermal & Surface Energy
        </button>
        <button
          className={`nasa-tab-btn ${activeTab === 'geology' ? 'active' : ''}`}
          onClick={() => setActiveTab('geology')}
        >
          <Layers size={15} /> Geology & Minerals
        </button>
        <button
          className={`nasa-tab-btn ${activeTab === 'topography' ? 'active' : ''}`}
          onClick={() => setActiveTab('topography')}
        >
          <Mountain size={15} /> Topography & Elevation
        </button>
        <button
          className={`nasa-tab-btn ${activeTab === 'rover-imagery' ? 'active' : ''}`}
          onClick={() => setActiveTab('rover-imagery')}
        >
          <Camera size={15} /> Mars Rover Imagery
        </button>
        <button
          className={`nasa-tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <LineChart size={15} /> Charts & Visualization
        </button>
      </nav>

      {/* Active Module View */}
      <main>
        {activeTab === 'overview' && (
          <DataOverview 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onOpenSources={() => setIsSourcesModalOpen(true)}
            unit={unit}
            tempConvert={tempConvert}
          />
        )}

        {activeTab === 'atmosphere' && (
          <AtmosphereObservations 
            onOpenSources={() => setIsSourcesModalOpen(true)}
            unit={unit}
            tempConvert={tempConvert}
          />
        )}

        {activeTab === 'thermal' && (
          <ThermalViewer 
            onOpenSources={() => setIsSourcesModalOpen(true)}
            unit={unit}
            tempConvert={tempConvert}
          />
        )}

        {activeTab === 'geology' && (
          <GeologyMinerals 
            onOpenSources={() => setIsSourcesModalOpen(true)}
          />
        )}

        {activeTab === 'topography' && (
          <TopographyElevation 
            onOpenSources={() => setIsSourcesModalOpen(true)}
          />
        )}

        {activeTab === 'rover-imagery' && (
          <RoverImagery 
            onOpenSources={() => setIsSourcesModalOpen(true)}
          />
        )}

        {activeTab === 'charts' && (
          <DataVisualizer 
            onOpenSources={() => setIsSourcesModalOpen(true)}
            unit={unit}
            tempConvert={tempConvert}
          />
        )}
      </main>

      {/* Sources & Provenance Modal */}
      <DatasetSourcesModal 
        isOpen={isSourcesModalOpen} 
        onClose={() => setIsSourcesModalOpen(false)} 
      />
    </div>
  );
}
