// Shared Mission Context for the Interplanetary Survival Guide
// Connects Member 1 (Mars Map), Member 2 (NASA Telemetry), and Member 3 (Mission Planning)

import React, { createContext, useContext, useState, useCallback } from 'react';
import { MARS_LOCATIONS, MAP_LAYERS } from '../components/modules/member1-mars-map/data/marsLocations';

const MarsMissionContext = createContext(null);

export function MarsMissionProvider({ children }) {
  // Active top-level module: 'home', 'member1-map', 'member2-nasa', 'member3-planning'
  const [activeModule, setActiveModule] = useState('home');

  // Selected location (defaults to Jezero Crater - primary rover landing site)
  const [selectedLocation, setSelectedLocation] = useState(MARS_LOCATIONS[0]);
  
  // Custom user-pinned waypoints (survival caches, landing beacons)
  const [customWaypoints, setCustomWaypoints] = useState([
    {
      id: 'custom-beacon-01',
      name: 'Oxygen ISRU Depot Alpha',
      category: 'habitat',
      categoryLabel: 'Survival Depot',
      lat: 18.44,
      lng: 77.40,
      elevation: -2480,
      notes: 'Automated MOXIE oxygen generation cache with 400 kg LOX storage.',
      timestamp: 'Sol 124',
      isCustom: true
    }
  ]);

  // Map visualization state
  const [activeLayer, setActiveLayer] = useState(MAP_LAYERS[0]);
  const [viewMode, setViewMode] = useState('2D'); // '2D' or '3D'
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showIceOverlay, setShowIceOverlay] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Camera fly-to trigger (triggers smooth zoom and center in 2D or 3D view)
  const [flyToTarget, setFlyToTarget] = useState(null);

  // Cross-module integration payloads:
  // Member 2 (NASA Telemetry) data hook
  const [telemetryTarget, setTelemetryTarget] = useState(null);
  
  // Member 3 (Mission Planning) survival route targets
  const [routeWaypoints, setRouteWaypoints] = useState([MARS_LOCATIONS[0]]);

  // Trigger smooth flight to location
  const flyTo = useCallback((loc) => {
    setSelectedLocation(loc);
    setFlyToTarget({ lat: loc.lat, lng: loc.lng, zoom: 3.5, timestamp: Date.now() });
  }, []);

  // Add custom user waypoint
  const addCustomWaypoint = useCallback((waypoint) => {
    const newWp = {
      ...waypoint,
      id: `custom-${Date.now()}`,
      category: 'habitat',
      categoryLabel: 'Custom Beacon',
      isCustom: true,
      timestamp: `Sol ${Math.floor(Math.random() * 500 + 100)}`
    };
    setCustomWaypoints((prev) => [newWp, ...prev]);
    setSelectedLocation(newWp);
    setFlyToTarget({ lat: newWp.lat, lng: newWp.lng, zoom: 3.5, timestamp: Date.now() });
    return newWp;
  }, []);

  // Remove custom waypoint
  const removeCustomWaypoint = useCallback((id) => {
    setCustomWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  }, []);

  // Add to Mission Route (Integration with Member 3)
  const addToMissionRoute = useCallback((loc) => {
    setRouteWaypoints((prev) => {
      if (prev.some((p) => p.id === loc.id)) return prev;
      return [...prev, loc];
    });
  }, []);

  // Seamless navigation helper across modules with optional target lock
  const navigateToModule = useCallback((moduleId, targetLoc = null) => {
    if (targetLoc) {
      setSelectedLocation(targetLoc);
      setTelemetryTarget(targetLoc);
      setFlyToTarget({ lat: targetLoc.lat, lng: targetLoc.lng, zoom: 3.5, timestamp: Date.now() });
    }
    setActiveModule(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = {
    // Navigation & Active Module
    activeModule,
    setActiveModule,
    navigateToModule,

    // Locations
    locations: MARS_LOCATIONS,
    customWaypoints,
    allLocations: [...customWaypoints, ...MARS_LOCATIONS],
    selectedLocation,
    setSelectedLocation,
    addCustomWaypoint,
    removeCustomWaypoint,

    // Map controls & layers
    mapLayers: MAP_LAYERS,
    activeLayer,
    setActiveLayer,
    viewMode,
    setViewMode,
    showGrid,
    setShowGrid,
    showLabels,
    setShowLabels,
    showIceOverlay,
    setShowIceOverlay,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,

    // Motion & Focus
    flyToTarget,
    flyTo,

    // Member 2 Integration (NASA Data)
    telemetryTarget,
    setTelemetryTarget,

    // Member 3 Integration (Mission Planning)
    routeWaypoints,
    setRouteWaypoints,
    addToMissionRoute
  };

  return (
    <MarsMissionContext.Provider value={value}>
      {children}
    </MarsMissionContext.Provider>
  );
}

export function useMarsMission() {
  const context = useContext(MarsMissionContext);
  if (!context) {
    throw new Error('useMarsMission must be used within a MarsMissionProvider');
  }
  return context;
}
