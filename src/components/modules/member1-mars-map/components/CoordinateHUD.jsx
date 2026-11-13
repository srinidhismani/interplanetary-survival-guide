// Live Mars Coordinate & Planetary Telemetry HUD
// Real-time cursor coordinates, MOLA Elevation, Solar Longitude, Sol Time.

import React, { useState, useEffect } from 'react';
import { Crosshair, Mountain, Sun, Clock, Compass } from 'lucide-react';
import { formatMarsCoords } from '../hooks/useMarsCoordinates';

export default function CoordinateHUD({ cursorCoords }) {
  // Real-time Martian Solar Time calculation
  const [solTime, setSolTime] = useState('14:28:40 MTC');
  const [lsDegree, setLsDegree] = useState('Ls 34.2° (Northern Spring)');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Calculate Coordinated Mars Time (MTC)
      const millis = now.getTime();
      const marsSeconds = (millis / 1000) * (86400 / 88775.244);
      const hours = Math.floor((marsSeconds / 3600) % 24);
      const mins = Math.floor((marsSeconds / 60) % 60);
      const secs = Math.floor(marsSeconds % 60);
      setSolTime(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} MTC`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = cursorCoords
    ? formatMarsCoords(cursorCoords.lat, cursorCoords.lng)
    : { latStr: '00°00\'00" N', lngStr: '00°00\'00" E', lat: 0, lng: 0 };

  const elevation = cursorCoords ? cursorCoords.elevation : -2400;

  return (
    <div className="mars-coordinate-hud-bar">
      {/* Target Crosshair Status */}
      <div className="hud-metric-item target-status">
        <Crosshair className="hud-icon text-cyan-400 animate-pulse" />
        <div className="hud-metric-content">
          <span className="hud-metric-label">SURFACE TARGET RETICLE</span>
          <span className="hud-metric-value text-cyan-300">
            {formatted.lat >= 0 ? '+' : ''}{formatted.lat?.toFixed(2)}°, {formatted.lng >= 0 ? '+' : ''}{formatted.lng?.toFixed(2)}°
          </span>
        </div>
      </div>

      {/* Latitude DMS */}
      <div className="hud-metric-item">
        <Compass className="hud-icon text-amber-400" />
        <div className="hud-metric-content">
          <span className="hud-metric-label">LATITUDE (AREOCENTRIC)</span>
          <span className="hud-metric-value text-amber-300 font-mono">
            {formatted.latStr}
          </span>
        </div>
      </div>

      {/* Longitude DMS */}
      <div className="hud-metric-item">
        <Compass className="hud-icon text-amber-400" />
        <div className="hud-metric-content">
          <span className="hud-metric-label">LONGITUDE (EASTING)</span>
          <span className="hud-metric-value text-amber-300 font-mono">
            {formatted.lngStr}
          </span>
        </div>
      </div>

      {/* Elevation MOLA Datum */}
      <div className="hud-metric-item">
        <Mountain className="hud-icon text-emerald-400" />
        <div className="hud-metric-content">
          <span className="hud-metric-label">ELEVATION (MOLA DATUM)</span>
          <span className={`hud-metric-value font-mono ${elevation < 0 ? 'text-sky-300' : 'text-emerald-300'}`}>
            {elevation > 0 ? `+${(elevation / 1000).toFixed(2)} km` : `${(elevation / 1000).toFixed(2)} km`}
            <span className="text-xs text-slate-400 ml-1">({elevation > 0 ? `+${elevation}m` : `${elevation}m`})</span>
          </span>
        </div>
      </div>

      {/* Solar Longitude Season */}
      <div className="hud-metric-item hidden-mobile">
        <Sun className="hud-icon text-yellow-400" />
        <div className="hud-metric-content">
          <span className="hud-metric-label">SOLAR LONGITUDE (SEASON)</span>
          <span className="hud-metric-value text-yellow-300">
            {lsDegree}
          </span>
        </div>
      </div>

      {/* Martian Clock (MTC) */}
      <div className="hud-metric-item hidden-mobile">
        <Clock className="hud-icon text-rose-400" />
        <div className="hud-metric-content">
          <span className="hud-metric-label">MARS COORDINATED TIME</span>
          <span className="hud-metric-value text-rose-300 font-mono">
            {solTime}
          </span>
        </div>
      </div>
    </div>
  );
}
