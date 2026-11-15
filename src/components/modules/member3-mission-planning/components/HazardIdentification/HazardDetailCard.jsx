import React from 'react';
import styles from '../../styles/hazardIdentification.module.css';

/**
 * Reusable Detailed Information Panel for a single selected hazard
 */
export default function HazardDetailCard({ hazard }) {
  if (!hazard) {
    return (
      <div className={styles.emptyDetailCard}>
        <span>Click any hazard marker on the map or in the list below to inspect full telemetry.</span>
      </div>
    );
  }

  const severity = (hazard.severity || 'MEDIUM').toUpperCase();
  const isObserved = hazard.observationType === 'OBSERVED';

  // Severity color mapping
  let severityColor = '#f59e0b';
  let severityLabel = 'Medium Risk';
  let severityBg = 'rgba(245, 158, 11, 0.12)';
  let severityBorder = 'rgba(245, 158, 11, 0.4)';

  if (severity === 'HIGH' || severity === 'CRITICAL') {
    severityColor = '#ef4444';
    severityLabel = 'High Risk';
    severityBg = 'rgba(239, 68, 68, 0.15)';
    severityBorder = 'rgba(239, 68, 68, 0.45)';
  } else if (severity === 'LOW') {
    severityColor = '#10b981';
    severityLabel = 'Low Risk';
    severityBg = 'rgba(16, 185, 129, 0.12)';
    severityBorder = 'rgba(16, 185, 129, 0.35)';
  }

  return (
    <div className={styles.detailCardContainer}>
      {/* Header with Title and Severity Badge */}
      <div className={styles.detailHeader}>
        <div>
          <div className={styles.detailTypeRow}>
            <span className={styles.detailTypeTag}>{hazard.icon || '⚠️'} {hazard.type || hazard.category}</span>
            <span className={styles.detailIdTag}>{hazard.id}</span>
          </div>
          <h3 className={styles.detailHazardTitle}>{hazard.title}</h3>
        </div>

        <span
          className={styles.severityBadge}
          style={{
            color: severityColor,
            backgroundColor: severityBg,
            borderColor: severityBorder
          }}
        >
          ● {severityLabel}
        </span>
      </div>

      {/* Observation Source Distinction Banner */}
      <div className={isObserved ? styles.sourceBannerObserved : styles.sourceBannerEstimated}>
        <div className={styles.sourceBannerTitle}>
          {isObserved ? '🛰️ OBSERVED HAZARD' : '🧪 ESTIMATED RISK (SIMULATED)'}
        </div>
        <p className={styles.sourceBannerDesc}>
          {isObserved
            ? `Supported by confirmed orbital or surface observational telemetry: ${hazard.sourceDetails || 'MRO HiRISE / CTX'}`
            : `Projected risk based on simulated Martian terrain altimetry, slope degradation models, and roughness backscatter simulations.`
          }
        </p>
      </div>

      {/* Coordinates & Physical Telemetry Grid */}
      <div className={styles.detailMetricsGrid}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Martian Coordinates</span>
          <span className={styles.metricValueCoord}>📍 {hazard.coordinates || hazard.location}</span>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Hazard Danger Radius</span>
          <span className={styles.metricValue}>~{hazard.radiusMeters} meters</span>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Hazard Type</span>
          <span className={styles.metricValue}>{hazard.type || hazard.category}</span>
        </div>

        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Severity Level</span>
          <span className={styles.metricValue} style={{ color: severityColor }}>
            {severityLabel}
          </span>
        </div>
      </div>

      {/* Geological Description */}
      <div className={styles.detailSection}>
        <span className={styles.detailSectionHeading}>Geological Challenge Description:</span>
        <p className={styles.detailSectionText}>
          {hazard.description || hazard.title}
        </p>
      </div>

      {/* Terrain Impact */}
      {hazard.slopeImpact && (
        <div className={styles.detailSection}>
          <span className={styles.detailSectionHeading}>Terrain & Wheel Impact:</span>
          <p className={styles.impactText}>
            {hazard.slopeImpact}
          </p>
        </div>
      )}

      {/* Mitigation Action Protocol */}
      <div className={styles.mitigationBox}>
        <span className={styles.mitigationHeading}>🛠️ Operational Mitigation Protocol:</span>
        <p className={styles.mitigationText}>
          {hazard.mitigation}
        </p>
      </div>

      {/* Strict Astronaut Safety Disclaimer */}
      <div className={styles.safetyDisclaimerBanner}>
        <div className={styles.disclaimerTitle}>
          ⚠️ MISSION SAFETY NOTICE — ROBOTIC RECONNAISSANCE ONLY
        </div>
        <p className={styles.disclaimerText}>
          Hazard identification is experimental and derived from remote orbital telemetry and simulated models. 
          <strong>This data must NOT be presented or relied upon as certified astronaut safety information.</strong> 
          Crewed missions require verified ground-truth exploration.
        </p>
      </div>
    </div>
  );
}
