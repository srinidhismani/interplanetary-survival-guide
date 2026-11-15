import React from 'react';
import styles from '../../styles/missionPlanning.module.css';
import { PRESET_EXPEDITIONS } from '../../utils/routePlanner';

/**
 * Interactive Controls for Selecting Start, Destination, and Presets
 */
export default function RoutePlannerControl({
  availableLocations = [],
  startLocation,
  onSelectStart,
  destLocation,
  onSelectDest,
  onGenerateRoute,
  onResetRoute,
  routeSelectMode,
  onSetRouteSelectMode,
  onSelectPreset,
  hasActiveRoute
}) {
  return (
    <div className={styles.plannerControlContainer}>
      <div className={styles.plannerHeaderRow}>
        <div>
          <h3 className={styles.plannerTitle}>Experimental Route Planner</h3>
          <span className={styles.plannerSub}>A* Terrain-Aware Obstacle Bypass Engine</span>
        </div>
        <span className={styles.simulatedTag}>[SIMULATED DATA]</span>
      </div>

      {/* Preset Expeditions Quick Selector */}
      <div className={styles.presetSection}>
        <span className={styles.controlLabel}>Quick Expeditions:</span>
        <div className={styles.presetButtonsWrap}>
          {PRESET_EXPEDITIONS.map((exp) => (
            <button
              key={exp.id}
              type="button"
              className={styles.presetButton}
              onClick={() => onSelectPreset(exp)}
            >
              📍 {exp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Start and Destination Selection Grid */}
      <div className={styles.pickersGrid}>
        {/* Start Location Picker */}
        <div className={styles.pickerBox}>
          <div className={styles.pickerHeader}>
            <span className={styles.pickerLabel} style={{ color: '#10b981' }}>
              ● 1. Starting Location:
            </span>
            <button
              type="button"
              className={`${styles.mapPickToggle} ${routeSelectMode === 'start' ? styles.mapPickToggleActive : ''}`}
              onClick={() => onSetRouteSelectMode(routeSelectMode === 'start' ? null : 'start')}
            >
              {routeSelectMode === 'start' ? '📍 Click Map to Set' : '🗺️ Pick on Map'}
            </button>
          </div>

          <select
            className={styles.locationSelect}
            value={startLocation?.id || ''}
            onChange={(e) => {
              const found = availableLocations.find(l => l.id === e.target.value);
              if (found) onSelectStart(found);
            }}
          >
            <option value="">-- Choose Starting Site --</option>
            {availableLocations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.coordinates || `${loc.lat}, ${loc.lon}`})
              </option>
            ))}
          </select>

          {startLocation && (
            <div className={styles.selectedSitePreview}>
              <strong>Selected:</strong> {startLocation.name.split(' - ')[0]} ({startLocation.coordinates || `${startLocation.lat}, ${startLocation.lon}`})
            </div>
          )}
        </div>

        {/* Destination Location Picker */}
        <div className={styles.pickerBox}>
          <div className={styles.pickerHeader}>
            <span className={styles.pickerLabel} style={{ color: '#ef4444' }}>
              ● 2. Destination:
            </span>
            <button
              type="button"
              className={`${styles.mapPickToggle} ${routeSelectMode === 'dest' ? styles.mapPickToggleActive : ''}`}
              onClick={() => onSetRouteSelectMode(routeSelectMode === 'dest' ? null : 'dest')}
            >
              {routeSelectMode === 'dest' ? '📍 Click Map to Set' : '🗺️ Pick on Map'}
            </button>
          </div>

          <select
            className={styles.locationSelect}
            value={destLocation?.id || ''}
            onChange={(e) => {
              const found = availableLocations.find(l => l.id === e.target.value);
              if (found) onSelectDest(found);
            }}
          >
            <option value="">-- Choose Destination --</option>
            {availableLocations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.coordinates || `${loc.lat}, ${loc.lon}`})
              </option>
            ))}
          </select>

          {destLocation && (
            <div className={styles.selectedSitePreview}>
              <strong>Selected:</strong> {destLocation.name.split(' - ')[0]} ({destLocation.coordinates || `${destLocation.lat}, ${destLocation.lon}`})
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Generate & Reset */}
      <div className={styles.actionButtonsRow}>
        <button
          type="button"
          className={styles.generateButton}
          onClick={onGenerateRoute}
          disabled={!startLocation || !destLocation}
        >
          🚀 Generate Experimental Route
        </button>

        <button
          type="button"
          className={styles.resetButton}
          onClick={onResetRoute}
          disabled={!startLocation && !destLocation && !hasActiveRoute}
        >
          🔄 Reset Route
        </button>
      </div>
    </div>
  );
}
