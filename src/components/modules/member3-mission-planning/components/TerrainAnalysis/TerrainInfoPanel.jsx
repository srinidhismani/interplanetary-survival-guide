import React, { useState } from 'react';
import styles from '../../styles/terrainAnalysis.module.css';
import ElevationAnalysisPanel from './ElevationAnalysisPanel';
import SlopeAnalysisPanel from './SlopeAnalysisPanel';
import SurfaceRoughnessCard from './SurfaceRoughnessCard';
import TerrainInspectorTool from './TerrainInspectorTool';
import Badge from '../common/Badge';

/**
 * Dedicated Right-Side Terrain Information Panel
 * Houses:
 * - Sector overview & mobility score
 * - Dedicated Elevation Analysis panel with interactive transect
 * - Dedicated Slope Analysis panel with degrees and grade %
 * - Rocky & uneven terrain assessment
 * - Interactive Location Inspector probe
 * - Detected sector hazards
 * - Strict astronaut safety disclaimer
 */
export default function TerrainInfoPanel({
  region,
  hazards = [],
  selectedHazardId,
  onSelectHazard,
  inspectedPoint,
  onSelectTarget,
  onHighlightSlopeType
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!region) {
    return (
      <div className={styles.infoPanelEmpty}>
        <span>Select a Martian sector from the map to inspect terrain telemetry.</span>
      </div>
    );
  }

  // Filter hazards associated with this sector
  const sectorHazards = hazards.filter(
    h => h.regionId === region.id || (region.hazardIds && region.hazardIds.includes(h.id))
  );

  return (
    <aside className={styles.rightInfoPanel} aria-label="Martian Terrain Information Panel">
      {/* Panel Top Header */}
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleRow}>
          <div>
            <div className={styles.panelQuadrant}>{region.quadrant || 'Martian Reconnaissance'}</div>
            <h3 className={styles.panelSectorTitle}>{region.name}</h3>
          </div>
          <span className={styles.simulatedBadge}>SIMULATED DATA</span>
        </div>

        <div className={styles.panelMetaRow}>
          <span className={styles.metaCoordinate}>📍 {region.coordinates}</span>
          <div className={styles.traversabilityPill}>
            <span>Mobility Score:</span>
            <strong>{region.traversabilityScore} / 100</strong>
          </div>
        </div>

        <p className={styles.panelDescription}>
          {region.description}
        </p>
      </div>

      {/* Quick Telemetry Bar */}
      <div className={styles.quickMetricsBar}>
        <div className={styles.quickMetricItem}>
          <span className={styles.quickMetricLabel}>Base Datum</span>
          <span className={styles.quickMetricVal}>{region.baseElevation}</span>
        </div>
        <div className={styles.quickMetricItem}>
          <span className={styles.quickMetricLabel}>Avg Slope</span>
          <span className={styles.quickMetricVal}>{region.slopeAngle}</span>
        </div>
        <div className={styles.quickMetricItem}>
          <span className={styles.quickMetricLabel}>Max Speed</span>
          <span className={styles.quickMetricVal}>{region.recommendedSpeed}</span>
        </div>
        <div className={styles.quickMetricItem}>
          <span className={styles.quickMetricLabel}>Hazards</span>
          <span className={styles.quickMetricVal} style={{ color: sectorHazards.length > 0 ? '#ef4444' : '#10b981' }}>
            {sectorHazards.length} Detected
          </span>
        </div>
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className={styles.panelTabFilter}>
        <button
          type="button"
          className={`${styles.panelFilterBtn} ${activeTab === 'overview' ? styles.panelFilterBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          type="button"
          className={`${styles.panelFilterBtn} ${activeTab === 'elevation' ? styles.panelFilterBtnActive : ''}`}
          onClick={() => setActiveTab('elevation')}
        >
          🏔️ Elevation
        </button>
        <button
          type="button"
          className={`${styles.panelFilterBtn} ${activeTab === 'slope' ? styles.panelFilterBtnActive : ''}`}
          onClick={() => setActiveTab('slope')}
        >
          📐 Slope Analysis
        </button>
        <button
          type="button"
          className={`${styles.panelFilterBtn} ${activeTab === 'roughness' ? styles.panelFilterBtnActive : ''}`}
          onClick={() => setActiveTab('roughness')}
        >
          🪨 Rocky / Uneven
        </button>
        <button
          type="button"
          className={`${styles.panelFilterBtn} ${activeTab === 'inspector' ? styles.panelFilterBtnActive : ''}`}
          onClick={() => setActiveTab('inspector')}
        >
          🎯 Probe Inspector
        </button>
        <button
          type="button"
          className={`${styles.panelFilterBtn} ${activeTab === 'hazards' ? styles.panelFilterBtnActive : ''}`}
          onClick={() => setActiveTab('hazards')}
        >
          ⚠️ Hazards ({sectorHazards.length})
        </button>
      </div>

      {/* Panel Scrollable Content Body */}
      <div className={styles.panelScrollBody}>
        {/* OVERVIEW TAB: Combines essential elevation, slope, and roughness previews */}
        {activeTab === 'overview' && (
          <>
            <div className={styles.panelSectionCard}>
              <ElevationAnalysisPanel region={region} />
            </div>

            <div className={styles.panelSectionCard}>
              <SlopeAnalysisPanel 
                region={region} 
                onHighlightSlopeType={onHighlightSlopeType} 
              />
            </div>

            <div className={styles.panelSectionCard}>
              <SurfaceRoughnessCard region={region} />
            </div>
          </>
        )}

        {/* ELEVATION TAB */}
        {activeTab === 'elevation' && (
          <div className={styles.panelSectionCard}>
            <ElevationAnalysisPanel region={region} />
          </div>
        )}

        {/* SLOPE TAB */}
        {activeTab === 'slope' && (
          <div className={styles.panelSectionCard}>
            <SlopeAnalysisPanel 
              region={region} 
              onHighlightSlopeType={onHighlightSlopeType} 
            />
          </div>
        )}

        {/* ROCKY & UNEVEN TERRAIN TAB */}
        {activeTab === 'roughness' && (
          <div className={styles.panelSectionCard}>
            <SurfaceRoughnessCard region={region} />
          </div>
        )}

        {/* PROBE INSPECTOR TAB */}
        {activeTab === 'inspector' && (
          <div className={styles.panelSectionCard}>
            <TerrainInspectorTool 
              inspectedPoint={inspectedPoint}
              onSelectTarget={onSelectTarget}
            />
          </div>
        )}

        {/* HAZARDS TAB */}
        {activeTab === 'hazards' && (
          <div className={styles.panelSectionCard}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionSubhead}>Detected Local Hazards ({sectorHazards.length})</span>
              <span className={styles.simulatedTag}>SIMULATED WARNINGS</span>
            </div>

            {sectorHazards.length > 0 ? (
              <div className={styles.hazardMiniList}>
                {sectorHazards.map((hazard) => {
                  const isSelected = hazard.id === selectedHazardId;
                  return (
                    <div
                      key={hazard.id}
                      className={`${styles.hazardMiniCard} ${isSelected ? styles.hazardMiniCardActive : ''}`}
                      onClick={() => onSelectHazard && onSelectHazard(hazard.id)}
                    >
                      <div className={styles.hazardMiniHeader}>
                        <span className={styles.hazardMiniTitle}>⚠️ {hazard.title}</span>
                        <Badge level={hazard.severity} />
                      </div>
                      <div className={styles.hazardMiniMeta}>
                        <span>Radius: ~{hazard.radiusMeters} m</span>
                        <span>Status: {hazard.status}</span>
                      </div>
                      <div className={styles.hazardImpactText}>
                        <strong>Terrain Impact:</strong> {hazard.slopeImpact}
                      </div>
                      <div className={styles.hazardProtocolText}>
                        <strong>Mitigation Protocol:</strong> {hazard.mitigation}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noHazardsCard}>
                ✓ No critical geomorphological hazards logged in this immediate sector.
              </div>
            )}
          </div>
        )}

        {/* Strictly Worded Astronaut Safety Disclaimer */}
        <div className={styles.missionAdvisoryBox}>
          <div className={styles.advisoryHeader}>
            <span>⚠️ MISSION RECONNAISSANCE ADVISORY</span>
          </div>
          <p className={styles.advisoryText}>
            All topographic measurements, slope calculations, and hazard ratings are derived from <strong>simulated orbital reconnaissance datasets</strong>. 
            Experimental transit routes and classified zones are generated strictly for robotic rover telemetry simulation and are <strong>NOT certified as astronaut-safe</strong>. 
            Crewed operations require high-precision ground truth validation and manual mission control signoff.
          </p>
        </div>
      </div>
    </aside>
  );
}
