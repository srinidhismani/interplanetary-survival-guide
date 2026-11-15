import React from 'react';
import styles from '../../styles/common.module.css';

/**
 * Reusable Badge component for risk levels, statuses, and tags.
 */
export default function Badge({ level = 'LOW', label }) {
  const normalized = level.toUpperCase();
  
  let badgeClass = styles.badgeLow;
  if (normalized === 'MODERATE') badgeClass = styles.badgeModerate;
  else if (normalized === 'HIGH') badgeClass = styles.badgeHigh;
  else if (normalized === 'CRITICAL') badgeClass = styles.badgeCritical;

  return (
    <span className={`${styles.badge} ${badgeClass}`}>
      ● {label || level}
    </span>
  );
}
