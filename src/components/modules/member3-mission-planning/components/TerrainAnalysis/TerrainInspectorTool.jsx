import React from 'react';
import styles from '../../styles/terrainAnalysis.module.css';
import { degreesToGradePercent, classifySlope } from './SlopeAnalysisPanel';

/**
 * Predefined Martian Reconnaissance Sampling Locations
 */
export const RECON_TARGETS = [
  {
    id: 'target-01',
    name: 'Jezero Delta Front Terraces',
    regionId: 'reg-01',
    lat: '18.38°N',
    lon: '77.58°E',
    mapCoords: { x: 440, y: 220 },
    elevationM: -2530,
    slopeDeg: 4.2,
    terrainType: 'Sedimentary Terraces with Clay Bedrock',
    roughness: 'Moderate (0.35m boulder dispersion)',
    unevenIndex: '35 / 100'
  },
  {
    id: 'target-02',
    name: 'Olympus Mons Basaltic Apron',
    regionId: 'reg-02',
    lat: '18.65°N',
    lon: '226.20°E',
    mapCoords: { x: 190, y: 215 },
    elevationM: 8200,
    slopeDeg: 14.8,
    terrainType: 'Extrusive Basalt Sheets & Sharp Scoria',
    roughness: 'High (0.85m jagged vesicular blocks)',
    unevenIndex: '82 / 100'
  },
  {
    id: 'target-03',
    name: 'Valles Marineris Trench Axis',
    regionId: 'reg-03',
    lat: '6.52°S',
    lon: '284.10°E',
    mapCoords: { x: 310, y: 310 },
    elevationM: -4120,
    slopeDeg: 8.5,
    terrainType: 'Hydrated Sulfate Strata & Loose Scree',
    roughness: 'High-Variable (deep gullies)',
    unevenIndex: '68 / 100'
  },
  {
    id: 'target-04',
    name: 'Utopia Permafrost Lowlands',
    regionId: 'reg-04',
    lat: '46.70°N',
    lon: '117.50°E',
    mapCoords: { x: 570, y: 130 },
    elevationM: -3850,
    slopeDeg: 1.1,
    terrainType: 'Uniform Regolith over Subsurface Ice',
    roughness: 'Low (0.12m smooth pebble field)',
    unevenIndex: '12 / 100'
  },
  {
    id: 'target-05',
    name: 'Olympus Mons Rupes Scarp (Extreme)',
    regionId: 'reg-02',
    lat: '18.80°N',
    lon: '225.80°E',
    mapCoords: { x: 175, y: 200 },
    elevationM: 12400,
    slopeDeg: 28.5,
    terrainType: 'Vertical Basalt Cliff & Talus Slump',
    roughness: 'Extreme Blockfield',
    unevenIndex: '95 / 100'
  }
];

/**
 * Interactive Terrain Location Inspector Tool
 * Allows fine-grained inspection of selected points on Mars.
 */
export default function TerrainInspectorTool({
  inspectedPoint,
  onSelectTarget
}) {
  const currentTarget = inspectedPoint || RECON_TARGETS[0];

  const slopeDeg = currentTarget.slopeDeg || 4.0;
  const gradePct = degreesToGradePercent(slopeDeg);
  const classification = classifySlope(slopeDeg);
  const elevM = currentTarget.elevationM || -2500;

  return (
    <div className={styles.inspectorContainer}>
      <div className={styles.sectionHeaderRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={styles.sectionSubhead}>Interactive Location Inspector</span>
          <span className={styles.simulatedTag}>SIMULATED SENSOR PROBE</span>
        </div>
      </div>

      {/* Target Selector Dropdown / Quick Buttons */}
      <div className={styles.inspectorPresetWrap}>
        <label htmlFor="recon-target-select" className={styles.inspectorLabel}>
          Preset Recon Sites:
        </label>
        <select
          id="recon-target-select"
          className={styles.inspectorSelect}
          value={currentTarget.id || ''}
          onChange={(e) => {
            const found = RECON_TARGETS.find(t => t.id === e.target.value);
            if (found && onSelectTarget) {
              onSelectTarget(found);
            }
          }}
        >
          {RECON_TARGETS.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.lat}, {t.lon})
            </option>
          ))}
        </select>
      </div>

      {/* Active Inspector Telemetry Card */}
      <div className={styles.inspectorTelemetryCard}>
        <div className={styles.inspectorTitleRow}>
          <div>
            <h4 className={styles.targetName}>{currentTarget.name}</h4>
            <span className={styles.targetCoord}>📍 {currentTarget.lat}, {currentTarget.lon}</span>
          </div>
          <span 
            className={styles.slopeCategoryBadge}
            style={{ 
              color: classification.color, 
              backgroundColor: classification.bg,
              borderColor: classification.border
            }}
          >
            ● {classification.category}
          </span>
        </div>

        {/* Telemetry Numbers Grid */}
        <div className={styles.inspectorGrid}>
          <div className={styles.inspectorCell}>
            <span className={styles.cellLabel}>Simulated Elevation</span>
            <span className={styles.cellVal} style={{ color: elevM > 0 ? '#fca5a5' : '#38bdf8' }}>
              {elevM > 0 ? `+${elevM.toLocaleString()} m` : `${elevM.toLocaleString()} m`}
            </span>
            <span className={styles.cellSub}>
              {elevM > 0 ? 'Above Mean Datum' : 'Below Mean Datum'}
            </span>
          </div>

          <div className={styles.inspectorCell}>
            <span className={styles.cellLabel}>Slope Incline</span>
            <span className={styles.cellVal} style={{ color: classification.color }}>
              {slopeDeg.toFixed(1)}°
            </span>
            <span className={styles.cellSub}>
              {gradePct}% Slope Grade
            </span>
          </div>

          <div className={styles.inspectorCell}>
            <span className={styles.cellLabel}>Surface Roughness</span>
            <span className={styles.cellVal}>{currentTarget.unevenIndex || '45 / 100'}</span>
            <span className={styles.cellSub}>Uneven Terrain Index</span>
          </div>

          <div className={styles.inspectorCell}>
            <span className={styles.cellLabel}>Traction Rating</span>
            <span className={styles.cellVal} style={{ color: classification.color }}>
              {classification.code === 'flat' ? 'High' : classification.code === 'moderate' ? 'Moderate' : 'Low / Slip Risk'}
            </span>
            <span className={styles.cellSub}>Wheel Grip Margin</span>
          </div>
        </div>

        {/* Geological Description */}
        <div className={styles.targetGeoBox}>
          <strong>Geological Lithology:</strong> {currentTarget.terrainType}
          <div style={{ marginTop: '0.25rem', color: '#94a3b8' }}>
            <strong>Obstacle Density:</strong> {currentTarget.roughness}
          </div>
        </div>

        {/* Operational Guidance */}
        <div className={styles.targetGuidanceBox}>
          <strong>Robotic Mobility Guidance:</strong> {classification.roverProtocol}
        </div>
      </div>
    </div>
  );
}
