import React, { useState } from 'react';
import styles from '../../styles/missionDashboard.module.css';
import { SIMULATED_HAZARDS } from '../../data/simulatedMarsData';

/**
 * Hazards Overview Card
 * Displays:
 * - Identified rocky obstacles
 * - Steep slopes and uneven terrain
 * - Hazard type and severity (HIGH, MEDIUM, LOW)
 * - Clear distinction: 🛰️ Observed Hazards vs 🧪 Estimated Risks
 * - Interactive filter by type and risk provenance
 */
export default function HazardsOverviewCard({
  hazards = SIMULATED_HAZARDS,
  onNavigateTab
}) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Rocky Obstacle' | 'Steep Slope' | 'Uneven Terrain'
  const [obsFilter, setObsFilter] = useState('ALL'); // 'ALL' | 'OBSERVED' | 'ESTIMATED'

  // Counts by category
  const rockyCount = hazards.filter(h => h.type.toLowerCase().includes('rock')).length;
  const slopeCount = hazards.filter(h => h.type.toLowerCase().includes('slope')).length;
  const unevenCount = hazards.filter(h => h.type.toLowerCase().includes('uneven') || h.type.toLowerCase().includes('crater')).length;
  const observedCount = hazards.filter(h => h.observationType === 'OBSERVED').length;
  const estimatedCount = hazards.filter(h => h.observationType === 'ESTIMATED').length;

  const filteredHazards = hazards.filter(h => {
    if (filterType !== 'ALL') {
      if (filterType === 'Rocky' && !h.type.toLowerCase().includes('rock')) return false;
      if (filterType === 'Slope' && !h.type.toLowerCase().includes('slope')) return false;
      if (filterType === 'Uneven' && !h.type.toLowerCase().includes('uneven') && !h.type.toLowerCase().includes('crater')) return false;
    }
    if (obsFilter !== 'ALL' && h.observationType !== obsFilter) return false;
    return true;
  });

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.cardSectionBadge}>SURFACE HAZARDS & RISK PROFILES</span>
          <h3 className={styles.cardTitle}>Potential Terrain Hazards</h3>
        </div>
        {onNavigateTab && (
          <button
            type="button"
            className={styles.secondaryActionBtn}
            onClick={() => onNavigateTab('hazards')}
          >
            Hazard Inspection ↗
          </button>
        )}
      </div>

      {/* Summary KPI Pills */}
      <div className={styles.hazardStatPillsRow}>
        <div className={styles.hazardStatPill}>
          <span className={styles.hazardStatNum} style={{ color: '#ef4444' }}>{hazards.length}</span>
          <span className={styles.hazardStatLabel}>Total Identified</span>
        </div>
        <div className={styles.hazardStatPill}>
          <span className={styles.hazardStatNum} style={{ color: '#f97316' }}>{rockyCount}</span>
          <span className={styles.hazardStatLabel}>🪨 Rocky Blocks</span>
        </div>
        <div className={styles.hazardStatPill}>
          <span className={styles.hazardStatNum} style={{ color: '#eab308' }}>{slopeCount}</span>
          <span className={styles.hazardStatLabel}>📐 Steep Slopes</span>
        </div>
        <div className={styles.hazardStatPill}>
          <span className={styles.hazardStatNum} style={{ color: '#38bdf8' }}>{unevenCount}</span>
          <span className={styles.hazardStatLabel}>🏖️ Uneven Terrain</span>
        </div>
      </div>

      {/* Filter and Provenance Selection Bar */}
      <div className={styles.hazardFilterControls}>
        <div className={styles.filterButtonGroup}>
          <span className={styles.filterBarLabel}>Type:</span>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${filterType === 'ALL' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setFilterType('ALL')}
          >
            All
          </button>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${filterType === 'Rocky' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setFilterType('Rocky')}
          >
            Rocky Obstacles
          </button>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${filterType === 'Slope' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setFilterType('Slope')}
          >
            Steep Slopes
          </button>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${filterType === 'Uneven' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setFilterType('Uneven')}
          >
            Uneven / Dunes
          </button>
        </div>

        <div className={styles.filterButtonGroup}>
          <span className={styles.filterBarLabel}>Provenance:</span>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${obsFilter === 'ALL' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setFilterFilter('ALL', setObsFilter)}
          >
            All ({hazards.length})
          </button>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${obsFilter === 'OBSERVED' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setObsFilter('OBSERVED')}
            title="Supported by actual orbiter imaging"
          >
            🛰️ Observed ({observedCount})
          </button>
          <button
            type="button"
            className={`${styles.miniFilterBtn} ${obsFilter === 'ESTIMATED' ? styles.miniFilterBtnActive : ''}`}
            onClick={() => setObsFilter('ESTIMATED')}
            title="Derived from simulated terrain calculations"
          >
            🧪 Estimated ({estimatedCount})
          </button>
        </div>
      </div>

      {/* Distinction Explanation Banner */}
      <div className={styles.provenanceLegendBox}>
        <div className={styles.provenanceLegendItem}>
          <span className={styles.observedBadge}>🛰️ OBSERVED HAZARD</span>
          <span className={styles.legendText}>Confirmed by actual orbital photography (MRO HiRISE/CTX).</span>
        </div>
        <div className={styles.provenanceLegendItem}>
          <span className={styles.estimatedBadge}>🧪 ESTIMATED RISK</span>
          <span className={styles.legendText}>Derived from simulated slope gradients and roughness models.</span>
        </div>
      </div>

      {/* Hazard Cards Scrollable List */}
      <div className={styles.hazardsListContainer}>
        {filteredHazards.map((h) => {
          const isHigh = h.severity === 'HIGH';
          const isMed = h.severity === 'MEDIUM';
          const sevColor = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';
          const isObserved = h.observationType === 'OBSERVED';

          return (
            <div key={h.id} className={styles.hazardEntryCard}>
              <div className={styles.hazardEntryHeader}>
                <div className={styles.hazardTitleBlock}>
                  <span className={styles.hazardTypeIcon}>{h.icon || '⚠️'}</span>
                  <div>
                    <strong className={styles.hazardTitleText}>{h.title}</strong>
                    <div className={styles.hazardSubRow}>
                      <span className={styles.hazardTypeText}>{h.type}</span>
                      <span className={styles.hazardCoordText}>📍 {h.coordinates}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.hazardBadgesStack}>
                  <span
                    className={styles.severityBadge}
                    style={{
                      color: sevColor,
                      borderColor: sevColor,
                      backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    {h.severity} SEVERITY
                  </span>
                  {isObserved ? (
                    <span className={styles.observedPill} title={h.sourceDetails}>
                      🛰️ Observed
                    </span>
                  ) : (
                    <span className={styles.estimatedPill} title={h.sourceDetails}>
                      🧪 Estimated Risk
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.hazardDescText}>{h.description}</p>

              <div className={styles.hazardFootnote}>
                <strong>Traverse Impact:</strong> {h.slopeImpact}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to keep updater clean
function setFilterFilter(val, setter) {
  setter(val);
}
