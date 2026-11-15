import React, { useState } from 'react';
import styles from '../styles/terrain.module.css';
import TerrainAnalysis from './TerrainAnalysis/TerrainAnalysis';
import HazardIdentification from './HazardIdentification/HazardIdentification';
import ScientificPOIs from './ScientificPOIs/ScientificPOIs';
import MissionPlanning from './MissionPlanning/MissionPlanning';
import MissionDashboard from './MissionDashboard/MissionDashboard';
import { SIMULATED_REGIONS, SIMULATED_HAZARDS, SCIENTIFIC_POIS } from '../data/simulatedMarsData';
import { generateExperimentalRoute } from '../utils/routePlanner';
import { useMarsMission } from '../../../../context/MarsMissionContext';

const INITIAL_MISSION_DETAILS = {
  name: 'Ares-VII Reconnaissance Traverse',
  sol: 412,
  roverModel: 'Curiosity-Class Heavy RTG Rover (Mark IV)',
  description: 'Primary robotic surface survey investigating ancient lacustrine sedimentary sequences, paleohydrology, and volatile distribution along the Western Delta corridor.',
  objectives: [
    { id: 'obj-1', text: 'Traverse western delta scarp toward Jezero Paleolake sediments', completed: true },
    { id: 'obj-2', text: 'Collect 3 core drill samples of smectite clay-rich mudstones', completed: true },
    { id: 'obj-3', text: 'Conduct multispectral imaging of inverted channel riverbed pebbles', completed: false },
    { id: 'obj-4', text: 'Bypass active sand ripple fields with wheel slippage < 12%', completed: false },
    { id: 'obj-5', text: 'Transmit subsurface radar soundings to orbital relay before solar occultation', completed: false }
  ]
};

const INITIAL_START = {
  id: SIMULATED_REGIONS[0].id,
  name: SIMULATED_REGIONS[0].name,
  coordinates: SIMULATED_REGIONS[0].coordinates,
  lat: SIMULATED_REGIONS[0].coordinates.split(',')[0].trim(),
  lon: SIMULATED_REGIONS[0].coordinates.split(',')[1].trim(),
  mapCoords: SIMULATED_REGIONS[0].mapCoords,
  baseElevation: SIMULATED_REGIONS[0].baseElevation
};

const INITIAL_DEST = {
  id: SIMULATED_REGIONS[1].id,
  name: SIMULATED_REGIONS[1].name,
  coordinates: SIMULATED_REGIONS[1].coordinates,
  lat: SIMULATED_REGIONS[1].coordinates.split(',')[0].trim(),
  lon: SIMULATED_REGIONS[1].coordinates.split(',')[1].trim(),
  mapCoords: SIMULATED_REGIONS[1].mapCoords,
  baseElevation: SIMULATED_REGIONS[1].baseElevation
};

const INITIAL_SELECTED_POIS = [
  SCIENTIFIC_POIS.find(p => p.id === 'poi-jezero') || SCIENTIFIC_POIS[2],
  SCIENTIFIC_POIS.find(p => p.id === 'poi-olympus') || SCIENTIFIC_POIS[0]
].filter(Boolean);

/**
 * Main Terrain Module Entry Component (Member 3)
 * Bundles:
 * 1. Terrain Analysis (Elevation, Slope, Roughness)
 * 2. Hazard Identification (Obstacles, Steep Slopes, Observed vs Estimated)
 * 3. Scientific Points of Interest (Verified Geology, Olympus, Valles Marineris, Jezero, Gale, Hellas)
 * 4. Mission Planning (Experimental Route Planning & Distance Calculation)
 * 5. Mission Planning Dashboard (Unified Mission Details, Locations, Route, Hazards, Executive Briefing)
 * 
 * Ready to be imported and dropped directly into the shared team project.
 */
export default function TerrainModule({ defaultTab = 'terrain' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Cross-module synchronization with Member 1 & 2
  let missionCtx = null;
  try {
    missionCtx = useMarsMission();
  } catch (err) {
    // Standalone fallback
  }

  const mapWaypoints = missionCtx?.routeWaypoints || [];
  const navigateToModule = missionCtx?.navigateToModule;

  // Synchronized Mission State across all tabs
  const [missionDetails, setMissionDetails] = useState(INITIAL_MISSION_DETAILS);
  const [startLocation, setStartLocation] = useState(INITIAL_START);
  const [destLocation, setDestLocation] = useState(INITIAL_DEST);
  const [selectedPois, setSelectedPois] = useState(INITIAL_SELECTED_POIS);
  const [activeRoute, setActiveRoute] = useState(() => {
    return generateExperimentalRoute(INITIAL_START, INITIAL_DEST, SIMULATED_HAZARDS);
  });

  // When user clicks "Set as Mission Destination" on a Scientific POI
  const handleSelectPoiAsDestination = (poi) => {
    const destObj = {
      id: poi.id,
      name: poi.name,
      coordinates: poi.coordinates,
      lat: poi.lat,
      lon: poi.lon,
      mapCoords: poi.mapCoords,
      baseElevation: poi.elevation
    };
    setDestLocation(destObj);

    // Auto-include POI in selected list if not already there
    if (!selectedPois.some(p => p.id === poi.id)) {
      setSelectedPois(prev => [...prev, poi]);
    }

    // Automatically regenerate route
    const newRoute = generateExperimentalRoute(startLocation || INITIAL_START, destObj, SIMULATED_HAZARDS);
    setActiveRoute(newRoute);

    setActiveTab('planning');
  };

  // Mission Details Updates
  const handleUpdateMissionName = (newName) => {
    setMissionDetails(prev => ({ ...prev, name: newName }));
  };

  const handleAddObjective = (text) => {
    const newObj = {
      id: `obj-${Date.now()}`,
      text,
      completed: false
    };
    setMissionDetails(prev => ({
      ...prev,
      objectives: [...prev.objectives, newObj]
    }));
  };

  const handleToggleObjective = (id) => {
    setMissionDetails(prev => ({
      ...prev,
      objectives: prev.objectives.map(o => o.id === id ? { ...o, completed: !o.completed } : o)
    }));
  };

  const handleRemoveObjective = (id) => {
    setMissionDetails(prev => ({
      ...prev,
      objectives: prev.objectives.filter(o => o.id !== id)
    }));
  };

  const handleResetObjectives = () => {
    setMissionDetails(prev => ({
      ...prev,
      objectives: INITIAL_MISSION_DETAILS.objectives
    }));
  };

  // POI selection handlers
  const handleAddPoi = (poi) => {
    if (!selectedPois.some(p => p.id === poi.id)) {
      setSelectedPois(prev => [...prev, poi]);
    }
  };

  const handleRemovePoi = (poiId) => {
    setSelectedPois(prev => prev.filter(p => p.id !== poiId));
  };

  // Reset entire mission to factory default
  const handleResetMission = () => {
    setMissionDetails(INITIAL_MISSION_DETAILS);
    setStartLocation(INITIAL_START);
    setDestLocation(INITIAL_DEST);
    setSelectedPois(INITIAL_SELECTED_POIS);
    const resetRoute = generateExperimentalRoute(INITIAL_START, INITIAL_DEST, SIMULATED_HAZARDS);
    setActiveRoute(resetRoute);
  };

  return (
    <div className={styles.terrainModuleContainer}>
      <header className={styles.moduleHeader}>
        <div className={styles.moduleTitleBlock}>
          <div className={styles.moduleTitle}>
            <span>🪐 Martian Surface Operations</span>
            <span className={styles.moduleBadge}>Surface Operations</span>
          </div>
          <p className={styles.moduleSubtitle}>
            Terrain Analysis • Hazard Identification • Scientific POIs • Route Planning • Mission Dashboard
          </p>
        </div>
      </header>

      {/* Traverse Route Sync from Surface Map */}
      {mapWaypoints.length > 1 && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              TRAVERSE WAYPOINTS FROM SURFACE MAP:
            </span>
            <div style={{ fontSize: '0.88rem', color: '#f1f5f9', marginTop: '2px' }}>
              <strong>{mapWaypoints.length} waypoints</strong> active ({mapWaypoints.map(w => w.name).join(' → ')})
            </div>
          </div>
          {navigateToModule && (
            <button
              type="button"
              onClick={() => navigateToModule('member1-map')}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#34d399',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Inspect Route on Map
            </button>
          )}
        </div>
      )}

      <nav className={styles.tabNavigation} aria-label="Terrain Module Navigation">
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'terrain' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('terrain')}
        >
          🏔️ Terrain Analysis
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'hazards' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('hazards')}
        >
          ⚠️ Hazard Identification
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'poi' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('poi')}
        >
          🔬 Scientific POIs
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'planning' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('planning')}
        >
          🚀 Route Planner
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'dashboard' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📋 Mission Dashboard
        </button>
      </nav>

      <main className={styles.moduleContent}>
        {activeTab === 'terrain' && <TerrainAnalysis />}
        {activeTab === 'hazards' && <HazardIdentification />}
        {activeTab === 'poi' && (
          <ScientificPOIs
            onSelectDestination={handleSelectPoiAsDestination}
          />
        )}
        {activeTab === 'planning' && (
          <MissionPlanning
            initialDestination={destLocation}
            startLocation={startLocation}
            destLocation={destLocation}
            activeRoute={activeRoute}
            onRouteChange={(route) => setActiveRoute(route)}
            onStartChange={(start) => setStartLocation(start)}
            onDestChange={(dest) => setDestLocation(dest)}
          />
        )}
        {activeTab === 'dashboard' && (
          <MissionDashboard
            missionDetails={missionDetails}
            onUpdateMissionName={handleUpdateMissionName}
            onAddObjective={handleAddObjective}
            onToggleObjective={handleToggleObjective}
            onRemoveObjective={handleRemoveObjective}
            onResetObjectives={handleResetObjectives}
            startLocation={startLocation}
            destLocation={destLocation}
            selectedPois={selectedPois}
            onAddPoi={handleAddPoi}
            onRemovePoi={handleRemovePoi}
            onSetPoiAsDestination={handleSelectPoiAsDestination}
            activeRoute={activeRoute}
            hazards={SIMULATED_HAZARDS}
            onResetMission={handleResetMission}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>
    </div>
  );
}
