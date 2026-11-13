// Member 2 Module Integration Stub
// "NASA Data & Telemetry Module" (Assigned to Member 2)
// Designed for seamless integration with Member 1's Interactive Mars Map

import React from 'react';
import { useMarsMission } from '../../../context/MarsMissionContext';
import { Radio, CloudRain, Sun, Activity, Database, ExternalLink } from 'lucide-react';
import './NasaDataModule.css';

export default function NasaDataModule() {
  const { telemetryTarget, selectedLocation } = useMarsMission();
  const activeLoc = telemetryTarget || selectedLocation;

  return (
    <section className="member-module-placeholder" aria-label="NASA Data Module">
      <div className="placeholder-banner">
        <div className="flex items-center space-x-2">
          <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="badge-member">MEMBER 2 MODULE REPOSITORY</span>
        </div>
        <h2>NASA Telemetry & Environmental Data Module</h2>
        <p>
          This module is developed by <strong>Member 2</strong> of the Martian Map team. It integrates live or cached
          NASA InSight atmospheric weather telemetry, Curiosity/Perseverance rover photos, and planetary environment sensors.
        </p>

        {/* Live Cross-Module Signal Indicator from Member 1 */}
        {activeLoc && (
          <div className="integration-received-box">
            <span className="integration-tag">SIGNAL LINK FROM MEMBER 1 (MARS MAP):</span>
            <div className="integration-details">
              <strong>Target Locked:</strong> {activeLoc.name} ({activeLoc.lat >= 0 ? `${activeLoc.lat}°N` : `${Math.abs(activeLoc.lat)}°S`}, {activeLoc.lng >= 0 ? `${activeLoc.lng}°E` : `${Math.abs(activeLoc.lng)}°W`})
              <span className="ml-2 text-slate-400">Elevation: {activeLoc.elevation}m</span>
            </div>
          </div>
        )}

        <div className="placeholder-grid-sample">
          <div className="sample-card">
            <Sun className="w-6 h-6 text-yellow-400 mb-2" />
            <h4>Mars Atmospheric Pressure</h4>
            <div className="sample-val">7.21 hPa</div>
            <p>Continuous sensor feed from rover meteorological station</p>
          </div>
          <div className="sample-card">
            <CloudRain className="w-6 h-6 text-sky-400 mb-2" />
            <h4>Ambient Temperature</h4>
            <div className="sample-val">-63.5 °C</div>
            <p>Diurnal high: -18°C, Nighttime low: -95°C</p>
          </div>
          <div className="sample-card">
            <Activity className="w-6 h-6 text-emerald-400 mb-2" />
            <h4>UV Index & Radiation</h4>
            <div className="sample-val">240 µGy/day</div>
            <p>Galactic cosmic ray and solar proton flux</p>
          </div>
        </div>

        <div className="integration-note">
          <Database className="w-4 h-4 mr-1.5 text-cyan-400 inline" />
          <em>Ready for Member 2 code integration. Exports: <code>&lt;NasaDataModule /&gt;</code></em>
        </div>
      </div>
    </section>
  );
}
