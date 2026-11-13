// Map Controls Component: Layer Switcher, 2D/3D Toggle, Feature Filters, Overlays
// Member 1 - Interactive Mars Map Module

import React from 'react';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import { Layers, Globe, Map, Grid, Tag, Droplets, Compass, Search } from 'lucide-react';

export default function MapControls({ onOpenCustomModal }) {
  const {
    mapLayers,
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
    setSearchQuery
  } = useMarsMission();

  const categories = [
    { id: 'all', label: 'All Landmarks' },
    { id: 'rover', label: 'Rovers' },
    { id: 'volcano', label: 'Volcanoes' },
    { id: 'canyon', label: 'Canyons' },
    { id: 'ice_reserve', label: 'Water Ice' },
    { id: 'crater', label: 'Basins/Craters' },
    { id: 'habitat', label: 'Survival Outposts' }
  ];

  return (
    <div className="mars-map-controls-panel">
      {/* Top Bar: View Mode Toggle & Search */}
      <div className="controls-top-row">
        {/* 2D / 3D Toggle */}
        <div className="view-mode-toggle-group">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === '2D' ? 'active' : ''}`}
            onClick={() => setViewMode('2D')}
            title="Switch to 2D Equirectangular Surface Map"
          >
            <Map className="w-4 h-4 mr-1.5" />
            2D Surface Map
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === '3D' ? 'active' : ''}`}
            onClick={() => setViewMode('3D')}
            title="Switch to 3D Photorealistic Orbital Globe"
          >
            <Globe className="w-4 h-4 mr-1.5" />
            3D Globe
          </button>
        </div>

        {/* Search Input */}
        <div className="map-search-wrapper">
          <Search className="search-icon w-4 h-4 text-cyan-400" />
          <input
            type="text"
            className="map-search-input"
            placeholder="Search Jezero, Olympus Mons, rovers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {/* Drop Waypoint Action */}
        <button
          type="button"
          className="drop-beacon-btn"
          onClick={onOpenCustomModal}
          title="Place a custom survival waypoint beacon with custom coordinates"
        >
          <Compass className="w-4 h-4 mr-1.5" />
          Drop Survival Beacon
        </button>
      </div>

      {/* Middle Row: Optical Imagery Layers */}
      <div className="layer-selector-row">
        <div className="layer-title-badge">
          <Layers className="w-3.5 h-3.5 mr-1 text-cyan-400" />
          <span>Optical Layers:</span>
        </div>
        <div className="layer-chips-group">
          {mapLayers.map((layer) => {
            const isActive = activeLayer.id === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                className={`layer-chip-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveLayer(layer)}
                title={layer.description}
              >
                <span
                  className="layer-preview-dot"
                  style={{ background: layer.bgGradient }}
                />
                <span className="layer-chip-name">{layer.name}</span>
                {isActive && <span className="layer-active-indicator" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Overlays & Category Filters */}
      <div className="controls-bottom-row">
        {/* Category Pills */}
        <div className="category-filters-group">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-filter-pill ${filterCategory === cat.id ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* HUD Overlay Toggles */}
        <div className="hud-toggles-group">
          <button
            type="button"
            className={`toggle-option-btn ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Martian Latitude & Longitude Coordinate Grid"
          >
            <Grid className="w-3.5 h-3.5 mr-1" />
            Grid
          </button>
          <button
            type="button"
            className={`toggle-option-btn ${showLabels ? 'active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle Landmark Name Labels"
          >
            <Tag className="w-3.5 h-3.5 mr-1" />
            Labels
          </button>
          <button
            type="button"
            className={`toggle-option-btn ${showIceOverlay ? 'active' : ''}`}
            onClick={() => setShowIceOverlay(!showIceOverlay)}
            title="Toggle Subsurface Water Ice Reserves Overlay (SHARAD Radar)"
          >
            <Droplets className="w-3.5 h-3.5 mr-1" />
            Water Ice
          </button>
        </div>
      </div>
    </div>
  );
}
