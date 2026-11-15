// Location Information Panel Component
// Detailed Mars Landmark Dossier, Survival Viability Metrics, and Cross-Module Integration Actions

import React, { useState } from 'react';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import { formatMarsCoords } from '../hooks/useMarsCoordinates';
import {
  Compass,
  Mountain,
  ShieldAlert,
  Droplets,
  Wind,
  Sun,
  Activity,
  Send,
  Navigation,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  Radio
} from 'lucide-react';

export default function LocationInfoPanel({ onClose }) {
  const {
    selectedLocation,
    flyTo,
    setTelemetryTarget,
    addToMissionRoute,
    routeWaypoints,
    navigateToModule
  } = useMarsMission();

  const [copied, setCopied] = useState(false);
  const [addedRoute, setAddedRoute] = useState(false);
  const [sentTelemetry, setSentTelemetry] = useState(false);

  if (!selectedLocation) {
    return (
      <div className="location-info-empty-state">
        <Compass className="w-12 h-12 text-cyan-400 mb-3 animate-spin" style={{ animationDuration: '8s' }} />
        <h3>SELECT MARTIAN LANDMARK</h3>
        <p>Click on any rover pin, volcano, canyon, or surface coordinate to load exploration telemetry.</p>
      </div>
    );
  }

  const loc = selectedLocation;
  const formatted = formatMarsCoords(loc.lat, loc.lng);
  const viability = loc.survivalViability || {
    score: 75,
    tier: 'Habitation Candidate',
    waterIce: 'Moderate',
    atmosphere: '6.8 mbar',
    radiation: 'Standard exposure',
    solarPower: 'Moderate',
    terrain: 'Regolith'
  };

  const isAlreadyInRoute = routeWaypoints.some((w) => w.id === loc.id);

  const handleCopyCoords = () => {
    const text = `${loc.name}: ${formatted.latStr}, ${formatted.lngStr} (Elevation: ${loc.elevation}m)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToTelemetry = () => {
    setTelemetryTarget(loc);
    setSentTelemetry(true);
    if (navigateToModule) {
      setTimeout(() => {
        navigateToModule('member2-nasa');
      }, 500);
    } else {
      setTimeout(() => setSentTelemetry(false), 2500);
    }
  };

  const handleAddToRoute = () => {
    addToMissionRoute(loc);
    setAddedRoute(true);
    setTimeout(() => setAddedRoute(false), 2500);
  };

  // Color according to score
  const scoreColor =
    viability.score >= 85
      ? '#22c55e'
      : viability.score >= 70
      ? '#38bdf8'
      : viability.score >= 50
      ? '#eab308'
      : '#f43f5e';

  return (
    <div className="location-info-panel-container">
      {/* Panel Header */}
      <div className="panel-header-section">
        <div className="flex items-center justify-between">
          <span className="location-badge">
            {loc.categoryLabel || 'Geological Landmark'}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`status-pill ${loc.status}`}>
              {loc.status?.toUpperCase() || 'DOCUMENTED'}
            </span>
            {onClose && (
              <button
                type="button"
                className="close-panel-btn"
                onClick={onClose}
                title="Close Dossier"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <h2 className="location-title">{loc.name}</h2>
        <div className="location-mission-sub">
          <Radio className="w-3.5 h-3.5 mr-1 text-cyan-400 inline" />
          <span>{loc.mission || 'NASA Planetary Database'}</span>
        </div>
      </div>

      {/* Panel Scrollable Content */}
      <div className="panel-scroll-body">
        {/* Geographic Coordinates HUD Box */}
        <div className="coordinates-card">
          <div className="coord-metric">
            <span className="coord-label">LATITUDE</span>
            <span className="coord-val font-mono">{formatted.latStr}</span>
          </div>
          <div className="coord-metric">
            <span className="coord-label">LONGITUDE</span>
            <span className="coord-val font-mono">{formatted.lngStr}</span>
          </div>
          <div className="coord-metric">
            <span className="coord-label">ELEVATION</span>
            <span className={`coord-val font-mono ${loc.elevation < 0 ? 'text-sky-300' : 'text-emerald-300'}`}>
              {loc.elevation > 0 ? `+${(loc.elevation / 1000).toFixed(2)} km` : `${(loc.elevation / 1000).toFixed(2)} km`}
            </span>
          </div>
          <div className="coord-metric">
            <span className="coord-label">DIAMETER</span>
            <span className="coord-val font-mono">
              {loc.diameter ? `${loc.diameter} km` : 'Regional'}
            </span>
          </div>
        </div>

        {/* Survival Viability Score Gauge */}
        <div className="viability-gauge-card">
          <div className="gauge-header">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">Survival Viability Index</span>
            </div>
            <span className="viability-score-number" style={{ color: scoreColor }}>
              {viability.score} <span className="text-xs text-slate-400">/ 100</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="viability-progress-track">
            <div
              className="viability-progress-bar"
              style={{
                width: `${viability.score}%`,
                backgroundColor: scoreColor,
                boxShadow: `0 0 12px ${scoreColor}88`
              }}
            />
          </div>
          <div className="gauge-footer-tier">
            <span>Tier Rating:</span>
            <strong style={{ color: scoreColor }}>{viability.tier || 'Exploration Candidate'}</strong>
          </div>
        </div>

        {/* Planetary Scientific Description */}
        <div className="panel-section">
          <h4 className="section-title">EXPLORATION BRIEFING</h4>
          <p className="description-text">{loc.description}</p>
        </div>

        {/* Survival Environment Breakdown Matrix */}
        <div className="panel-section">
          <h4 className="section-title">SURVIVAL RESOURCE PARAMETERS</h4>
          <div className="viability-grid">
            {/* Water Ice */}
            <div className="viability-item">
              <div className="item-header">
                <Droplets className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                <span>Water-Ice Access</span>
              </div>
              <p className="item-value">{viability.waterIce}</p>
            </div>

            {/* Atmosphere Pressure */}
            <div className="viability-item">
              <div className="item-header">
                <Wind className="w-3.5 h-3.5 text-sky-400 mr-1" />
                <span>Atmospheric Pressure</span>
              </div>
              <p className="item-value">{viability.atmosphere}</p>
            </div>

            {/* Radiation Shielding */}
            <div className="viability-item">
              <div className="item-header">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 mr-1" />
                <span>Radiation Protection</span>
              </div>
              <p className="item-value">{viability.radiation}</p>
            </div>

            {/* Solar Insolation */}
            <div className="viability-item">
              <div className="item-header">
                <Sun className="w-3.5 h-3.5 text-yellow-400 mr-1" />
                <span>Solar Power Potential</span>
              </div>
              <p className="item-value">{viability.solarPower}</p>
            </div>
          </div>
        </div>

        {/* Tactical Survival Notes */}
        {loc.tacticalNotes && (
          <div className="tactical-notes-card">
            <div className="flex items-center mb-1.5">
              <Flame className="w-4 h-4 text-amber-400 mr-1.5" />
              <strong className="text-amber-300 text-xs tracking-wider uppercase">
                Astronaut Survival Tactical Directives
              </strong>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {loc.tacticalNotes}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer Bar (Member 2 & 3 Integration Connectors) */}
      <div className="panel-actions-footer">
        {/* Fly to Marker Button */}
        <button
          type="button"
          className="action-btn primary-fly-btn"
          onClick={() => flyTo(loc)}
          title="Zoom camera directly to this landmark"
        >
          <Navigation className="w-4 h-4 mr-1.5" />
          Fly To Target
        </button>

        {/* Copy Coordinates */}
        <button
          type="button"
          className="action-btn secondary-btn"
          onClick={handleCopyCoords}
          title="Copy Martian coordinates to clipboard"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        {/* Science Telemetry Action */}
        <button
          type="button"
          className="action-btn telemetry-btn"
          onClick={handleSendToTelemetry}
          title="Inspect telemetry in Planetary Science module"
        >
          <Radio className="w-4 h-4 mr-1.5 text-cyan-400" />
          {sentTelemetry ? 'Transmitted' : 'Science Feed'}
        </button>

        {/* Mission Traverse Route Action */}
        <button
          type="button"
          className={`action-btn route-btn ${isAlreadyInRoute ? 'already-added' : ''}`}
          onClick={handleAddToRoute}
          title="Add location to Mission Traverse Route"
        >
          <Send className="w-4 h-4 mr-1.5 text-emerald-400" />
          {addedRoute ? 'Added to Route' : isAlreadyInRoute ? 'In Route' : 'Add to Plan'}
        </button>

        {/* Direct link to Route Planner if in route */}
        {isAlreadyInRoute && navigateToModule && (
          <button
            type="button"
            className="action-btn secondary-btn"
            style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
            onClick={() => navigateToModule('member3-planning')}
            title="Open Route & Mission Planner"
          >
            Open Planner →
          </button>
        )}
      </div>
    </div>
  );
}
