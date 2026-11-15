import React from 'react';
import styles from '../../styles/missionPlanning.module.css';

/**
 * Route Telemetry & Waypoints Breakdown Panel
 */
export default function RouteDetailsPanel({ route }) {
  if (!route) {
    return (
      <div className={styles.emptyRoutePanel}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
        <h4>No Route Generated Yet</h4>
        <p>Select a starting location and destination above, then click <strong>"Generate Experimental Route"</strong> to compute an obstacle-avoiding traverse path.</p>
      </div>
    );
  }

  const isHighRisk = route.difficultyClass === 'high';
  const isModerate = route.difficultyClass === 'moderate';
  const difficultyColor = isHighRisk ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';

  return (
    <div className={styles.routeDetailsContainer}>
      {/* Route Title & Status Header */}
      <div className={styles.detailsHeader}>
        <div>
          <span className={styles.routePill}>EXPERIMENTAL RECONNAISSANCE TRAVERSE</span>
          <h3 className={styles.routeName}>{route.name}</h3>
        </div>

        <span 
          className={styles.difficultyBadge}
          style={{ 
            color: difficultyColor, 
            borderColor: difficultyColor,
            backgroundColor: isHighRisk ? 'rgba(239, 68, 68, 0.15)' : isModerate ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'
          }}
        >
          ● {route.difficulty}
        </span>
      </div>

      {/* Start / Destination Summary Bar */}
      <div className={styles.terminalsSummaryBox}>
        <div className={styles.terminalItem}>
          <span className={styles.terminalLabel} style={{ color: '#10b981' }}>🟢 Origin [A]</span>
          <span className={styles.terminalName}>{route.startLocation?.name || 'Selected Origin'}</span>
          <span className={styles.terminalCoord}>📍 {route.startLocation?.coordinates || `${route.startLocation?.lat}, ${route.startLocation?.lon}`}</span>
        </div>

        <div className={styles.terminalArrow}>➜</div>

        <div className={styles.terminalItem}>
          <span className={styles.terminalLabel} style={{ color: '#ef4444' }}>🔴 Destination [B]</span>
          <span className={styles.terminalName}>{route.destLocation?.name || 'Selected Destination'}</span>
          <span className={styles.terminalCoord}>📍 {route.destLocation?.coordinates || `${route.destLocation?.lat}, ${route.destLocation?.lon}`}</span>
        </div>
      </div>

      {/* Primary Route Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Traverse Distance</span>
          <span className={styles.metricValLarge} style={{ color: '#38bdf8' }}>
            {route.totalDistanceKm} km
          </span>
          <span className={styles.metricSub}>Geographic Surface Path</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Estimated Drive Time</span>
          <span className={styles.metricValLarge}>
            {route.estimatedDurationHours} hrs
          </span>
          <span className={styles.metricSub}>~{route.estimatedSols} Martian Sols</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Power Consumption</span>
          <span className={styles.metricValLarge}>
            {route.estimatedPowerKwh} kWh
          </span>
          <span className={styles.metricSub}>Drive Motors & Avionics</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Navigation Waypoints</span>
          <span className={styles.metricValLarge} style={{ color: '#f97316' }}>
            {route.waypoints?.length || 0} Points
          </span>
          <span className={styles.metricSub}>A* Computed Nodes</span>
        </div>
      </div>

      {/* Terrain Challenges & Obstacles Bypassed */}
      <div className={styles.challengesSection}>
        <div className={styles.sectionHeaderRow}>
          <span className={styles.sectionTitle}>
            Terrain Challenges & Obstacles Considered
          </span>
          <span className={styles.simulatedTag}>SIMULATED AVOIDANCE</span>
        </div>

        {route.challenges && route.challenges.length > 0 ? (
          <div className={styles.challengesList}>
            {route.challenges.map((ch, idx) => (
              <div key={idx} className={styles.challengeItem}>
                <span>⚠️</span>
                <span><strong>Bypass Executed:</strong> {ch}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noChallengesBox}>
            ✓ Path follows level lowlands with no critical slope or boulder field obstructions.
          </div>
        )}
      </div>

      {/* Step-by-step Waypoint Sequence */}
      <div className={styles.waypointsSection}>
        <div className={styles.sectionHeaderRow}>
          <span className={styles.sectionTitle}>
            Step-by-Step Waypoint Sequence ({route.waypoints?.length || 0})
          </span>
          <span className={styles.simulatedTag}>ROVER NAV MESH</span>
        </div>

        <div className={styles.waypointsList}>
          {route.waypoints && route.waypoints.map((wp) => (
            <div key={wp.step} className={styles.waypointRow}>
              <div className={styles.waypointStepBadge}>{wp.step}</div>
              <div className={styles.waypointInfoCol}>
                <div className={styles.waypointTitleRow}>
                  <strong className={styles.wpName}>{wp.name}</strong>
                  <span className={styles.wpDist}>
                    {wp.step === 1 ? 'Start' : `+${wp.segmentDistKm} km`}
                  </span>
                </div>
                <div className={styles.wpMetaRow}>
                  <span>📍 {wp.lat}, {wp.lon}</span>
                  <span>▲ {wp.elevation}</span>
                  <span>📐 {wp.segmentSlope} slope</span>
                </div>
                <div className={styles.wpNotice}>
                  🧭 {wp.terrainNotice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Safety Notice: No Astronaut-Safe Claims */}
      <div className={styles.safetyDisclaimerBanner}>
        <div className={styles.disclaimerTitle}>
          ⚠️ MISSION SAFETY NOTICE — EXPERIMENTAL ROUTE PLANNING ONLY
        </div>
        <p className={styles.disclaimerText}>
          All proposed transit vectors, distance calculations, and power budgets are generated by an experimental robotic rover pathfinding model. 
          <strong>These routes are NOT certified as astronaut-safe.</strong> Crewed surface operations require high-precision ground-truth verification, environmental life-support margins, and manual Houston/Flight Control validation.
        </p>
      </div>
    </div>
  );
}
