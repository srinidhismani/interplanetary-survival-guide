// Member 1 Main Module: Interactive Mars Surface Map & Cartography System
// Modular, Reusable, and Fully Integrated for the Interplanetary Survival Guide

import React, { useState } from 'react';
import { useMarsMission } from '../../../context/MarsMissionContext';
import LandingPageHero from './components/LandingPageHero';
import MapControls from './components/MapControls';
import CoordinateHUD from './components/CoordinateHUD';
import MarsCanvas2D from './components/MarsCanvas2D';
import MarsGlobe3D from './components/MarsGlobe3D';
import LocationInfoPanel from './components/LocationInfoPanel';
import LocationListDrawer from './components/LocationListDrawer';
import CustomWaypointModal from './components/CustomWaypointModal';
import './MarsMapModule.css';

export default function MarsMapModule() {
  const { viewMode, selectedLocation } = useMarsMission();

  // Local UI state
  const [cursorTelemetry, setCursorTelemetry] = useState(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isWaypointModalOpen, setIsWaypointModalOpen] = useState(false);
  const [modalInitialCoords, setModalInitialCoords] = useState(null);
  const [isInfoPanelCollapsed, setIsInfoPanelCollapsed] = useState(false);

  // Surface coordinate clicked
  const handleSelectCoordinate = (coordData) => {
    setModalInitialCoords(coordData);
    setIsInfoPanelCollapsed(false);
  };

  // Open custom modal pre-filled with current cursor or selected location
  const handleOpenCustomModal = () => {
    if (selectedLocation) {
      setModalInitialCoords({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        elevation: selectedLocation.elevation
      });
    } else if (cursorTelemetry) {
      setModalInitialCoords(cursorTelemetry);
    }
    setIsWaypointModalOpen(true);
  };

  return (
    <section className="mars-map-module-root" aria-label="Interactive Mars Surface Map">
      {/* 1. NASA Landing Page Hero & Mission Exploration Briefing */}
      <LandingPageHero onOpenCatalog={() => setIsCatalogOpen(true)} />

      {/* 2. Map Control Deck (Layers, 2D/3D Mode, Filters, Search) */}
      <MapControls onOpenCustomModal={handleOpenCustomModal} />

      {/* 3. Live Planetary Coordinate HUD Tracker */}
      <CoordinateHUD cursorCoords={cursorTelemetry} />

      {/* 4. Interactive Map Workspace (Map Viewport + Location Dossier) */}
      <div className="mars-map-viewport-wrapper">
        {/* Main Canvas Viewport (Switches between 2D Map & 3D Three.js Globe) */}
        <div className="mars-map-render-area">
          {viewMode === '3D' ? (
            <MarsGlobe3D
              onHoverCoords={setCursorTelemetry}
              onSelectCoordinate={handleSelectCoordinate}
            />
          ) : (
            <MarsCanvas2D
              onHoverCoords={setCursorTelemetry}
              onSelectCoordinate={handleSelectCoordinate}
            />
          )}

          {/* Floating HUD Watermark */}
          <div className="map-view-watermark">
            <span className="watermark-tag">PROJECTION:</span>
            <span className="watermark-val">
              {viewMode === '3D' ? 'WebGL 3D Spherical Geodesy' : 'Equirectangular Simple Cylindrical (Plate Carrée)'}
            </span>
          </div>

          {/* Toggle Button to re-open collapsed dossier */}
          {isInfoPanelCollapsed && selectedLocation && (
            <button
              type="button"
              className="reopen-dossier-pill"
              onClick={() => setIsInfoPanelCollapsed(false)}
            >
              Show Dossier: <strong>{selectedLocation.name}</strong>
            </button>
          )}
        </div>

        {/* Location Information Panel (Collapsible Sidebar / Dock) */}
        {!isInfoPanelCollapsed && (
          <aside className="mars-dossier-sidebar">
            <LocationInfoPanel onClose={() => setIsInfoPanelCollapsed(true)} />
          </aside>
        )}
      </div>

      {/* 5. Landmark Catalog Slide-out Drawer */}
      <LocationListDrawer
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />

      {/* 6. Deploy Custom Survival Beacon Modal */}
      <CustomWaypointModal
        isOpen={isWaypointModalOpen}
        onClose={() => setIsWaypointModalOpen(false)}
        initialCoords={modalInitialCoords}
      />
    </section>
  );
}
