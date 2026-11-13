// Location Catalog Drawer Component
// Searchable landmark directory with category tabs and quick fly-to links

import React, { useState } from 'react';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import { CATEGORY_ICONS } from '../data/marsLocations';
import { formatMarsCoords } from '../hooks/useMarsCoordinates';
import {
  ListFilter,
  Navigation,
  Trash2,
  Bookmark,
  Bot,
  Flame,
  Spline,
  Droplets,
  CircleDot,
  Home,
  Radio
} from 'lucide-react';

export default function LocationListDrawer({ isOpen, onClose }) {
  const {
    allLocations,
    customWaypoints,
    removeCustomWaypoint,
    selectedLocation,
    setSelectedLocation,
    flyTo,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory
  } = useMarsMission();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'custom'

  const categories = [
    { id: 'all', label: 'All', icon: ListFilter },
    { id: 'rover', label: 'Rovers', icon: Bot },
    { id: 'ice_reserve', label: 'Ice Sheets', icon: Droplets },
    { id: 'volcano', label: 'Volcanoes', icon: Flame },
    { id: 'canyon', label: 'Canyons', icon: Spline },
    { id: 'crater', label: 'Craters', icon: CircleDot },
    { id: 'habitat', label: 'Colonies', icon: Home }
  ];

  const filteredLocations = allLocations.filter((loc) => {
    if (activeTab === 'custom') return loc.isCustom;
    const matchesCat = filterCategory === 'all' || loc.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.mission && loc.mission.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    flyTo(loc);
  };

  if (!isOpen) return null;

  return (
    <div className="location-list-drawer-overlay">
      <div className="location-list-drawer">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-cyan-400" />
              <h3 className="drawer-title">Martian Landmark Directory</h3>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              title="Close Directory"
            >
              ×
            </button>
          </div>
          <p className="drawer-sub">
            Catalog of {allLocations.length} documented surface landmarks, landing zones, and survival beacons.
          </p>

          {/* Tab Selector: Standard Catalog vs Custom Waypoints */}
          <div className="drawer-tab-row">
            <button
              type="button"
              className={`drawer-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              NASA Geological Catalog ({allLocations.length - customWaypoints.length})
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              Custom Survival Beacons ({customWaypoints.length})
            </button>
          </div>

          {/* Category Icons Row (if on standard catalog) */}
          {activeTab === 'all' && (
            <div className="drawer-categories-scroll">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = filterCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`drawer-cat-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setFilterCategory(cat.id)}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer List Body */}
        <div className="drawer-list-body">
          {filteredLocations.length === 0 ? (
            <div className="drawer-empty-state">
              <p>No Martian landmarks match your filter or search query.</p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation && selectedLocation.id === loc.id;
              const formatted = formatMarsCoords(loc.lat, loc.lng);
              const iconCfg = CATEGORY_ICONS[loc.category] || CATEGORY_ICONS.rover;

              return (
                <div
                  key={loc.id}
                  className={`landmark-list-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectLocation(loc)}
                >
                  <div className="card-top-row">
                    <span
                      className="card-category-tag"
                      style={{ color: iconCfg.color, borderColor: `${iconCfg.color}44` }}
                    >
                      {loc.categoryLabel}
                    </span>
                    {loc.survivalViability && (
                      <span className="card-score-badge">
                        Viability: <strong>{loc.survivalViability.score}/100</strong>
                      </span>
                    )}
                  </div>

                  <h4 className="card-title">{loc.name}</h4>
                  <p className="card-mission">{loc.mission || 'Surface Geological Feature'}</p>

                  <div className="card-footer-metrics">
                    <span className="card-coord font-mono">
                      {formatted.lat >= 0 ? `${formatted.lat}°N` : `${Math.abs(formatted.lat)}°S`},{' '}
                      {formatted.lng >= 0 ? `${formatted.lng}°E` : `${Math.abs(formatted.lng)}°W`}
                    </span>
                    <span className="card-elevation font-mono">
                      {loc.elevation > 0 ? `+${(loc.elevation / 1000).toFixed(1)} km` : `${(loc.elevation / 1000).toFixed(1)} km`}
                    </span>
                  </div>

                  {loc.isCustom && (
                    <div className="custom-card-actions">
                      <button
                        type="button"
                        className="delete-waypoint-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomWaypoint(loc.id);
                        }}
                        title="Delete custom waypoint"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-400 inline" />
                        Delete Beacon
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
