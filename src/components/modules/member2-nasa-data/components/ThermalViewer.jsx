import React, { useState } from 'react';
import {
  Flame,
  Thermometer,
  ShieldAlert,
  Snowflake,
  Sun,
  Layers,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import {
  MARS_THERMAL_INERTIA_REGIONS,
  HOURLY_DIURNAL_THERMAL_CYCLE
} from '../data/authenticNasaDatasets.js';

export default function ThermalViewer({ onOpenSources, unit = 'C', tempConvert }) {
  const [selectedRegion, setSelectedRegion] = useState(MARS_THERMAL_INERTIA_REGIONS[1]); // Jezero Crater default
  const [selectedHour, setSelectedHour] = useState(HOURLY_DIURNAL_THERMAL_CYCLE[6]); // 12:00 default

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Module Header Card */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h3 className="nasa-card-title">
              <Flame size={20} color="var(--mars-red-primary)" />
              Mars Thermal Inertia & Diurnal Energy Regimes
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Thermal emission measurements from NASA 2001 Mars Odyssey THEMIS and in-situ ground sensors.
            </p>
          </div>
          <DataSourceBadge 
            source="NASA Mars Odyssey THEMIS & InSight TWINS" 
            instrument="Infrared Radiometers & Thermal Sensors" 
            date="PDS Archive Cumulative"
            onClick={onOpenSources}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Global Planetary Extremes
            </div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: '#fff', margin: '0.2rem 0' }}>
              {tempConvert(-128)} to {tempConvert(20)}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              From winter polar CO2 ice caps (-128°C) to equatorial noon summer soil (+20°C).
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Average Global Surface Temp
            </div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-cyan)', margin: '0.2rem 0' }}>
              {tempConvert(-63)}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Calculated mean across all Martian latitudes (NASA Planetary Fact Sheet).
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Nocturnal Thermal Cooling Rate
            </div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-amber)', margin: '0.2rem 0' }}>
              ~15°C to 20°C / hr
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Rapid radiative loss into vacuum-thin CO2 atmosphere after sunset.
            </div>
          </div>
        </div>
      </div>

      {/* THEMIS Regional Thermal Inertia Explorer */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <h4 className="nasa-card-title">
            <Compass size={18} color="var(--mars-cyan)" />
            NASA THEMIS Global Thermal Inertia Benchmarks
          </h4>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            TIU UNIT: J m⁻² K⁻¹ s⁻¹/²
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          <strong>Thermal Inertia (I):</strong> Measures the subsurface resistance to temperature swings. High values indicate solid bedrock and cemented conglomerates that retain daytime heat; low values indicate loose, insulating aeolian dust prone to deep nocturnal freeze.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {MARS_THERMAL_INERTIA_REGIONS.map((region, idx) => {
            const isSelected = selectedRegion.region === region.region;
            return (
              <div 
                key={idx}
                onClick={() => setSelectedRegion(region)}
                style={{
                  background: isSelected ? 'rgba(224, 90, 43, 0.2)' : 'rgba(0,0,0,0.35)',
                  border: `1px solid ${isSelected ? 'var(--mars-red-primary)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-hud)', color: isSelected ? '#fff' : 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {region.region}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: isSelected ? 'var(--mars-cyan)' : 'var(--text-muted)' }}>
                    {region.thermalInertiaTiu} tiu
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {region.coordinates}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Region Detailed Analysis */}
        {selectedRegion && (
          <div style={{ background: 'rgba(14, 20, 32, 0.9)', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--mars-cyan)" />
                <h4 style={{ margin: 0, fontFamily: 'var(--font-hud)', color: '#fff', fontSize: '1rem' }}>
                  {selectedRegion.region} Geological Thermal Profile
                </h4>
              </div>
              <span className="data-provenance-tag verified">
                MGS TES & Odyssey THEMIS Calibrated
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Substrate Regolith Type:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>{selectedRegion.soilType}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Thermal Inertia Value:</span>
                <span style={{ color: 'var(--mars-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{selectedRegion.thermalInertiaTiu} J m⁻² K⁻¹ s⁻¹/²</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Diurnal Temperature Delta (ΔT):</span>
                <span style={{ color: 'var(--mars-amber)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>~{selectedRegion.diurnalRangeDeltaC}°C swing</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Snowflake size={16} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#38bdf8' }}>Frost & Condensation Risk:</strong> {selectedRegion.frostRisk}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <ShieldAlert size={16} color="var(--mars-red-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: 'var(--mars-red-primary)' }}>Colonist Habitat Survival Impact:</strong> {selectedRegion.survivalImpact}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hourly Diurnal Temperature & Subsurface Damping Profile */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h4 className="nasa-card-title">
              <Thermometer size={18} color="var(--mars-green)" />
              Diurnal Temperature Gradient & Subsurface Thermal Damping
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Perseverance MEDA Sol 920 in-situ ground sensors vs 10 cm subsurface model
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--mars-cyan)' }}>
            Selected LTST: {selectedHour.ltst}
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Compare the extreme swings between atmospheric air, open ground regolith, and the stabilized subsurface layer at 10 cm depth. Notice how subsurface burial eliminates ~65% of the thermal shock!
        </p>

        {/* Hour buttons */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '0.4rem', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
          {HOURLY_DIURNAL_THERMAL_CYCLE.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedHour(step)}
              className="unit-toggle-btn"
              style={{
                background: selectedHour.ltst === step.ltst ? 'var(--mars-red-primary)' : 'rgba(255,255,255,0.06)',
                color: selectedHour.ltst === step.ltst ? '#fff' : 'var(--text-secondary)',
                borderRadius: '4px',
                padding: '0.4rem 0.6rem',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {step.ltst}
            </button>
          ))}
        </div>

        {/* Display at chosen hour */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ borderLeft: '3px solid #38bdf8', paddingLeft: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Atmospheric Air Temp (1.5m height)
            </span>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-hud)', color: '#fff', margin: '0.2rem 0' }}>
              {tempConvert(selectedHour.airTempC)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Recorded by MEDA ATS boom sensors
            </div>
          </div>

          <div style={{ borderLeft: '3px solid var(--mars-red-primary)', paddingLeft: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Ground Skin Temp (0 cm surface)
            </span>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-red-primary)', margin: '0.2rem 0' }}>
              {tempConvert(selectedHour.groundTempC)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Measured by MEDA Thermal Infrared Sensor (TIRS)
            </div>
          </div>

          <div style={{ borderLeft: '3px solid var(--mars-green)', paddingLeft: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Subsurface Temp (-10 cm depth)
            </span>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-green)', margin: '0.2rem 0' }}>
              {tempConvert(selectedHour.subsurface10cmC)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Damped thermal profile; optimal for habitat trenches
            </div>
          </div>
        </div>

        <div className="source-footer-bar">
          <span>Derived from NASA PDS Mars 2020 MEDA calibrated science records (Sol 915-921)</span>
          <a href="https://pds-atmospheres.nmsu.edu/" target="_blank" rel="noreferrer" className="source-link">
            PDS Atmospheres Node Directory
          </a>
        </div>
      </div>
    </div>
  );
}
