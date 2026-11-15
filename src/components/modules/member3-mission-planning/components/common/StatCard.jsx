import React from 'react';
import styles from '../../styles/common.module.css';

/**
 * Reusable StatCard for displaying planetary metrics, slope angle, traverse distance, etc.
 */
export default function StatCard({ label, value, subtext }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      {subtext && <span className={styles.statSubtext}>{subtext}</span>}
    </div>
  );
}
