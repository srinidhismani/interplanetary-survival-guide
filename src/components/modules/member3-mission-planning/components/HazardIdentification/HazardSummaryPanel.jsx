import React from 'react';
import styles from '../../styles/hazardIdentification.module.css';

/**
 * Reusable Hazard Summary Panel
 * Displays counts of:
 * - Total identified hazards
 * - Severity breakdown (High, Medium, Low)
 * - Observation source breakdown (Observed Hazards vs Estimated Risks)
 */
export default function HazardSummaryPanel({ hazards = [], activeCount = 0 }) {
  const total = hazards.length;
  const highCount = hazards.filter(h => h.severity?.toUpperCase() === 'HIGH').length;
  const mediumCount = hazards.filter(h => h.severity?.toUpperCase() === 'MEDIUM' || h.severity?.toUpperCase() === 'MODERATE').length;
  const lowCount = hazards.filter(h => h.severity?.toUpperCase() === 'LOW').length;

  const observedCount = hazards.filter(h => h.observationType === 'OBSERVED').length;
  const estimatedCount = hazards.filter(h => h.observationType === 'ESTIMATED').length;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryTopRow}>
        <div className={styles.summaryTitleBlock}>
          <div className={styles.summaryIconDot} />
          <div>
            <h3 className={styles.summaryTitle}>Martian Hazard Registry Summary</h3>
            <span className={styles.summarySub}>
              Active Surface & Atmospheric Reconnaissance Tracking
            </span>
          </div>
        </div>

        <div className={styles.simulatedDataFlag}>
          [SIMULATED DATASET]
        </div>
      </div>

      <div className={styles.statsCountersGrid}>
        {/* Total Hazards */}
        <div className={styles.statCounterCard}>
          <span className={styles.statLabel}>Total Hazards Logged</span>
          <span className={styles.statValueLarge}>{total}</span>
          <span className={styles.statSubtext}>{activeCount} Matching Filters</span>
        </div>

        {/* High Severity */}
        <div className={`${styles.statCounterCard} ${styles.statCardHigh}`}>
          <span className={styles.statLabel}>High Estimated Risk</span>
          <span className={styles.statValueLarge} style={{ color: '#ef4444' }}>{highCount}</span>
          <span className={styles.statSubtext}>Immediate Hazard / Exclusion</span>
        </div>

        {/* Medium Severity */}
        <div className={`${styles.statCounterCard} ${styles.statCardMedium}`}>
          <span className={styles.statLabel}>Medium Risk</span>
          <span className={styles.statValueLarge} style={{ color: '#f59e0b' }}>{mediumCount}</span>
          <span className={styles.statSubtext}>Caution / Reduced Speed</span>
        </div>

        {/* Low Severity */}
        <div className={`${styles.statCounterCard} ${styles.statCardLow}`}>
          <span className={styles.statLabel}>Low Risk</span>
          <span className={styles.statValueLarge} style={{ color: '#10b981' }}>{lowCount}</span>
          <span className={styles.statSubtext}>Monitored Obstacles</span>
        </div>

        {/* Observed Hazards */}
        <div className={`${styles.statCounterCard} ${styles.statCardObserved}`}>
          <span className={styles.statLabel}>Observed Hazards</span>
          <span className={styles.statValueLarge} style={{ color: '#38bdf8' }}>{observedCount}</span>
          <span className={styles.statSubtext}>Supported by MRO / Rover</span>
        </div>

        {/* Estimated Risks */}
        <div className={`${styles.statCounterCard} ${styles.statCardEstimated}`}>
          <span className={styles.statLabel}>Estimated Risks</span>
          <span className={styles.statValueLarge} style={{ color: '#c084fc' }}>{estimatedCount}</span>
          <span className={styles.statSubtext}>Simulated Model Projections</span>
        </div>
      </div>
    </div>
  );
}
