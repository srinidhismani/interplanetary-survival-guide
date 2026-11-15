import React from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Reusable Slope Analysis Gauge
 * Visualizes ground incline degrees, slope stability classifications, and slip margins.
 */
export default function SlopeGauge({ region }) {
  if (!region) return null;

  const angle = region.slopeAngleNum || 4.0;
  const maxAngle = region.maxSlopeAngle || '15°';
  const distribution = region.slopeDistribution || { gentle: 60, moderate: 30, severe: 10 };

  // Angle color thresholding
  let slopeColor = '#10b981'; // gentle green
  let statusText = 'Low Incline — Nominal Wheel Grip';
  if (angle > 12) {
    slopeColor = '#ef4444'; // critical red
    statusText = 'Severe Incline — High Slip Risk';
  } else if (angle > 6) {
    slopeColor = '#f59e0b'; // caution orange
    statusText = 'Moderate Incline — Require Creep Gear';
  }

  // Semi-circular gauge math (180 degrees sweep)
  // Max scale is 30 degrees for visualization
  const angleClamped = Math.min(Math.max(angle, 0), 30);
  const gaugePercent = angleClamped / 30;
  const needleRotation = -90 + gaugePercent * 180;

  return (
    <div className={styles.slopeSection}>
      <div className={styles.sectionHeaderRow}>
        <span className={styles.sectionSubhead}>Slope & Incline Stability Analysis</span>
        <span className={styles.simulatedTag}>SIMULATED SLOPE</span>
      </div>

      <div className={styles.slopeVisualContainer}>
        {/* SVG Semi-Circle Dial */}
        <div className={styles.gaugeDialBox}>
          <svg viewBox="0 0 160 95" className={styles.gaugeSvg}>
            {/* Background Arc */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Colored Zones: Gentle (<6 deg = 0-20%), Moderate (6-12 deg = 20-40%), Severe (>12 deg = 40-100%) */}
            <path
              d="M 20 80 A 60 60 0 0 1 56 38"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeOpacity="0.4"
            />
            <path
              d="M 56 38 A 60 60 0 0 1 104 38"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeOpacity="0.4"
            />
            <path
              d="M 104 38 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
              strokeOpacity="0.4"
            />

            {/* Needle */}
            <g transform={`translate(80, 80) rotate(${needleRotation})`}>
              <line x1="0" y1="0" x2="0" y2="-52" stroke={slopeColor} strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="0" r="5" fill="#f8fafc" />
            </g>

            {/* Arc Limits */}
            <text x="18" y="93" className={styles.gaugeMarkText}>0°</text>
            <text x="76" y="22" className={styles.gaugeMarkText}>15°</text>
            <text x="135" y="93" className={styles.gaugeMarkText}>30°+</text>
          </svg>
        </div>

        {/* Readout stats */}
        <div className={styles.slopeReadoutBox}>
          <div className={styles.angleBigDisplay} style={{ color: slopeColor }}>
            {region.slopeAngle}
            <span className={styles.angleLabel}>Avg Incline</span>
          </div>
          <div className={styles.slopeStatusBadge} style={{ borderColor: slopeColor, color: slopeColor }}>
            {statusText}
          </div>
          <div className={styles.slopeMaxNote}>
            Peak local gradient: <strong>{maxAngle}</strong>
          </div>
        </div>
      </div>

      {/* Grade distribution bar */}
      <div className={styles.gradeDistContainer}>
        <div className={styles.gradeDistLabels}>
          <span>Gentle (&lt;5°): {distribution.gentle}%</span>
          <span>Moderate (5-15°): {distribution.moderate}%</span>
          <span>Severe (&gt;15°): {distribution.severe}%</span>
        </div>
        <div className={styles.gradeDistBar}>
          <div style={{ width: `${distribution.gentle}%`, backgroundColor: '#10b981' }} title="Gentle" />
          <div style={{ width: `${distribution.moderate}%`, backgroundColor: '#f59e0b' }} title="Moderate" />
          <div style={{ width: `${distribution.severe}%`, backgroundColor: '#ef4444' }} title="Severe" />
        </div>
      </div>
    </div>
  );
}
