import React from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Layer, Visualization Mode, and Sector Focus Controls
 */
export default function MapLayerControls({
  layers,
  onToggleLayer,
  regions,
  selectedRegionId,
  onSelectRegion,
  mapMode = 'elevation',
  onChangeMapMode
}) {
  return (
    <div className={styles.controlsBar}>
      {/* Map Mode Selector (Elevation vs Slope vs Roughness) */}
      <div className={styles.modeGroup}>
        <span className={styles.controlsGroupLabel}>Visual Mode:</span>
        <div className={styles.modeButtonsWrap}>
          <button
            type="button"
            className={`${styles.modeBtn} ${mapMode === 'elevation' ? styles.modeBtnActive : ''}`}
            onClick={() => onChangeMapMode && onChangeMapMode('elevation')}
          >
            🏔️ Elevation Altimetry
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${mapMode === 'slope' ? styles.modeBtnActive : ''}`}
            onClick={() => onChangeMapMode && onChangeMapMode('slope')}
          >
            📐 Slope Heatmap
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${mapMode === 'roughness' ? styles.modeBtnActive : ''}`}
            onClick={() => onChangeMapMode && onChangeMapMode('roughness')}
          >
            🪨 Uneven & Rocky
          </button>
        </div>
      </div>

      {/* Sector Quick Focus Buttons */}
      <div className={styles.focusGroup}>
        <span className={styles.controlsGroupLabel}>Focus Sector:</span>
        <div className={styles.focusButtonsWrap}>
          {regions.map((reg) => {
            const isSelected = reg.id === selectedRegionId;
            return (
              <button
                key={reg.id}
                type="button"
                className={`${styles.focusBtn} ${isSelected ? styles.focusBtnActive : ''}`}
                onClick={() => onSelectRegion(reg.id)}
              >
                {reg.name.split(' - ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Layers Toggles */}
      <div className={styles.layerTogglesGroup}>
        <span className={styles.controlsGroupLabel}>Overlays:</span>
        <div className={styles.toggleButtonsWrap}>
          <button
            type="button"
            className={`${styles.layerToggleBtn} ${layers.elevation ? styles.layerActive : ''}`}
            onClick={() => onToggleLayer('elevation')}
          >
            Topography
          </button>
          <button
            type="button"
            className={`${styles.layerToggleBtn} ${layers.roughness ? styles.layerActive : ''}`}
            onClick={() => onToggleLayer('roughness')}
          >
            Scree & Blockfield
          </button>
          <button
            type="button"
            className={`${styles.layerToggleBtn} ${layers.hazards ? styles.layerActive : ''}`}
            onClick={() => onToggleLayer('hazards')}
          >
            Hazards
          </button>
          <button
            type="button"
            className={`${styles.layerToggleBtn} ${layers.grid ? styles.layerActive : ''}`}
            onClick={() => onToggleLayer('grid')}
          >
            Datum Grid
          </button>
        </div>
      </div>
    </div>
  );
}
