import React from 'react';
import styles from '../../styles/scientificPois.module.css';

/**
 * Detailed Scientific Information Panel for the selected geological location.
 * Clearly distinguishes verified scientific data from sample reconnaissance metrics.
 */
export default function PoiDetailCard({
  poi,
  onSelectAsDestination
}) {
  if (!poi) {
    return (
      <div className={styles.emptyCard}>
        <span>Click any scientific marker on the map to inspect verified planetary geology.</span>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      {/* Header with Title and Category */}
      <div className={styles.detailHeader}>
        <div>
          <div className={styles.categoryBadgeRow}>
            <span className={styles.categoryBadge}>{poi.icon} {poi.category}</span>
            <span className={styles.epochBadge}>{poi.geologicalEpoch}</span>
          </div>
          <h3 className={styles.poiTitle}>{poi.name}</h3>
        </div>

        <button
          type="button"
          className={styles.missionDestButton}
          onClick={() => onSelectAsDestination && onSelectAsDestination(poi)}
          title="Pre-populate this scientific POI as destination in Mission Planning"
        >
          🚀 Set as Mission Destination
        </button>
      </div>

      {/* Verified Geographic Telemetry Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCell}>
          <span className={styles.metricLabel}>Martian Coordinates</span>
          <span className={styles.metricValCoord}>📍 {poi.coordinates}</span>
          <span className={styles.metricSub}>IAU Standard Meridian Datum</span>
        </div>

        <div className={styles.metricCell}>
          <span className={styles.metricLabel}>Elevation / Relief</span>
          <span className={styles.metricVal} style={{ color: poi.elevationM > 0 ? '#fca5a5' : '#38bdf8' }}>
            {poi.elevation}
          </span>
          <span className={styles.metricSub}>MOLA Altimeter Aligned</span>
        </div>

        <div className={styles.metricCell} style={{ gridColumn: 'span 2' }}>
          <span className={styles.metricLabel}>Physical Dimensions</span>
          <span className={styles.metricVal}>{poi.dimensions}</span>
        </div>
      </div>

      {/* Short Scientific Description */}
      <div className={styles.sectionBlock}>
        <span className={styles.sectionHeading}>Scientific Overview:</span>
        <p className={styles.descriptionText}>{poi.shortDescription}</p>
      </div>

      {/* In-depth Geological Characteristics */}
      <div className={styles.sectionBlock}>
        <span className={styles.sectionHeading}>Geological Characteristics & Planetary History:</span>
        <p className={styles.characteristicsText}>{poi.geologicalCharacteristics}</p>
      </div>

      {/* VERIFIED SCIENTIFIC FACTS SECTION (Distinctly labeled) */}
      <div className={styles.verifiedFactsBox}>
        <div className={styles.verifiedHeader}>
          <span>✓ VERIFIED SCIENTIFIC DATA (NASA / ESA / IAU)</span>
        </div>
        <ul className={styles.factsList}>
          {poi.verifiedScientificFacts?.map((fact, idx) => (
            <li key={idx} className={styles.factItem}>
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {/* SAMPLE RECONNAISSANCE TELEMETRY SECTION (Distinctly labeled) */}
      <div className={styles.sampleDataBox}>
        <div className={styles.sampleHeader}>
          <span>🧪 SAMPLE ROVER RECONNAISSANCE TELEMETRY (SIMULATED)</span>
        </div>
        <div className={styles.sampleGrid}>
          <div>
            <strong>Traversability Score:</strong> {poi.sampleReconData?.traversabilityScore} / 100
          </div>
          <div>
            <strong>Terrain Difficulty:</strong> {poi.sampleReconData?.terrainDifficulty}
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <strong>Chassis Suitability:</strong> {poi.sampleReconData?.chassisSuitability}
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <strong>Primary Science Objective:</strong> {poi.sampleReconData?.primaryObjective}
          </div>
        </div>
      </div>
    </div>
  );
}
