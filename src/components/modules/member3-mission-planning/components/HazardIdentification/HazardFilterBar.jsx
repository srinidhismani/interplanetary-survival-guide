import React from 'react';
import styles from '../../styles/hazardIdentification.module.css';

/**
 * Filter bar allowing multi-dimensional filtering by:
 * - Severity Level (High, Medium, Low)
 * - Hazard Type (Rocky Obstacles, Steep Slopes, Uneven Terrain, Craters, Atmospheric)
 * - Observation Source (Observed vs Estimated)
 */
export default function HazardFilterBar({
  severityFilter,
  onChangeSeverity,
  typeFilter,
  onChangeType,
  sourceFilter,
  onChangeSource,
  hazardTypes = [],
  totalCount = 0,
  filteredCount = 0
}) {
  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterRow}>
        {/* Severity Filters */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>Severity Level:</span>
          <div className={styles.buttonGroup}>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`${styles.filterButton} ${severityFilter === lvl ? styles.filterButtonActive : ''}`}
                onClick={() => onChangeSeverity(lvl)}
              >
                {lvl === 'ALL' ? 'All Risks' : lvl === 'HIGH' ? '🔴 High Risk' : lvl === 'MEDIUM' ? '🟡 Medium' : '🟢 Low'}
              </button>
            ))}
          </div>
        </div>

        {/* Observation Source Filters */}
        <div className={styles.filterGroup}>
          <span className={styles.filterGroupLabel}>Data Source:</span>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.filterButton} ${sourceFilter === 'ALL' ? styles.filterButtonActive : ''}`}
              onClick={() => onChangeSource('ALL')}
            >
              All Sources
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${sourceFilter === 'OBSERVED' ? styles.filterButtonActive : ''}`}
              onClick={() => onChangeSource('OBSERVED')}
            >
              🛰️ Observed Only
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${sourceFilter === 'ESTIMATED' ? styles.filterButtonActive : ''}`}
              onClick={() => onChangeSource('ESTIMATED')}
            >
              🧪 Estimated Risks
            </button>
          </div>
        </div>
      </div>

      {/* Hazard Type Filters */}
      <div className={styles.filterTypeRow}>
        <span className={styles.filterGroupLabel}>Hazard Type:</span>
        <div className={styles.typePillGroup}>
          <button
            type="button"
            className={`${styles.typePill} ${typeFilter === 'ALL' ? styles.typePillActive : ''}`}
            onClick={() => onChangeType('ALL')}
          >
            All Types ({totalCount})
          </button>
          {hazardTypes.map((t) => (
            <button
              key={t}
              type="button"
              className={`${styles.typePill} ${typeFilter === t ? styles.typePillActive : ''}`}
              onClick={() => onChangeType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterCountIndicator}>
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> identified hazards based on active criteria.
      </div>
    </div>
  );
}
