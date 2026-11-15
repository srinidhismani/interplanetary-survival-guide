import React, { useState } from 'react';
import styles from '../../styles/missionPlanning.module.css';
import InteractiveTerrainMap from '../TerrainAnalysis/InteractiveTerrainMap';
import RoutePlannerControl from './RoutePlannerControl';
import RouteDetailsPanel from './RouteDetailsPanel';
import { SIMULATED_REGIONS, SIMULATED_HAZARDS } from '../../data/simulatedMarsData';
import { RECON_TARGETS } from '../TerrainAnalysis/TerrainInspectorTool';
import { generateExperimentalRoute, PRESET_EXPEDITIONS } from '../../utils/routePlanner';

/**
 * Responsibility 3: Experimental Route Planning Dashboard (Member 3)
 * 
 * Features:
 * - Start and destination location selection (dropdown presets or click-to-pick on map)
 * - Autonomous terrain-aware pathfinding avoiding steep slopes and boulder fields
 * - Calculation of geographic route distance in kilometers (Haversine formula)
 * - Visualization of the generated route on the existing interactive Mars terrain map
 * - Identification of terrain challenges and bypassed obstacles
 * - Reset and re-generation capability
 * - Synchronized route telemetry display
 * - Strictly labeled simulated telemetry & astronaut safety disclaimer
 */
export default function MissionPlanning({
  regions = SIMULATED_REGIONS,
  hazards = SIMULATED_HAZARDS,
  initialDestination = null,
  startLocation: propStartLocation,
  destLocation: propDestLocation,
  activeRoute: propActiveRoute,
  onRouteChange,
  onStartChange,
  onDestChange
}) {
  // Combine regions and reconnaissance targets for selectable locations
  const availableLocations = [
    ...regions.map(r => ({
      id: r.id,
      name: r.name,
      coordinates: r.coordinates,
      lat: r.coordinates.split(',')[0].trim(),
      lon: r.coordinates.split(',')[1].trim(),
      mapCoords: r.mapCoords,
      baseElevation: r.baseElevation
    })),
    ...RECON_TARGETS.filter(t => !regions.some(r => r.id === t.regionId)).map(t => ({
      id: t.id,
      name: t.name,
      coordinates: `${t.lat}, ${t.lon}`,
      lat: t.lat,
      lon: t.lon,
      mapCoords: t.mapCoords,
      baseElevation: `${t.elevationM} m`
    }))
  ];

  const defaultDest = propDestLocation || initialDestination || availableLocations[3] || availableLocations[1];
  const [startLocation, setStartLocation] = useState(propStartLocation || availableLocations[0]);
  const [destLocation, setDestLocation] = useState(defaultDest);
  const [routeSelectMode, setRouteSelectMode] = useState(null); // 'start' | 'dest' | null
  const [activeRoute, setActiveRoute] = useState(() => {
    if (propActiveRoute) return propActiveRoute;
    return generateExperimentalRoute(propStartLocation || availableLocations[0], defaultDest, hazards);
  });

  // Sync with prop changes if provided by parent
  React.useEffect(() => {
    if (propStartLocation) {
      setStartLocation(propStartLocation);
    }
  }, [propStartLocation]);

  React.useEffect(() => {
    if (propDestLocation) {
      setDestLocation(propDestLocation);
    }
  }, [propDestLocation]);

  React.useEffect(() => {
    if (propActiveRoute) {
      setActiveRoute(propActiveRoute);
    }
  }, [propActiveRoute]);

  // Re-generate if initialDestination changes
  React.useEffect(() => {
    if (initialDestination) {
      setDestLocation(initialDestination);
      onDestChange?.(initialDestination);
      const generated = generateExperimentalRoute(startLocation || availableLocations[0], initialDestination, hazards);
      setActiveRoute(generated);
      onRouteChange?.(generated);
    }
  }, [initialDestination]);

  // Handle generating experimental route
  const handleGenerateRoute = () => {
    if (!startLocation || !destLocation) return;
    const generated = generateExperimentalRoute(startLocation, destLocation, hazards);
    setActiveRoute(generated);
    onRouteChange?.(generated);
    setRouteSelectMode(null);
  };

  // Handle resetting route
  const handleResetRoute = () => {
    setActiveRoute(null);
    onRouteChange?.(null);
    setStartLocation(null);
    onStartChange?.(null);
    setDestLocation(null);
    onDestChange?.(null);
    setRouteSelectMode(null);
  };

  // Handle selecting a preset expedition
  const handleSelectPreset = (expedition) => {
    setStartLocation(expedition.start);
    onStartChange?.(expedition.start);
    setDestLocation(expedition.dest);
    onDestChange?.(expedition.dest);
    const generated = generateExperimentalRoute(expedition.start, expedition.dest, hazards);
    setActiveRoute(generated);
    onRouteChange?.(generated);
    setRouteSelectMode(null);
  };

  // Handle user clicking directly on the map to choose Start or Destination
  const handleSelectRoutePointFromMap = (customPoint, mode) => {
    const locObj = {
      id: customPoint.id,
      name: customPoint.name,
      coordinates: `${customPoint.lat}, ${customPoint.lon}`,
      lat: customPoint.lat,
      lon: customPoint.lon,
      mapCoords: customPoint.mapCoords,
      baseElevation: `${customPoint.elevationM} m`
    };

    if (mode === 'start') {
      setStartLocation(locObj);
      onStartChange?.(locObj);
      setRouteSelectMode(null);
    } else if (mode === 'dest') {
      setDestLocation(locObj);
      onDestChange?.(locObj);
      setRouteSelectMode(null);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* =====================================================================
          MISSION PLANNING TELEMETRY STATUS BAR
         ===================================================================== */}
      <div className={styles.planningStatusBar}>
        <div className={styles.statusIdentityGroup}>
          <div className={styles.navPulseIndicator}>
            <span className={styles.pulseRadarDot} />
            <span className={styles.navIcon}>🚀</span>
          </div>
          <div>
            <div className={styles.statusTitle}>
              MARTIAN EXPEDITION TRAVERSE & MISSION PLANNING
            </div>
            <div className={styles.statusSub}>
              Autonomous Pathfinding & Waypoint Scheduling Engine • Sol 412
            </div>
          </div>
        </div>

        <div className={styles.statusReadoutsGroup}>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>CALCULATED DISTANCE</span>
            <span className={styles.chipVal} style={{ color: '#38bdf8' }}>
              {activeRoute ? `${activeRoute.totalDistanceKm} km` : '0 km'}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>TOTAL WAYPOINTS</span>
            <span className={styles.chipVal} style={{ color: '#f97316' }}>
              {activeRoute ? `${activeRoute.waypoints.length} Nodes` : '0'}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>PATHFEASIBILITY</span>
            <span className={styles.chipVal} style={{ color: activeRoute?.difficultyClass === 'high' ? '#ef4444' : '#10b981' }}>
              {activeRoute ? activeRoute.difficultyClass.toUpperCase() : 'STANDBY'}
            </span>
          </div>
          <span className={styles.simulatedLivePill}>EXPERIMENTAL ENGINE</span>
        </div>
      </div>

      {/* =====================================================================
          ROUTE PLANNER INTERACTIVE CONTROLS
         ===================================================================== */}
      <RoutePlannerControl
        availableLocations={availableLocations}
        startLocation={startLocation}
        onSelectStart={(loc) => setStartLocation(loc)}
        destLocation={destLocation}
        onSelectDest={(loc) => setDestLocation(loc)}
        onGenerateRoute={handleGenerateRoute}
        onResetRoute={handleResetRoute}
        routeSelectMode={routeSelectMode}
        onSetRouteSelectMode={(mode) => setRouteSelectMode(mode)}
        onSelectPreset={handleSelectPreset}
        hasActiveRoute={!!activeRoute}
      />

      {/* =====================================================================
          2-COLUMN WORKSPACE: MAP (LEFT) + ROUTE DETAILS PANEL (RIGHT)
         ===================================================================== */}
      <div className={styles.workspaceGrid}>
        {/* Left Column: Reuses InteractiveTerrainMap with Route Visualization */}
        <div className={styles.mapWorkspaceCol}>
          <div className={styles.mapWrapperBox}>
            <div className={styles.mapNoticeBar}>
              <span>🗺️ Autonomous Traverse Path on Mars Topography</span>
              {routeSelectMode ? (
                <span className={styles.mapModeActiveText}>
                  🎯 Mode Active: Click anywhere on the map to set <strong>{routeSelectMode === 'start' ? 'Start [A]' : 'Destination [B]'}</strong>
                </span>
              ) : (
                <span className={styles.mapNoticeSub}>
                  Route Path: 🟢 Start [A] ➜ 🔴 Destination [B] • Glowing Cyan Path
                </span>
              )}
            </div>

            <InteractiveTerrainMap
              regions={regions}
              hazards={hazards}
              selectedRegionId={startLocation?.id?.startsWith('reg') ? startLocation.id : 'reg-01'}
              onSelectRegion={() => {}}
              mapMode="elevation"
              activeRoute={activeRoute}
              routeStart={startLocation}
              routeDest={destLocation}
              routeSelectMode={routeSelectMode}
              onSelectRoutePoint={handleSelectRoutePointFromMap}
              layers={{ elevation: true, roughness: true, hazards: true, grid: true }}
            />
          </div>
        </div>

        {/* Right Column: Detailed Route Telemetry & Waypoints */}
        <div className={styles.infoPanelCol}>
          <RouteDetailsPanel route={activeRoute} />
        </div>
      </div>
    </div>
  );
}
