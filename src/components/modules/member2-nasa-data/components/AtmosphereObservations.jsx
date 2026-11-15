import React, { useState } from 'react';
import {
  Wind,
  CloudSun,
  Gauge,
  Compass,
  AlertTriangle,
  Sun,
  Droplet,
  Shield,
  Layers,
  Calendar,
  ExternalLink
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import {
  ATMOSPHERIC_COMPOSITION,
  MEDA_7SOL_WEATHER_RECORDS,
  ANNUAL_ATMOSPHERIC_PRESSURE_CYCLE
} from '../data/authenticNasaDatasets.js';

export default function AtmosphereObservations({ onOpenSources, unit = 'C', tempConvert }) {
  const [selectedSol, setSelectedSol] = useState(MEDA_7SOL_WEATHER_RECORDS[6]); // Sol 921 default
  const [pressureUnit, setPressureUnit] = useState('Pa'); // 'Pa' or 'mbar'

  const formatPressure = (pa) => {
    if (pressureUnit === 'mbar') {
      return `${(pa / 100).toFixed(2)} mbar`;
    }
    return `${pa.toFixed(1)} Pa`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h3 className="nasa-card-title">
              <Wind size={20} color="var(--mars-cyan)" />
              Martian Atmospheric Observations & Meteorology
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              In-situ weather measurements by Mars 2020 Perseverance MEDA at Jezero Crater (18.38° N, 77.58° E).
            </p>
          </div>
          <DataSourceBadge 
            source="NASA / CAB (INTA-CSIC) MEDA" 
            instrument="Mars Environmental Dynamics Analyzer" 
            date="Sol 915 - 921 (MY37)"
            onClick={onOpenSources}
          />
        </div>

        {/* Selected Sol Telemetry Dashboard Banner */}
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--mars-border)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(224, 90, 43, 0.2)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--mars-red-primary)', fontFamily: 'var(--font-hud)', fontSize: '1.1rem', color: '#fff' }}>
                SOL {selectedSol.sol}
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Earth Date: {selectedSol.earthDate} • Mars Year: {selectedSol.marsYear} • L_s: {selectedSol.solarLongitudeLs}°
                </div>
                <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                  Jezero Crater Basin Telemetry Stream
                </div>
              </div>
            </div>

            {/* Sol Picker Buttons */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
              {MEDA_7SOL_WEATHER_RECORDS.map((rec) => (
                <button
                  key={rec.sol}
                  onClick={() => setSelectedSol(rec)}
                  className="unit-toggle-btn"
                  style={{
                    background: selectedSol.sol === rec.sol ? 'var(--mars-red-primary)' : 'rgba(255,255,255,0.06)',
                    color: selectedSol.sol === rec.sol ? '#fff' : 'var(--text-secondary)',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {rec.sol}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metric Tiles for Selected Sol */}
          <div className="nasa-grid-4" style={{ marginBottom: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block' }}>
                Air Temp (Min / Max)
              </span>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: '#38bdf8', margin: '0.2rem 0' }}>
                {tempConvert(selectedSol.tempAirMinC)} / {tempConvert(selectedSol.tempAirMaxC)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                MEDA ATS sensor array (1.5m)
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block' }}>
                Ground Skin Temp
              </span>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-red-primary)', margin: '0.2rem 0' }}>
                {tempConvert(selectedSol.tempGroundMinC)} / {tempConvert(selectedSol.tempGroundMaxC)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Peak midday surface warmth
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block' }}>
                Surface Pressure
              </span>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: 'var(--mars-green)', margin: '0.2rem 0' }}>
                {formatPressure(selectedSol.pressurePa)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                MEDA Pressure Sensor (PS)
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block' }}>
                Dust Opacity (Tau τ)
              </span>
              <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-hud)', color: selectedSol.dustOpticalDepthTau > 0.4 ? 'var(--mars-amber)' : 'var(--mars-cyan)', margin: '0.2rem 0' }}>
                τ = {selectedSol.dustOpticalDepthTau}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Wind Gusts: {selectedSol.maxWindGustMs} m/s ({selectedSol.windDirectionDeg}°)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Composition & In-Situ MOXIE Resource Potential */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <h4 className="nasa-card-title">
            <Gauge size={18} color="var(--mars-cyan)" />
            Atmospheric Gas Composition (NASA Viking & MSL SAM Baseline)
          </h4>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Total Global Average Pressure: 610 Pa (0.6 kPa)
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Mars' atmosphere is 95.3% CO2. NASA's <strong>MOXIE (Mars Oxygen ISRU Experiment)</strong> on Perseverance successfully proved extraction of breathable O2 by solid oxide electrolysis of atmospheric CO2 (producing 122 grams of O2 during its test operations).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {ATMOSPHERIC_COMPOSITION.map((gas, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-hud)', color: '#fff', fontSize: '0.85rem' }}>
                  {gas.gas}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold', color: gas.percent > 10 ? 'var(--mars-red-primary)' : 'var(--mars-cyan)' }}>
                  {gas.percent}%
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
                Concentration: {gas.ppm.toLocaleString()} ppm
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                {gas.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Global Annual Pressure Fluctuation (L_s 0°-360°) */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h4 className="nasa-card-title">
              <Sun size={18} color="var(--mars-amber)" />
              Annual CO₂ Condensation & Global Pressure Cycle
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Massive 25% atmospheric surge driven by polar dry-ice sublimation
            </span>
          </div>
          <div className="unit-toggle-group">
            <button 
              className={`unit-toggle-btn ${pressureUnit === 'Pa' ? 'active' : ''}`}
              onClick={() => setPressureUnit('Pa')}
            >
              Pa
            </button>
            <button 
              className={`unit-toggle-btn ${pressureUnit === 'mbar' ? 'active' : ''}`}
              onClick={() => setPressureUnit('mbar')}
            >
              mbar
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Because Mars has an elliptical orbit (eccentricity 0.093), southern winter occurs near aphelion (farthest from Sun), freezing an immense sheet of atmospheric CO2 onto the South Pole. At perihelion (L_s ~270°), the cap sublimates back into gas, driving global pressure from 685 Pa up to 915 Pa!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
          {ANNUAL_ATMOSPHERIC_PRESSURE_CYCLE.map((season, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>
                  {season.season}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--mars-cyan)', fontWeight: 'bold' }}>
                  {formatPressure(season.globalPressurePa)}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {season.description}
              </p>
            </div>
          ))}
        </div>

        <div className="source-footer-bar">
          <span>Source: NASA Planetary Data System Atmospheres Node & Mars 2020 MEDA Science Investigation</span>
          <a href="https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/mars_2020.html" target="_blank" rel="noreferrer" className="source-link">
            NASA PDS Atmospheres Portal <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
