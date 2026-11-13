// Custom Waypoint Modal Component
// Allows astronauts and colonists to drop custom GPS survival beacons on Mars

import React, { useState, useEffect } from 'react';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import { estimateMarsElevation, formatMarsCoords } from '../hooks/useMarsCoordinates';
import { Compass, Check, X, Shield, Droplets, BatteryCharging, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomWaypointModal({ isOpen, onClose, initialCoords }) {
  const { addCustomWaypoint } = useMarsMission();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('habitat');
  const [lat, setLat] = useState('18.42');
  const [lng, setLng] = useState('77.45');
  const [elevation, setElevation] = useState('-2480');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCoords) {
      setLat(initialCoords.lat?.toFixed(2) || '18.42');
      setLng(initialCoords.lng?.toFixed(2) || '77.45');
      const elev = initialCoords.elevation ?? estimateMarsElevation(initialCoords.lat || 0, initialCoords.lng || 0);
      setElevation(elev.toString());
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    const numElev = parseFloat(elevation);

    if (!name.trim()) {
      setError('Please provide a designation/name for this survival beacon.');
      return;
    }
    if (isNaN(numLat) || numLat < -90 || numLat > 90) {
      setError('Latitude must be between -90° and +90°.');
      return;
    }
    if (isNaN(numLng) || numLng < -180 || numLng > 180) {
      setError('Longitude must be between -180° and +180°.');
      return;
    }

    const newBeacon = {
      name: name.trim(),
      category: category,
      lat: numLat,
      lng: numLng,
      elevation: isNaN(numElev) ? -2000 : numElev,
      diameter: 1,
      mission: 'Colony Surface Operations',
      status: 'active',
      description: notes.trim() || 'Custom survival waypoint established by mission commander.',
      survivalViability: {
        score: 88,
        tier: 'Colonist Established Outpost',
        waterIce: 'Locally stockpiled',
        atmosphere: 'Habitat internal pressure: 101.3 kPa',
        radiation: 'Shielded vault',
        solarPower: 'Operational arrays',
        terrain: 'Surveyed landing pad'
      },
      tacticalNotes: notes.trim()
    };

    addCustomWaypoint(newBeacon);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }

    onClose();
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="modal-title">Deploy Survival Waypoint Beacon</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="modal-subtitle">
          Pin custom exploration caches, oxygen depots, and survival habitats to the planetary coordinate grid.
        </p>

        {error && (
          <div className="modal-error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Beacon Name */}
          <div className="form-group">
            <label className="form-label">BEACON DESIGNATION / NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Oxygen ISRU Cache Beta"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </div>

          {/* Coordinates Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">LATITUDE (-90° to +90°)</label>
              <input
                type="number"
                step="0.01"
                className="form-input font-mono"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">LONGITUDE (-180° to +180°)</label>
              <input
                type="number"
                step="0.01"
                className="form-input font-mono"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>

          {/* Elevation */}
          <div className="form-group">
            <label className="form-label">ELEVATION (METERS MOLA DATUM)</label>
            <input
              type="number"
              className="form-input font-mono"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
            />
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label className="form-label">FACILITY CLASSIFICATION</label>
            <div className="category-select-grid">
              <button
                type="button"
                className={`cat-opt-btn ${category === 'habitat' ? 'active' : ''}`}
                onClick={() => setCategory('habitat')}
              >
                <Home className="w-4 h-4 mr-1 text-emerald-400" />
                Habitat Dome
              </button>
              <button
                type="button"
                className={`cat-opt-btn ${category === 'ice_reserve' ? 'active' : ''}`}
                onClick={() => setCategory('ice_reserve')}
              >
                <Droplets className="w-4 h-4 mr-1 text-cyan-400" />
                Water Extraction
              </button>
              <button
                type="button"
                className={`cat-opt-btn ${category === 'rover' ? 'active' : ''}`}
                onClick={() => setCategory('rover')}
              >
                <BatteryCharging className="w-4 h-4 mr-1 text-amber-400" />
                Rover Depot
              </button>
              <button
                type="button"
                className={`cat-opt-btn ${category === 'crater' ? 'active' : ''}`}
                onClick={() => setCategory('crater')}
              >
                <Shield className="w-4 h-4 mr-1 text-rose-400" />
                Emergency Vault
              </button>
            </div>
          </div>

          {/* Tactical Notes */}
          <div className="form-group">
            <label className="form-label">SURVIVAL CACHE & TACTICAL NOTES</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="List available life support consumables, battery capacity, or shelter access codes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div className="modal-actions-row">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-submit-btn"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Transmit Beacon to Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
