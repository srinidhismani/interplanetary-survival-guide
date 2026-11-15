import React, { useState } from 'react';
import styles from '../../styles/terrainAnalysis.module.css';
import SlopeGauge from './SlopeGauge';

/**
 * Converts slope degrees to grade percentage: Grade % = tan(deg * PI / 180) * 100
 */
export function degreesToGradePercent(degrees) {
  const rad = (degrees * Math.PI) / 180;
  return Math.round(Math.tan(rad) * 1000) / 10;
}

/**
 * Classifies slope incline into Flat, Moderate, or Steep
 */
export function classifySlope(degrees) {
  if (degrees < 5.0) {
    return {
      category: 'Flat / Level',
      code: 'flat',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.3)',
      traction: 'Optimal (Wheel Slip < 5%)',
      roverProtocol: 'Nominal cruise speed up to 4.5 km/h. Standard wheel drive.'
    };
  } else if (degrees <= 15.0) {
    return {
      category: 'Moderate Incline',
      code: 'moderate',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      traction: 'Caution (Wheel Slip 15% – 30%)',
      roverProtocol: 'Cap speed at 2.0 km/h. Differential locks engaged; monitor wheel motor torque.'
    };
  } else {
    return {
      category: 'Steep / Severe Slope',
      code: 'steep',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      traction: 'Hazardous (Wheel Slip > 60% / Rollover Risk)',
      roverProtocol: 'Autonomous speed cap 0.8 km/h. Zigzag switchback ascent only. Winch / tether recommended.'
    };
  }
}

/**
 * Dedicated Slope Analysis Component
 * Displays:
 * - Slope in degrees (°) and grade percentage (%)
 * - Incline classification (Flat, Moderate, Steep)
 * - Interactive Slope Gauge
 * - Grade distribution across sectors
 * - Rover mechanical traction advisory
 */
export default function SlopeAnalysisPanel({ region, onHighlightSlopeType }) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  if (!region) return null;

  const avgDeg = region.slopeAngleNum || 4.2;
  const maxDeg = parseFloat(region.maxSlopeAngle) || 16.5;

  const avgGradePercent = degreesToGradePercent(avgDeg);
  const maxGradePercent = degreesToGradePercent(maxDeg);

  const avgClassification = classifySlope(avgDeg);
  const maxClassification = classifySlope(maxDeg);

  const distribution = region.slopeDistribution || { gentle: 70, moderate: 22, severe: 8 };

  const handleFilterClick = (cat) => {
    const next = selectedCategoryFilter === cat ? 'all' : cat;
    setSelectedCategoryFilter(next);
    if (onHighlightSlopeType) {
      onHighlightSlopeType(next);
    }
  };

  return (
    <div className={styles.slopeAnalysisPanel}>
      <div className={styles.sectionHeaderRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={styles.sectionSubhead}>Slope & Incline Stability Analysis</span>
          <span className={styles.simulatedTag}>SIMULATED SLOPE TELEMETRY</span>
        </div>
      </div>

      {/* Slope Incline Gauge */}
      <SlopeGauge region={region} />

      {/* Slope Degree & Grade % Dual Readout Cards */}
      <div className={styles.slopeDualGrid}>
        <div className={styles.slopeMetricBox}>
          <div className={styles.slopeMetricHeader}>
            <span>Average Terrain Incline</span>
            <span 
              className={styles.slopeCategoryBadge}
              style={{ 
                color: avgClassification.color, 
                backgroundColor: avgClassification.bg,
                borderColor: avgClassification.border
              }}
            >
              ● {avgClassification.category}
            </span>
          </div>
          <div className={styles.slopeNumberRow}>
            <span className={styles.slopePrimaryVal} style={{ color: avgClassification.color }}>
              {avgDeg.toFixed(1)}°
            </span>
            <span className={styles.slopeSecondaryVal}>
              ({avgGradePercent}% Grade)
            </span>
          </div>
          <p className={styles.slopeTractionNote}>
            <strong>Traction:</strong> {avgClassification.traction}
          </p>
        </div>

        <div className={styles.slopeMetricBox}>
          <div className={styles.slopeMetricHeader}>
            <span>Peak Local Escarpment</span>
            <span 
              className={styles.slopeCategoryBadge}
              style={{ 
                color: maxClassification.color, 
                backgroundColor: maxClassification.bg,
                borderColor: maxClassification.border
              }}
            >
              ● {maxClassification.category}
            </span>
          </div>
          <div className={styles.slopeNumberRow}>
            <span className={styles.slopePrimaryVal} style={{ color: maxClassification.color }}>
              {maxDeg.toFixed(1)}°
            </span>
            <span className={styles.slopeSecondaryVal}>
              ({maxGradePercent}% Grade)
            </span>
          </div>
          <p className={styles.slopeTractionNote}>
            <strong>Peak Risk:</strong> {maxClassification.traction}
          </p>
        </div>
      </div>

      {/* Slope Classification Filter Buttons */}
      <div className={styles.slopeCategoryFilterBox}>
        <span className={styles.slopeCategoryFilterTitle}>
          Slope Classification Breakdown (Click to filter map overlay):
        </span>
        <div className={styles.slopeCategoryBtnGroup}>
          <button
            type="button"
            className={`${styles.slopeCatBtn} ${styles.slopeCatBtnFlat} ${selectedCategoryFilter === 'flat' ? styles.slopeCatBtnActive : ''}`}
            onClick={() => handleFilterClick('flat')}
          >
            <span className={styles.slopeCatDot} style={{ background: '#10b981' }} />
            <span>Flat (&lt;5°)</span>
            <strong>{distribution.gentle}%</strong>
          </button>

          <button
            type="button"
            className={`${styles.slopeCatBtn} ${styles.slopeCatBtnModerate} ${selectedCategoryFilter === 'moderate' ? styles.slopeCatBtnActive : ''}`}
            onClick={() => handleFilterClick('moderate')}
          >
            <span className={styles.slopeCatDot} style={{ background: '#f59e0b' }} />
            <span>Moderate (5°–15°)</span>
            <strong>{distribution.moderate}%</strong>
          </button>

          <button
            type="button"
            className={`${styles.slopeCatBtn} ${styles.slopeCatBtnSteep} ${selectedCategoryFilter === 'steep' ? styles.slopeCatBtnActive : ''}`}
            onClick={() => handleFilterClick('steep')}
          >
            <span className={styles.slopeCatDot} style={{ background: '#ef4444' }} />
            <span>Steep (&gt;15°)</span>
            <strong>{distribution.severe}%</strong>
          </button>
        </div>
      </div>

      {/* Rover Propulsion Protocol */}
      <div className={styles.roverProtocolBox}>
        <span className={styles.protocolTitle}>⚙️ Mobility Control Protocol for Active Sector:</span>
        <p className={styles.protocolText}>{avgClassification.roverProtocol}</p>
      </div>
    </div>
  );
}
