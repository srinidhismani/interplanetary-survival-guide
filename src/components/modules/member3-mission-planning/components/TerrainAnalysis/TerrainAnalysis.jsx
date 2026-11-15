import React, { useState } from 'react';
import styles from '../../styles/terrainAnalysis.module.css';
import InteractiveTerrainMap from './InteractiveTerrainMap';
import TerrainInfoPanel from './TerrainInfoPanel';
import MapLayerControls from './MapLayerControls';
import { SIMULATED_REGIONS, SIMULATED_HAZARDS } from '../../data/simulatedMarsData';
import { RECON_TARGETS } from './TerrainInspectorTool';

/**
 * Responsibility 1: Terrain Analysis Dashboard
 * Coordinates:
 * - Interactive Martian Terrain Map with Elevation & Slope Visualizations
 * - Real-time Location Inspection Probe
 * - Dedicated Elevation and Slope Analysis Panels
 * - Rocky and Uneven Ground Breakdown
 * - Hazard Identifications
 * - Strictly labeled simulated telemetry & mission safety protocols
 */
export default function TerrainAnalysis({
  regions = SIMULATED_REGIONS,
  hazards = SIMULATED_HAZARDS
}) {
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0]?.id || 'reg-01');
  const [selectedHazardId, setSelectedHazardId] = useState(null);
  const [mapMode, setMapMode] = useState('elevation'); // 'elevation' | 'slope' | 'roughness'
  const [highlightSlopeType, setHighlightSlopeType] = useState('all'); // 'all' | 'flat' | 'moderate' | 'steep'
  const [inspectedPoint, setInspectedPoint] = useState(RECON_TARGETS[0]);

  const [layers, setLayers] = useState({
    elevation: true,
    roughness: true,
    hazards: true,
    grid: true
  });

  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  const handleToggleLayer = (layerKey) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const handleSelectHazard = (hazardId) => {
    setSelectedHazardId(hazardId);
    const targetHazard = hazards.find(h => h.id === hazardId);
    if (targetHazard && targetHazard.regionId) {
      setSelectedRegionId(targetHazard.regionId);
    }
  };

  // Called when user clicks anywhere on the SVG map to inspect
  const handleInspectMapPoint = (customPoint) => {
    setInspectedPoint(customPoint);
    // Find if point is close to any region
    const matchedRegion = regions.find(r => {
      const coords = r.mapCoords || { x: 400, y: 250 };
      return Math.hypot(coords.x - customPoint.mapCoords.x, coords.y - customPoint.mapCoords.y) < 100;
    });
    if (matchedRegion) {
      setSelectedRegionId(matchedRegion.id);
    }
  };

  // Called when user picks a preset from the Inspector tool dropdown
  const handleSelectTarget = (target) => {
    setInspectedPoint(target);
    if (target.regionId) {
      setSelectedRegionId(target.regionId);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* =====================================================================
          MISSION CONTROL STATUS BAR
         ===================================================================== */}
      <div className={styles.missionStatusBar}>
        <div className={styles.statusIdentityGroup}>
          <div className={styles.orbitIndicator}>
            <span className={styles.orbitPulseRing} />
            <span className={styles.orbitDot} />
          </div>
          <div>
            <div className={styles.missionName}>
              MARS RECONNAISSANCE TELEMETRY • ELEVATION & SLOPE SCANNER
            </div>
            <div className={styles.missionSub}>
              Orbital Instrument: MRO HiRISE / MOLA Altimeter Model • Sol 412
            </div>
          </div>
        </div>

        <div className={styles.statusReadoutsGroup}>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>GLOBAL DATUM</span>
            <span className={styles.chipVal}>0 m Areoid Reference</span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>VISUALIZATION</span>
            <span className={styles.chipVal} style={{ color: '#f97316' }}>
              {mapMode.toUpperCase()}
            </span>
          </div>
          <div className={styles.statusChip}>
            <span className={styles.chipLabel}>ACTIVE SECTOR</span>
            <span className={styles.chipVal} style={{ color: '#38bdf8' }}>
              {selectedRegion ? selectedRegion.name.split(' - ')[0] : 'None'}
            </span>
          </div>
          <span className={styles.simulatedLivePill}>SIMULATED ENVIRONMENT</span>
        </div>
      </div>

      {/* =====================================================================
          MAP CONTROLS: MODE SWITCHER, SECTOR FOCUS & LAYER OVERLAYS
         ===================================================================== */}
      <MapLayerControls
        layers={layers}
        onToggleLayer={handleToggleLayer}
        regions={regions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={(id) => {
          setSelectedRegionId(id);
          setSelectedHazardId(null);
          const matchedTarget = RECON_TARGETS.find(t => t.regionId === id);
          if (matchedTarget) setInspectedPoint(matchedTarget);
        }}
        mapMode={mapMode}
        onChangeMapMode={(mode) => setMapMode(mode)}
      />

      {/* =====================================================================
          MAIN DASHBOARD WORKSPACE: 2-COLUMN RESPONSIVE LAYOUT
          LEFT (70%): Large Interactive Mars Terrain Map with Altimetry/Slope modes
          RIGHT (30%): Dedicated Elevation & Slope Information Panel
         ===================================================================== */}
      <div className={styles.workspaceGrid}>
        {/* Left Column: Interactive Map */}
        <div className={styles.mapWorkspaceCol}>
          <InteractiveTerrainMap
            regions={regions}
            hazards={hazards}
            selectedRegionId={selectedRegionId}
            onSelectRegion={(id) => {
              setSelectedRegionId(id);
              setSelectedHazardId(null);
              const matchedTarget = RECON_TARGETS.find(t => t.regionId === id);
              if (matchedTarget) setInspectedPoint(matchedTarget);
            }}
            selectedHazardId={selectedHazardId}
            onSelectHazard={handleSelectHazard}
            inspectedPoint={inspectedPoint}
            onInspectMapPoint={handleInspectMapPoint}
            mapMode={mapMode}
            highlightSlopeType={highlightSlopeType}
            layers={layers}
          />
        </div>

        {/* Right Column: Dedicated Terrain Information Panel */}
        <div className={styles.infoPanelCol}>
          <TerrainInfoPanel
            region={selectedRegion}
            hazards={hazards}
            selectedHazardId={selectedHazardId}
            onSelectHazard={handleSelectHazard}
            inspectedPoint={inspectedPoint}
            onSelectTarget={handleSelectTarget}
            onHighlightSlopeType={(slopeType) => setHighlightSlopeType(slopeType)}
          />
        </div>
      </div>
    </div>
  );
}
