import React from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Reusable Surface Roughness Card
 * Visualizes rocky obstacles, boulder dispersion, and uneven terrain classifications.
 */
export default function SurfaceRoughnessCard({ region }) {
  if (!region) return null;

  const roughness = region.rockRoughness || {
    rockinessRating: "Moderate",
    meanBoulderSizeM: 0.35,
    rockAbundancePercent: 18,
    soilBearingCapacityKPa: 140,
    unevenIndex: "35 / 100",
    bedrockType: "Stratified Bedrock"
  };

  const abundance = roughness.rockAbundancePercent || 15;
  const abundanceColor = abundance > 35 ? '#ef4444' : abundance > 20 ? '#f59e0b' : '#10b981';

  return (
    <div className={styles.roughnessSection}>
      <div className={styles.sectionHeaderRow}>
        <span className={styles.sectionSubhead}>Rocky & Uneven Terrain Assessment</span>
        <span className={styles.simulatedTag}>SIMULATED ROUGHNESS</span>
      </div>

      <div className={styles.roughnessGrid}>
        <div className={styles.roughnessMetric}>
          <span className={styles.metricLabel}>Rock Hazard Rating</span>
          <span className={styles.metricValueHighlight} style={{ color: abundanceColor }}>
            {roughness.rockinessRating}
          </span>
          <span className={styles.metricSub}>{roughness.bedrockType}</span>
        </div>

        <div className={styles.roughnessMetric}>
          <span className={styles.metricLabel}>Mean Boulder Size</span>
          <span className={styles.metricValue}>{roughness.meanBoulderSizeM} m</span>
          <span className={styles.metricSub}>Chassis ground clearance: 0.45 m</span>
        </div>

        <div className={styles.roughnessMetric}>
          <span className={styles.metricLabel}>Uneven Ground Index</span>
          <span className={styles.metricValue}>{roughness.unevenIndex}</span>
          <span className={styles.metricSub}>Topographic micro-relief</span>
        </div>

        <div className={styles.roughnessMetric}>
          <span className={styles.metricLabel}>Soil Bearing Strength</span>
          <span className={styles.metricValue}>{roughness.soilBearingCapacityKPa} kPa</span>
          <span className={styles.metricSub}>Wheel compaction resistance</span>
        </div>
      </div>

      {/* Rock Abundance Bar */}
      <div className={styles.abundanceRow}>
        <div className={styles.abundanceHeader}>
          <span>Boulder Field Density (Rock Abundance):</span>
          <strong style={{ color: abundanceColor }}>{abundance}% of surface</strong>
        </div>
        <div className={styles.abundanceTrack}>
          <div 
            className={styles.abundanceFill} 
            style={{ width: `${abundance}%`, backgroundColor: abundanceColor }} 
          />
        </div>
      </div>

      <div className={styles.compositionBox}>
        <span className={styles.compositionLabel}>Surface Soil & Stratigraphy:</span>
        <p className={styles.compositionText}>{region.soilComposition}</p>
      </div>
    </div>
  );
}
