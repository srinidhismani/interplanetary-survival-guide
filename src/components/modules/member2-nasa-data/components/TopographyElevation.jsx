import React, { useState } from 'react';
import {
  Mountain,
  Compass,
  ArrowUpDown,
  Shield,
  Layers,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import {
  MOLA_TOPOGRAPHY_BENCHMARKS,
  VALLES_MARINERIS_TRANSECT
} from '../data/authenticNasaDatasets.js';

export default function TopographyElevation({ onOpenSources }) {
  const [selectedBenchmark, setSelectedBenchmark] = useState(MOLA_TOPOGRAPHY_BENCHMARKS[0]); // Olympus Mons default
  const [activeTransectPoint, setActiveTransectPoint] = useState(VALLES_MARINERIS_TRANSECT[4]); // Coprates deep trough

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h3 className="nasa-card-title">
              <Mountain size={20} color="#c084fc" />
              MGS MOLA Mars Topography & Elevation Altimetry
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Laser altimetry survey by the Mars Orbiter Laser Altimeter (MOLA) on NASA's Mars Global Surveyor.
            </p>
          </div>
          <DataSourceBadge 
            source="NASA MGS MOLA MEGDR Archive" 
            instrument="1064nm Nd:YAG Laser Altimeter" 
            date="Mission Standard Reference"
            onClick={onOpenSources}
          />
        </div>

        {/* Mars Datum Explanation Callout */}
        <div style={{ background: 'rgba(192, 132, 252, 0.08)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Info size={20} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
            <strong style={{ color: '#e9d5ff', display: 'block', marginBottom: '3px' }}>
              The Martian 0-Meter Datum Standard:
            </strong>
            Unlike Earth, Mars has no ocean surface to define sea level. NASA's MOLA science team defined the <strong>0-meter Mars datum</strong> as the gravitational equipotential surface (areoid) where the average atmospheric pressure is <strong>610.5 Pascals (6.105 mbar)</strong>—precisely matching the thermodynamic triple point of pure liquid water. Elevations above this datum experience lower pressures; depressions below this datum experience thicker atmosphere.
          </div>
        </div>
      </div>

      {/* Topographic Benchmarks Grid */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <h4 className="nasa-card-title">
            <ArrowUpDown size={18} color="var(--mars-cyan)" />
            Topographic Extremes: Olympus Mons to Hellas Basin
          </h4>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Total Relief: 28,381 METERS (28.4 KM)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {MOLA_TOPOGRAPHY_BENCHMARKS.map((item, idx) => {
            const isSelected = selectedBenchmark.name === item.name;
            const isPositive = item.elevationMeters >= 0;
            return (
              <div
                key={idx}
                onClick={() => setSelectedBenchmark(item)}
                style={{
                  background: isSelected ? 'rgba(192, 132, 252, 0.18)' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${isSelected ? '#c084fc' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.85rem', color: isSelected ? '#fff' : '#cbd5e1' }}>
                    {item.name}
                  </span>
                  <span 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      color: isPositive ? '#fb923c' : '#38bdf8'
                    }}
                  >
                    {isPositive ? `+${item.elevationKm} km` : `${item.elevationKm} km`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>{item.type.split('(')[0]}</span>
                  <span>{item.surfacePressurePa} Pa</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Benchmark Detail */}
        {selectedBenchmark && (
          <div style={{ background: 'rgba(14, 20, 32, 0.95)', border: '1px solid #c084fc', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-hud)', color: '#fff', fontSize: '1.1rem' }}>
                  {selectedBenchmark.name}
                </h4>
                <div style={{ fontSize: '0.75rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                  Coordinates: {selectedBenchmark.coordinates} • MOLA Precision: ±1 m vertical
                </div>
              </div>
              <span className="data-provenance-tag verified">
                MGS MOLA Standard Datum
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>MOLA Elevation</span>
                <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-hud)', color: selectedBenchmark.elevationMeters >= 0 ? '#fb923c' : '#38bdf8' }}>
                  {selectedBenchmark.elevationMeters.toLocaleString()} m
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Relative to 610.5 Pa Aeroid
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Atmospheric Pressure</span>
                <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-cyan)' }}>
                  {selectedBenchmark.surfacePressurePa} Pa
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {(selectedBenchmark.surfacePressurePa / 100).toFixed(2)} mbar
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Galactic Cosmic Ray Multiplier</span>
                <div style={{ fontSize: '1.3rem', fontFamily: 'var(--font-hud)', color: selectedBenchmark.radiationExposureMultiplier > 1.5 ? 'var(--mars-rose)' : 'var(--mars-green)' }}>
                  {selectedBenchmark.radiationExposureMultiplier}x
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  vs Mars 0m datum exposure
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '6px', lineHeight: '1.45' }}>
              <strong>Scientific & Survival Context:</strong> {selectedBenchmark.notes}
            </p>
          </div>
        )}
      </div>

      {/* Topographical Cross-Section Transect (Valles Marineris) */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h4 className="nasa-card-title">
              <Compass size={18} color="var(--mars-red-primary)" />
              Topographic Transect Profile: Valles Marineris Canyon System
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              North-to-South cross-section scarp from Ophir Planum to Coprates Floor (-7,000 m deep)
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--mars-cyan)' }}>
            250 KM TRANSECT
          </span>
        </div>

        {/* Transect interactive visual */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px', gap: '6px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {VALLES_MARINERIS_TRANSECT.map((pt, idx) => {
              // Elevation ranges from -7000 to +4000 (total span 11000m)
              const heightPercent = Math.max(12, Math.round(((pt.elevationM + 7000) / 11000) * 100));
              const isSelected = activeTransectPoint.distanceKm === pt.distanceKm;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveTransectPoint(pt)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer'
                  }}
                  title={`${pt.feature}: ${pt.elevationM} m (${pt.distanceKm} km)`}
                >
                  <div 
                    style={{
                      width: '100%',
                      height: `${heightPercent}%`,
                      background: isSelected ? 'var(--mars-red-primary)' : 'rgba(224, 90, 43, 0.4)',
                      borderTop: `2px solid ${isSelected ? '#fff' : 'var(--mars-cyan)'}`,
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {pt.distanceKm}k
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            <span>North Rim (0 km)</span>
            <span>Coprates Canyon Abyss (120 km)</span>
            <span>South Rim (250 km)</span>
          </div>
        </div>

        {/* Active Transect Waypoint Info */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.85rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Transect Distance: {activeTransectPoint.distanceKm} km from North Datum Line
            </div>
            <div style={{ fontSize: '1rem', fontFamily: 'var(--font-hud)', color: '#fff' }}>
              {activeTransectPoint.feature}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: activeTransectPoint.elevationM >= 0 ? '#fb923c' : '#38bdf8' }}>
              {activeTransectPoint.elevationM >= 0 ? `+${activeTransectPoint.elevationM}` : activeTransectPoint.elevationM} m
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              MOLA Laser Spot Elevation
            </div>
          </div>
        </div>

        <div className="source-footer-bar">
          <span>Source: NASA Goddard Space Flight Center MOLA Science Team (PDS Geosciences Node)</span>
          <a href="https://pds-geosciences.wustl.edu/" target="_blank" rel="noreferrer" className="source-link">
            PDS Geosciences Repository <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
