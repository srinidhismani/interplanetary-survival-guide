import React, { useState } from 'react';
import styles from '../../styles/missionDashboard.module.css';
import { SCIENTIFIC_POIS } from '../../data/simulatedMarsData';

/**
 * Selected Locations Card
 * Displays the selected start point, destination, and selected scientific POIs.
 * Allows adding/removing scientific points of interest and linking to route planning.
 */
export default function SelectedLocationsCard({
  startLocation,
  destLocation,
  selectedPois = [],
  onAddPoi,
  onRemovePoi,
  onSetPoiAsDestination,
  onNavigateTab
}) {
  const [selectedPoiToAdd, setSelectedPoiToAdd] = useState('');

  const handleAddPoiSubmit = (e) => {
    e.preventDefault();
    if (!selectedPoiToAdd) return;
    const poi = SCIENTIFIC_POIS.find(p => p.id === selectedPoiToAdd);
    if (poi && !selectedPois.some(p => p.id === poi.id)) {
      onAddPoi(poi);
    }
    setSelectedPoiToAdd('');
  };

  // POIs not yet added to the mission
  const availablePoisToAdd = SCIENTIFIC_POIS.filter(
    poi => !selectedPois.some(sp => sp.id === poi.id)
  );

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.cardSectionBadge}>SURFACE COORDINATES & SITES</span>
          <h3 className={styles.cardTitle}>Selected Mission Locations</h3>
        </div>
        {onNavigateTab && (
          <button
            type="button"
            className={styles.secondaryActionBtn}
            onClick={() => onNavigateTab('planning')}
          >
            🧭 Route Planner ↗
          </button>
        )}
      </div>

      {/* Start and Destination Waypoint Cards */}
      <div className={styles.endpointPairGrid}>
        {/* Origin / Starting Location */}
        <div className={styles.endpointBox}>
          <div className={styles.endpointBadgeRow}>
            <span className={styles.startBadge}>ORIGIN [A]</span>
            <span className={styles.endpointStatusPill}>Active Waypoint</span>
          </div>
          <div className={styles.endpointName}>
            {startLocation ? startLocation.name : 'Not Designated'}
          </div>
          <div className={styles.endpointMeta}>
            <span>📍 Coords: {startLocation?.coordinates || 'N/A'}</span>
            <span>🏔️ Datum Alt: {startLocation?.baseElevation || 'N/A'}</span>
          </div>
        </div>

        {/* Destination Location */}
        <div className={styles.endpointBox}>
          <div className={styles.endpointBadgeRow}>
            <span className={styles.destBadge}>DESTINATION [B]</span>
            <span className={styles.endpointStatusPill}>Primary Target</span>
          </div>
          <div className={styles.endpointName}>
            {destLocation ? destLocation.name : 'Not Designated'}
          </div>
          <div className={styles.endpointMeta}>
            <span>📍 Coords: {destLocation?.coordinates || 'N/A'}</span>
            <span>🏔️ Datum Alt: {destLocation?.baseElevation || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Selected Scientific Points of Interest */}
      <div className={styles.poisSection}>
        <div className={styles.subHeaderRow}>
          <span className={styles.subTitle}>
            Scientific POIs in Mission Area ({selectedPois.length}):
          </span>
          {onNavigateTab && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => onNavigateTab('poi')}
            >
              Browse Full Geological Atlas ↗
            </button>
          )}
        </div>

        {selectedPois.length === 0 ? (
          <div className={styles.emptyStateBox}>
            <p>No Scientific Points of Interest attached to this mission yet.</p>
            <span className={styles.emptyHint}>Select from the list below or from the Scientific POIs atlas.</span>
          </div>
        ) : (
          <div className={styles.poiCardsGrid}>
            {selectedPois.map((poi) => (
              <div key={poi.id} className={styles.poiMissionCard}>
                <div className={styles.poiMissionHeader}>
                  <div className={styles.poiTitleGroup}>
                    <span className={styles.poiIcon}>{poi.icon || '🔬'}</span>
                    <div>
                      <strong className={styles.poiName}>{poi.name}</strong>
                      <span className={styles.poiCatTag}>{poi.category}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.removeObjBtn}
                    onClick={() => onRemovePoi(poi.id)}
                    title="Remove POI from Mission Plan"
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.poiMissionDetails}>
                  <div className={styles.poiMetaLine}>
                    <span>📍 {poi.coordinates}</span>
                    <span>🏔️ {poi.elevation}</span>
                  </div>
                  <p className={styles.poiShortDesc}>{poi.shortDescription}</p>
                </div>

                <div className={styles.poiCardFooter}>
                  <button
                    type="button"
                    className={styles.setDestMiniBtn}
                    onClick={() => onSetPoiAsDestination(poi)}
                    title="Set this POI as Destination [B] for Route Planning"
                  >
                    🎯 Set as Mission Destination [B]
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add POI to mission itinerary */}
        {availablePoisToAdd.length > 0 && (
          <form onSubmit={handleAddPoiSubmit} className={styles.addPoiForm}>
            <select
              className={styles.selectPoiDropdown}
              value={selectedPoiToAdd}
              onChange={(e) => setSelectedPoiToAdd(e.target.value)}
            >
              <option value="">-- Add Geological POI to Itinerary --</option>
              {availablePoisToAdd.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category} • {p.coordinates})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={styles.addObjButton}
              disabled={!selectedPoiToAdd}
            >
              + Include POI
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
