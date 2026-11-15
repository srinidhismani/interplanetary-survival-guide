import React, { useState } from 'react';
import styles from '../../styles/missionDashboard.module.css';

/**
 * Mission Summary Modal & Report Generator
 * Assembles an executive mission briefing containing:
 * - Mission Name, Sol, and Rover Chassis
 * - Exploration Objectives and completion status
 * - Starting and Destination locations with Martian coordinates
 * - Route metrics (distance, difficulty, waypoints)
 * - Potential Hazards identified in mission zone (observed vs estimated)
 * - Selected Scientific POIs
 * - Mandatory astronaut safety disclaimer
 * - One-click clipboard copy
 */
export default function MissionSummaryModal({
  isOpen,
  onClose,
  missionDetails,
  startLocation,
  destLocation,
  activeRoute,
  selectedPois = [],
  hazards = []
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const completedObjectives = missionDetails.objectives.filter(o => o.completed);
  const pendingObjectives = missionDetails.objectives.filter(o => !o.completed);
  const highHazards = hazards.filter(h => h.severity === 'HIGH');
  const observedHazards = hazards.filter(h => h.observationType === 'OBSERVED');
  const estimatedHazards = hazards.filter(h => h.observationType === 'ESTIMATED');

  // Generate plain text / markdown briefing for clipboard
  const generateBriefingText = () => {
    return `================================================================================
MARTIAN EXPEDITION MISSION BRIEFING & SURFACE TRAVERSE PLAN
================================================================================
Generated: Sol ${missionDetails.sol} | Platform: ${missionDetails.roverModel}
Mission Name: ${missionDetails.name}
Status: RECONNAISSANCE TRAVERSE PLANNING PHASE

1. MISSION OBJECTIVES:
${missionDetails.objectives.map((o, idx) => `   [${o.completed ? 'COMPLETED' : 'PENDING'}] ${idx + 1}. ${o.text}`).join('\n')}

2. SURFACE WAYPOINTS & TARGET LOCATIONS:
   • Starting Origin [A]:
     - Location: ${startLocation?.name || 'Not Designated'}
     - Coordinates: ${startLocation?.coordinates || 'N/A'}
     - Base Elevation: ${startLocation?.baseElevation || 'N/A'}
   • Mission Destination [B]:
     - Location: ${destLocation?.name || 'Not Designated'}
     - Coordinates: ${destLocation?.coordinates || 'N/A'}
     - Base Elevation: ${destLocation?.baseElevation || 'N/A'}

3. AUTONOMOUS ROUTE & TRAVERSE METRICS:
   • Total Traverse Distance: ${activeRoute ? `${activeRoute.totalDistanceKm} km` : 'No route generated'}
   • Path Difficulty Rating: ${activeRoute ? `${activeRoute.difficultyScore}/100 (${activeRoute.difficultyClass.toUpperCase()})` : 'Standby'}
   • Total Waypoint Nodes: ${activeRoute?.waypoints ? activeRoute.waypoints.length : 0} nodes
   • Estimated Traverse Duration: ${activeRoute?.estimatedDurationHours ? `${activeRoute.estimatedDurationHours} hours (~${activeRoute.estimatedSols} Sols)` : 'N/A'}
   • Avoided Bottlenecks: ${activeRoute?.challengesAvoided?.length || 0} terrain barriers bypassed

4. SCIENTIFIC POINTS OF INTEREST (POIs):
${selectedPois.length > 0 ? selectedPois.map((p, idx) => `   ${idx + 1}. ${p.name} (${p.category}) - Coords: ${p.coordinates} | Elevation: ${p.elevation}`).join('\n') : '   No specific scientific landmarks attached to current itinerary.'}

5. IDENTIFIED SURFACE HAZARDS (${hazards.length} Total):
   • High Severity Hazards: ${highHazards.length}
   • Empirically Observed (Orbital): ${observedHazards.length}
   • Mathematically Estimated (DEM/Slope): ${estimatedHazards.length}
${hazards.slice(0, 5).map(h => `   - [${h.severity}] ${h.title} (${h.type} @ ${h.coordinates}) [${h.observationType}]`).join('\n')}
${hazards.length > 5 ? `   ... and ${hazards.length - 5} additional regional hazards cataloged.` : ''}

================================================================================
SAFETY DIRECTIVE & DISCLAIMER:
CRITICAL NOTICE: All calculations, traverse routes, and terrain risk models
are experimental autonomous robotic simulations. They are NOT certified for
crewed astronaut surface transit or life-critical extravehicular activity (EVA).
================================================================================`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateBriefingText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitleGroup}>
            <span className={styles.modalHeaderBadge}>EXECUTIVE BRIEFING REPORT</span>
            <h2 className={styles.modalTitle}>{missionDetails.name}</h2>
            <div className={styles.modalSubtitle}>
              Sol {missionDetails.sol} • {missionDetails.roverModel} • Autonomous Traverse Summary
            </div>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            title="Close Briefing"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Key Stat Ribbon */}
          <div className={styles.summaryRibbon}>
            <div className={styles.ribbonItem}>
              <span className={styles.ribbonLabel}>DISTANCE</span>
              <strong className={styles.ribbonVal} style={{ color: '#38bdf8' }}>
                {activeRoute ? `${activeRoute.totalDistanceKm} km` : '0 km'}
              </strong>
            </div>
            <div className={styles.ribbonItem}>
              <span className={styles.ribbonLabel}>OBJECTIVES</span>
              <strong className={styles.ribbonVal} style={{ color: '#10b981' }}>
                {completedObjectives.length} / {missionDetails.objectives.length} Done
              </strong>
            </div>
            <div className={styles.ribbonItem}>
              <span className={styles.ribbonLabel}>HAZARDS IDENTIFIED</span>
              <strong className={styles.ribbonVal} style={{ color: '#ef4444' }}>
                {hazards.length} ({highHazards.length} High)
              </strong>
            </div>
            <div className={styles.ribbonItem}>
              <span className={styles.ribbonLabel}>SCIENTIFIC SITES</span>
              <strong className={styles.ribbonVal} style={{ color: '#f59e0b' }}>
                {selectedPois.length} POIs
              </strong>
            </div>
          </div>

          {/* Section 1: Objectives */}
          <div className={styles.summarySection}>
            <h4 className={styles.sectionHeaderTitle}>🎯 Exploration Objectives</h4>
            <div className={styles.summaryObjectivesList}>
              {missionDetails.objectives.map((obj, i) => (
                <div key={obj.id || i} className={styles.summaryObjectiveItem}>
                  <span className={obj.completed ? styles.statusCheckDone : styles.statusCheckPending}>
                    {obj.completed ? '✓' : '○'}
                  </span>
                  <span className={obj.completed ? styles.objectiveDoneText : styles.objectivePendingText}>
                    {obj.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Locations & Planned Route */}
          <div className={styles.summarySection}>
            <h4 className={styles.sectionHeaderTitle}>📍 Waypoints & Route Trajectory</h4>
            <div className={styles.summaryRouteGrid}>
              <div className={styles.summaryRouteBox}>
                <span className={styles.boxTag}>ORIGIN [A]</span>
                <strong className={styles.boxName}>{startLocation?.name || 'Unassigned'}</strong>
                <span className={styles.boxMeta}>Coords: {startLocation?.coordinates || 'N/A'}</span>
                <span className={styles.boxMeta}>Elevation: {startLocation?.baseElevation || 'N/A'}</span>
              </div>
              <div className={styles.summaryRouteArrow}>➔</div>
              <div className={styles.summaryRouteBox}>
                <span className={styles.boxTag} style={{ color: '#ef4444' }}>DESTINATION [B]</span>
                <strong className={styles.boxName}>{destLocation?.name || 'Unassigned'}</strong>
                <span className={styles.boxMeta}>Coords: {destLocation?.coordinates || 'N/A'}</span>
                <span className={styles.boxMeta}>Elevation: {destLocation?.baseElevation || 'N/A'}</span>
              </div>
            </div>

            {activeRoute && (
              <div className={styles.summaryRouteMetricsStrip}>
                <span>📏 Distance: <strong>{activeRoute.totalDistanceKm} km</strong></span>
                <span>🧭 Waypoints: <strong>{activeRoute.waypoints?.length || 0} nodes</strong></span>
                <span>⚡ Difficulty: <strong>{activeRoute.difficultyClass?.toUpperCase()} ({activeRoute.difficultyScore}/100)</strong></span>
                <span>🛡️ Bypassed Obstacles: <strong>{activeRoute.challengesAvoided?.length || 0}</strong></span>
              </div>
            )}
          </div>

          {/* Section 3: Scientific POIs */}
          <div className={styles.summarySection}>
            <h4 className={styles.sectionHeaderTitle}>🔬 Included Scientific Points of Interest</h4>
            {selectedPois.length === 0 ? (
              <p className={styles.emptyNotice}>No scientific landmarks attached to this itinerary.</p>
            ) : (
              <div className={styles.summaryPoisList}>
                {selectedPois.map(p => (
                  <div key={p.id} className={styles.summaryPoiPill}>
                    <span>{p.icon || '🔬'}</span>
                    <strong>{p.name}</strong>
                    <span className={styles.summaryPoiCat}>({p.category})</span>
                    <span className={styles.summaryPoiCoord}>📍 {p.coordinates}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Potential Hazards Summary */}
          <div className={styles.summarySection}>
            <h4 className={styles.sectionHeaderTitle}>⚠️ Potential Surface Hazards</h4>
            <div className={styles.hazardBreakdownRow}>
              <span>High Severity: <strong style={{ color: '#ef4444' }}>{highHazards.length}</strong></span>
              <span>Observed by Orbiter: <strong style={{ color: '#38bdf8' }}>{observedHazards.length}</strong></span>
              <span>Estimated from DEM: <strong style={{ color: '#a78bfa' }}>{estimatedHazards.length}</strong></span>
            </div>
            <div className={styles.hazardsSnippetList}>
              {hazards.slice(0, 4).map(h => (
                <div key={h.id} className={styles.hazardSnippetItem}>
                  <span className={styles.hazardSnippetIcon}>{h.icon || '⚠️'}</span>
                  <div className={styles.hazardSnippetBody}>
                    <strong>{h.title}</strong> ({h.type} • {h.severity})
                    <span className={styles.hazardSnippetProv}>
                      {h.observationType === 'OBSERVED' ? '🛰️ Confirmed Optical' : '🧪 Simulated Terrain Risk'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Disclaimer Banner */}
          <div className={styles.criticalSafetyBox}>
            <span className={styles.cautionIcon}>🛑</span>
            <div>
              <strong>CREW SAFETY WARNING & DISCLAIMER</strong>
              <p>
                All calculations, traversability ratings, and hazard vectors are simulated research data.
                This automated mission plan is <strong>NOT CERTIFIED AS ASTRONAUT-SAFE</strong> for human transit.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.copyBriefingBtn}
            onClick={handleCopy}
          >
            {copied ? '✅ Briefing Copied to Clipboard!' : '📋 Copy Briefing to Clipboard'}
          </button>
          <button
            type="button"
            className={styles.closeBriefingBtn}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
