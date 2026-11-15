import React, { useState } from 'react';
import styles from '../../styles/scientificPois.module.css';
import InteractiveTerrainMap from '../TerrainAnalysis/InteractiveTerrainMap';
import PoiDetailCard from './PoiDetailCard';
import PoiFilterBar from './PoiFilterBar';
import { SCIENTIFIC_POIS, SIMULATED_REGIONS, SIMULATED_HAZARDS } from '../../data/simulatedMarsData';

/**
 * Responsibility: Scientific Points of Interest Dashboard (Member 3)
 * 
 * Features:
 * - Interactive scientific landmarks plotted on the existing Mars terrain map
 * - Olympus Mons, Valles Marineris, Jezero Crater, Gale Crater, Hellas Planitia, Utopia Planitia
 * - Display of verified Mars coordinates, IAU designations, and physical relief
 * - In-depth scientific descriptions & geological characteristics
 * - Clear distinction between verified scientific data and sample reconnaissance metrics
 * - Filtering by geological category
 * - "Set as Mission Destination" integration with Mission Planning
 */
export default function ScientificPOIs({
  pois = SCIENTIFIC_POIS,
  regions = SIMULATED_REGIONS,
  hazards = SIMULATED_HAZARDS,
  onSelectDestination
}) {
  const [selectedPoiId, setSelectedPoiId] = useState(pois[0]?.id || 'poi-olympus');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Extract unique categories
  const categories = Array.from(new Set(pois.map(p => p.category))).filter(Boolean);

  // Filter POIs by category
  const filteredPois = pois.filter(p => {
    if (categoryFilter === 'ALL') return true;
    return p.category === categoryFilter;
  });

  const currentPoi = pois.find(p => p.id === selectedPoiId) || filteredPois[0] || pois[0];

  const handleSelectPoi = (poiId) => {
    setSelectedPoiId(poiId);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* =====================================================================
          TOP SCIENTIFIC STATUS BAR
         ===================================================================== */}
      <div className={styles.statusBar}>
        <div className={styles.statusIdentityGroup}>
          <div className={styles.scienceIconPulse}>
            <span className={styles.pulseRadarDot} />
            <span className={styles.scienceIcon}>🔬</span>
          </div>
          <div>
            <div className={styles.statusTitle}>
              MARTIAN SCIENTIFIC POINTS OF INTEREST & GEOLOGICAL SURVEY
            </div>
            <div className={styles.statusSub}>
              Orbital Instrument Atlas • USGS Planetary Gazetteer Aligned • Sol 412
            </div>
          </div>
        </div>

        <div className={styles.statusReadoutsGroup}>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>CATALOGED SITES</span>
            <span className={styles.chipVal} style={{ color: '#38bdf8' }}>
              {pois.length} Locations
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>ACTIVE CATEGORY</span>
            <span className={styles.chipVal} style={{ color: '#f59e0b' }}>
              {categoryFilter === 'ALL' ? 'ALL SITES' : categoryFilter.toUpperCase()}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>SELECTED SITE</span>
            <span className={styles.chipVal} style={{ color: '#10b981' }}>
              {currentPoi ? currentPoi.name : 'None'}
            </span>
          </div>
          <span className={styles.verifiedLivePill}>VERIFIED GEOLOGY</span>
        </div>
      </div>

      {/* =====================================================================
          GEOLOGICAL CATEGORY FILTER BAR
         ===================================================================== */}
      <PoiFilterBar
        categoryFilter={categoryFilter}
        onChangeCategory={(cat) => setCategoryFilter(cat)}
        categories={categories}
        totalCount={pois.length}
        filteredCount={filteredPois.length}
      />

      {/* =====================================================================
          2-COLUMN WORKSPACE: MAP (LEFT) + SCIENTIFIC INFORMATION PANEL (RIGHT)
         ===================================================================== */}
      <div className={styles.workspaceGrid}>
        {/* Left Column: Reuses InteractiveTerrainMap */}
        <div className={styles.mapWorkspaceCol}>
          <div className={styles.mapWrapperBox}>
            <div className={styles.mapNoticeBar}>
              <span>🗺️ Interactive Mars Surface Geology Map</span>
              <span className={styles.mapNoticeSub}>
                Markers: 🔬 Scientific Points of Interest • Click any landmark to view verified geology
              </span>
            </div>

            <InteractiveTerrainMap
              regions={regions}
              hazards={hazards}
              pois={filteredPois}
              selectedPoiId={selectedPoiId}
              onSelectPoi={handleSelectPoi}
              selectedRegionId={regions[0]?.id}
              mapMode="elevation"
              layers={{ elevation: true, roughness: false, hazards: false, grid: true, poi: true }}
            />
          </div>

          {/* Quick Browser List of Scientific Sites below the map */}
          <div className={styles.listSectionBox}>
            <div className={styles.listSectionHeader}>
              <span className={styles.listSectionTitle}>
                Martian Scientific Sites Directory ({filteredPois.length})
              </span>
              <span className={styles.listClickHint}>Click any location to focus on map</span>
            </div>

            <div className={styles.compactPoisGrid}>
              {filteredPois.map((p) => {
                const isSelected = p.id === selectedPoiId;
                return (
                  <div
                    key={p.id}
                    className={`${styles.compactPoiCard} ${isSelected ? styles.compactPoiCardActive : ''}`}
                    onClick={() => handleSelectPoi(p.id)}
                  >
                    <div className={styles.compactTopRow}>
                      <span className={styles.compactTitle}>
                        {p.icon} {p.name}
                      </span>
                      <span className={styles.compactElevBadge}>
                        {p.elevation}
                      </span>
                    </div>

                    <div className={styles.compactMetaRow}>
                      <span className={styles.compactCat}>{p.category}</span>
                      <span className={styles.compactCoord}>📍 {p.coordinates}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Scientific Information Panel */}
        <div className={styles.infoPanelCol}>
          <PoiDetailCard
            poi={currentPoi}
            onSelectAsDestination={onSelectDestination}
          />
        </div>
      </div>
    </div>
  );
}
