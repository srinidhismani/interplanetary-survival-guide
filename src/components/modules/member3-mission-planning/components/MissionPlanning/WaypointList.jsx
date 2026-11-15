import React from 'react';
import styles from '../../styles/missionPlanning.module.css';

/**
 * Reusable waypoint sequence display for mission planning routes.
 */
export default function WaypointList({ waypoints = [] }) {
  if (!waypoints.length) return null;

  return (
    <div className={styles.waypointsContainer}>
      <h3 style={{ fontSize: '0.95rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Traverse Waypoints & Mission Objectives
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {waypoints.map((wp) => (
          <div key={wp.step} className={styles.waypointItem}>
            <div className={styles.stepNumber}>{wp.step}</div>
            <div className={styles.waypointContent}>
              <div className={styles.waypointTitle}>{wp.name}</div>
              <div className={styles.waypointMeta}>
                <span>📍 {wp.lat}, {wp.lon}</span>
                <span>▲ {wp.elevation}</span>
              </div>
              <div className={styles.waypointObjective}>
                🎯 <strong>Objective:</strong> {wp.objective}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
