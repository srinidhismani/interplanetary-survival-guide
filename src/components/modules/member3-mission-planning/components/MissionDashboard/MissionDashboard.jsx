import React, { useState } from 'react';
import styles from '../../styles/missionDashboard.module.css';
import MissionDetailsCard from './MissionDetailsCard';
import SelectedLocationsCard from './SelectedLocationsCard';
import PlannedRouteCard from './PlannedRouteCard';
import HazardsOverviewCard from './HazardsOverviewCard';
import MissionSummaryModal from './MissionSummaryModal';
import { SIMULATED_HAZARDS, SCIENTIFIC_POIS } from '../../data/simulatedMarsData';

/**
 * Responsibility 4: Mission Planning Dashboard (Member 3)
 * 
 * Requirements:
 * - MISSION DETAILS: Enter & edit mission name, add/toggle/remove exploration objectives.
 * - SELECTED LOCATIONS: Display starting point [A], destination [B], and scientific points of interest.
 * - PLANNED ROUTES: Display experimental route distance, terrain difficulty, and terrain challenges.
 * - POTENTIAL HAZARDS: Display rocky obstacles, steep slopes, uneven terrain, severity, and observed vs estimated.
 * - MISSION SUMMARY: Generate complete summary briefing and copy to clipboard.
 * - INTERACTIVE FUNCTIONALITY: Edit objectives, reset mission information, keep synced across tabs.
 * - SAFETY NOTICE: Never claim experimental routes or hazard forecasts are astronaut-safe.
 */
export default function MissionDashboard({
  missionDetails,
  onUpdateMissionName,
  onAddObjective,
  onToggleObjective,
  onRemoveObjective,
  onResetObjectives,
  startLocation,
  destLocation,
  selectedPois = [],
  onAddPoi,
  onRemovePoi,
  onSetPoiAsDestination,
  activeRoute,
  hazards = SIMULATED_HAZARDS,
  onResetMission,
  onNavigateTab
}) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const completedObjectives = missionDetails?.objectives?.filter(o => o.completed) || [];
  const totalObjectives = missionDetails?.objectives?.length || 0;

  return (
    <div className={styles.dashboardContainer}>
      {/* =====================================================================
          TOP TELEMETRY STATUS BAR
         ===================================================================== */}
      <div className={styles.statusBar}>
        <div className={styles.statusIdentityGroup}>
          <div className={styles.missionPulseIndicator}>
            <span className={styles.pulseRadarDot} />
            <span className={styles.missionIcon}>📋</span>
          </div>
          <div>
            <div className={styles.statusTitle}>
              MARTIAN SURFACE MISSION PLANNING & RECONNAISSANCE DASHBOARD
            </div>
            <div className={styles.statusSub}>
              Mission Operations Control • Integrated Terrain, Route & Hazard Assessment • Sol {missionDetails?.sol || 412}
            </div>
          </div>
        </div>

        <div className={styles.statusReadoutsGroup}>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>ACTIVE MISSION</span>
            <span className={styles.chipVal} style={{ color: '#f97316' }}>
              {missionDetails?.name || 'Mars Recon Traverse'}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>PLANNED DISTANCE</span>
            <span className={styles.chipVal} style={{ color: '#38bdf8' }}>
              {activeRoute ? `${activeRoute.totalDistanceKm} km` : '0 km'}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>OBJECTIVES COMPLETED</span>
            <span className={styles.chipVal} style={{ color: '#10b981' }}>
              {completedObjectives.length} / {totalObjectives}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>HAZARDS IDENTIFIED</span>
            <span className={styles.chipVal} style={{ color: '#ef4444' }}>
              {hazards.length} Zones
            </span>
          </div>
          <span className={styles.liveSystemPill}>MEMBER 3 MODULE</span>
        </div>
      </div>

      {/* =====================================================================
          MISSION ACTION CONTROLS TOOLBAR
         ===================================================================== */}
      <div className={styles.actionToolbar}>
        <div className={styles.primaryActionGroup}>
          <button
            type="button"
            className={styles.summaryBriefingBtn}
            onClick={() => setIsSummaryOpen(true)}
          >
            📋 Generate Mission Briefing & Export
          </button>
          <button
            type="button"
            className={styles.resetMissionBtn}
            onClick={onResetMission}
            title="Reset all mission parameters and objectives to default"
          >
            🔄 Reset Mission Information
          </button>
        </div>

        {onNavigateTab && (
          <div className={styles.tabShortcutsGroup}>
            <span className={styles.shortcutLabel}>Quick Switch:</span>
            <button
              type="button"
              className={styles.shortcutBtn}
              onClick={() => onNavigateTab('terrain')}
            >
              🏔️ Terrain Analysis
            </button>
            <button
              type="button"
              className={styles.shortcutBtn}
              onClick={() => onNavigateTab('hazards')}
            >
              ⚠️ Hazards
            </button>
            <button
              type="button"
              className={styles.shortcutBtn}
              onClick={() => onNavigateTab('poi')}
            >
              🔬 Scientific POIs
            </button>
            <button
              type="button"
              className={styles.shortcutBtn}
              onClick={() => onNavigateTab('planning')}
            >
              🚀 Route Planner
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          2-COLUMN RESPONSIVE MISSION PLANNING GRID
         ===================================================================== */}
      <div className={styles.dashboardGrid}>
        {/* Left Column: Mission Details & Selected Locations */}
        <div className={styles.gridColumn}>
          <MissionDetailsCard
            missionDetails={missionDetails}
            onUpdateMissionName={onUpdateMissionName}
            onAddObjective={onAddObjective}
            onToggleObjective={onToggleObjective}
            onRemoveObjective={onRemoveObjective}
            onResetObjectives={onResetObjectives}
          />

          <SelectedLocationsCard
            startLocation={startLocation}
            destLocation={destLocation}
            selectedPois={selectedPois}
            onAddPoi={onAddPoi}
            onRemovePoi={onRemovePoi}
            onSetPoiAsDestination={onSetPoiAsDestination}
            onNavigateTab={onNavigateTab}
          />
        </div>

        {/* Right Column: Planned Route & Hazards Overview */}
        <div className={styles.gridColumn}>
          <PlannedRouteCard
            route={activeRoute}
            onNavigateTab={onNavigateTab}
          />

          <HazardsOverviewCard
            hazards={hazards}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>

      {/* =====================================================================
          MISSION SUMMARY REPORT MODAL
         ===================================================================== */}
      <MissionSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        missionDetails={missionDetails}
        startLocation={startLocation}
        destLocation={destLocation}
        activeRoute={activeRoute}
        selectedPois={selectedPois}
        hazards={hazards}
      />
    </div>
  );
}
