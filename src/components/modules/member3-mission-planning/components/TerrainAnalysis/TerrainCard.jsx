import React from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Reusable card to present specific topographic region metrics
 */
export default function TerrainCard({ region }) {
  if (!region) return null;

  const score = region.traversabilityScore;
  const barColor = score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className={styles.detailCard}>
      <div className={styles.detailTitle}>{region.name}</div>
      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.4' }}>
        {region.description}
      </p>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Coordinates</span>
        <span className={styles.detailValue}>{region.coordinates}</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Base Elevation</span>
        <span className={styles.detailValue}>{region.baseElevation}</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Slope Angle</span>
        <span className={styles.detailValue}>{region.slopeAngle}</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Soil & Bedrock</span>
        <span className={styles.detailValue}>{region.soilComposition}</span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Surface Roughness</span>
        <span className={styles.detailValue}>{region.surfaceRoughness}</span>
      </div>

      <div className={styles.traversabilityBarContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>Traversability Rating</span>
          <span style={{ color: barColor, fontWeight: 700 }}>{score} / 100</span>
        </div>
        <div className={styles.barTrack}>
          <div 
            className={styles.barFill} 
            style={{ width: `${score}%`, backgroundColor: barColor }} 
          />
        </div>
      </div>
    </div>
  );
}
