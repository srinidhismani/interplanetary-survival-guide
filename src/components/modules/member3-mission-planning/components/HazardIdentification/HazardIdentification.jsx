import React, { useState } from 'react';
import styles from '../../styles/hazardIdentification.module.css';
import InteractiveTerrainMap from '../TerrainAnalysis/InteractiveTerrainMap';
import HazardSummaryPanel from './HazardSummaryPanel';
import HazardFilterBar from './HazardFilterBar';
import HazardDetailCard from './HazardDetailCard';
import { SIMULATED_HAZARDS, SIMULATED_REGIONS } from '../../data/simulatedMarsData';

/**
 * Responsibility 2: Hazard Identification Dashboard
 * 
 * Features:
 * - Summary panel showing total identified hazards and breakdowns
 * - Multi-criteria filtering by Severity (Low, Medium, High), Hazard Type, and Observation Source
 * - Clear distinction between Observed Hazards (verified by MRO/Curiosity) and Estimated Risks (simulated models)
 * - Reuses existing Interactive Mars Terrain Map with rocky obstacles, steep slopes, uneven terrain, and crater challenges
 * - Interactive hazard markers with risk color-coding (Green, Amber, Red)
 * - Right-side detailed hazard inspection panel updating on marker click
 * - Strict astronaut safety disclaimers (experimental reconnaissance only)
 */
export default function HazardIdentification({
  hazards = SIMULATED_HAZARDS,
  regions = SIMULATED_REGIONS
}) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedHazardId, setSelectedHazardId] = useState(hazards[0]?.id || 'haz-101');
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0]?.id || 'reg-01');

  // Extract unique hazard types
  const allTypes = Array.from(new Set(hazards.map(h => h.type || h.category))).filter(Boolean);

  // Apply multi-criteria filtering
  const filteredHazards = hazards.filter((h) => {
    // Severity Filter
    if (severityFilter !== 'ALL') {
      const sev = (h.severity || '').toUpperCase();
      if (severityFilter === 'HIGH' && (sev !== 'HIGH' && sev !== 'CRITICAL')) return false;
      if (severityFilter === 'MEDIUM' && (sev !== 'MEDIUM' && sev !== 'MODERATE')) return false;
      if (severityFilter === 'LOW' && sev !== 'LOW') return false;
    }

    // Type Filter
    if (typeFilter !== 'ALL') {
      const hType = h.type || h.category;
      if (hType !== typeFilter) return false;
    }

    // Source Filter (Observed vs Estimated)
    if (sourceFilter !== 'ALL') {
      if (h.observationType !== sourceFilter) return false;
    }

    return true;
  });

  // Selected hazard object
  const currentHazard = hazards.find(h => h.id === selectedHazardId) || filteredHazards[0] || hazards[0];

  // Handle clicking a marker on the map or an item in the list
  const handleSelectHazard = (hazardId) => {
    setSelectedHazardId(hazardId);
    const targetHazard = hazards.find(h => h.id === hazardId);
    if (targetHazard && targetHazard.regionId) {
      setSelectedRegionId(targetHazard.regionId);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* =====================================================================
          TOP HAZARDS STATUS BAR
         ===================================================================== */}
      <div className={styles.hazardStatusBar}>
        <div className={styles.statusIdentityGroup}>
          <div className={styles.dangerIconPulse}>
            <span className={styles.pulseRadarDot} />
            <span className={styles.dangerIcon}>⚠️</span>
          </div>
          <div>
            <div className={styles.statusTitle}>
              MARTIAN HAZARD IDENTIFICATION & OBSTACLE MONITOR
            </div>
            <div className={styles.statusSub}>
              Orbital Threat Assessment • Planetary Surface Impediments • Sol 412
            </div>
          </div>
        </div>

        <div className={styles.statusReadoutsGroup}>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>FILTERED HAZARDS</span>
            <span className={styles.chipVal} style={{ color: '#ef4444' }}>
              {filteredHazards.length} of {hazards.length} Active
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>OBSERVED CONFIRMED</span>
            <span className={styles.chipVal} style={{ color: '#38bdf8' }}>
              {hazards.filter(h => h.observationType === 'OBSERVED').length} Verified
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>SIMULATED RISKS</span>
            <span className={styles.chipVal} style={{ color: '#c084fc' }}>
              {hazards.filter(h => h.observationType === 'ESTIMATED').length} Projected
            </span>
          </div>
          <span className={styles.simulatedLivePill}>SIMULATED DATASET</span>
        </div>
      </div>

      {/* =====================================================================
          HAZARD SUMMARY PANEL
         ===================================================================== */}
      <HazardSummaryPanel 
        hazards={hazards} 
        activeCount={filteredHazards.length} 
      />

      {/* =====================================================================
          MULTI-CRITERIA FILTER BAR
         ===================================================================== */}
      <HazardFilterBar
        severityFilter={severityFilter}
        onChangeSeverity={(sev) => setSeverityFilter(sev)}
        typeFilter={typeFilter}
        onChangeType={(t) => setTypeFilter(t)}
        sourceFilter={sourceFilter}
        onChangeSource={(src) => setSourceFilter(src)}
        hazardTypes={allTypes}
        totalCount={hazards.length}
        filteredCount={filteredHazards.length}
      />

      {/* =====================================================================
          2-COLUMN WORKSPACE: MAP (LEFT) + HAZARD DETAIL PANEL (RIGHT)
         ===================================================================== */}
      <div className={styles.workspaceGrid}>
        {/* Left Column: Reuses InteractiveTerrainMap */}
        <div className={styles.mapWorkspaceCol}>
          <div className={styles.mapWrapperBox}>
            <div className={styles.mapNoticeBar}>
              <span>🗺️ Interactive Surface Obstacle & Hazard Map</span>
              <span className={styles.mapNoticeSub}>
                Markers: 🔴 High Risk | 🟡 Medium Risk | 🟢 Low Risk • Solid: 🛰️ Observed | Dashed: 🧪 Estimated
              </span>
            </div>

            <InteractiveTerrainMap
              regions={regions}
              hazards={filteredHazards}
              selectedRegionId={selectedRegionId}
              onSelectRegion={(id) => setSelectedRegionId(id)}
              selectedHazardId={selectedHazardId}
              onSelectHazard={handleSelectHazard}
              mapMode="roughness" // Emphasizes rocky obstacles and uneven terrain
              highlightSlopeType="all"
              layers={{ elevation: true, roughness: true, hazards: true, grid: true }}
            />
          </div>

          {/* Quick List of Filtered Hazards below map */}
          <div className={styles.listSectionBox}>
            <div className={styles.listSectionHeader}>
              <span className={styles.listSectionTitle}>
                Filtered Hazard Registry ({filteredHazards.length})
              </span>
              <span className={styles.listClickHint}>Click any card to focus on map</span>
            </div>

            <div className={styles.compactHazardGrid}>
              {filteredHazards.map((haz) => {
                const isSelected = haz.id === selectedHazardId;
                const isObs = haz.observationType === 'OBSERVED';
                const sev = (haz.severity || 'MEDIUM').toUpperCase();

                let sevColor = '#f59e0b';
                if (sev === 'HIGH' || sev === 'CRITICAL') sevColor = '#ef4444';
                else if (sev === 'LOW') sevColor = '#10b981';

                return (
                  <div
                    key={haz.id}
                    className={`${styles.compactHazardCard} ${isSelected ? styles.compactHazardCardActive : ''}`}
                    onClick={() => handleSelectHazard(haz.id)}
                  >
                    <div className={styles.compactTopRow}>
                      <span className={styles.compactTitle}>
                        {haz.icon || '⚠️'} {haz.title}
                      </span>
                      <span className={styles.compactSevBadge} style={{ color: sevColor, borderColor: sevColor }}>
                        {haz.severity}
                      </span>
                    </div>

                    <div className={styles.compactMetaRow}>
                      <span>{haz.type}</span>
                      <span style={{ color: isObs ? '#38bdf8' : '#c084fc' }}>
                        {isObs ? '🛰️ Observed' : '🧪 Estimated'}
                      </span>
                      <span>📍 {haz.coordinates}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Information Panel */}
        <div className={styles.infoPanelCol}>
          <HazardDetailCard hazard={currentHazard} />
        </div>
      </div>
    </div>
  );
}
