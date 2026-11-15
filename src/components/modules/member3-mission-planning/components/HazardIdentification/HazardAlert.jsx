import React from 'react';
import styles from '../../styles/hazardIdentification.module.css';
import Badge from '../common/Badge';

/**
 * Reusable component for displaying an individual hazard record.
 */
export default function HazardAlert({ hazard }) {
  if (!hazard) return null;

  const severity = hazard.severity.toUpperCase();
  let cardClass = styles.hazardCardLow;
  if (severity === 'MODERATE') cardClass = styles.hazardCardModerate;
  else if (severity === 'HIGH') cardClass = styles.hazardCardHigh;
  else if (severity === 'CRITICAL') cardClass = styles.hazardCardCritical;

  return (
    <div className={`${styles.hazardCard} ${cardClass}`}>
      <div className={styles.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={styles.title}>{hazard.title}</span>
          <span className={styles.categoryTag}>{hazard.category}</span>
        </div>
        <Badge level={hazard.severity} />
      </div>

      <div className={styles.detailsGrid}>
        <div><strong>Coordinates:</strong> {hazard.location}</div>
        <div><strong>Detection Status:</strong> {hazard.status}</div>
        <div><strong>Hazard Radius:</strong> ~{hazard.radiusMeters} m</div>
      </div>

      <div className={styles.mitigationBox}>
        <strong style={{ color: '#38bdf8' }}>Action Protocol: </strong>
        {hazard.mitigation}
      </div>
    </div>
  );
}
