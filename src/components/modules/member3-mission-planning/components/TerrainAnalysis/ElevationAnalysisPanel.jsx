import React, { useState } from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Categorizes Martian elevation relative to the Areoid (Martian 0m datum).
 */
export function classifyElevation(meters) {
  if (meters < -4000) {
    return {
      band: "Deep Basin / Trench",
      color: "#6366f1",
      desc: "Deep depression with higher atmospheric pressure and potential fog/ice condensation."
    };
  } else if (meters < -1000) {
    return {
      band: "Northern Lowlands",
      color: "#38bdf8",
      desc: "Sedimentary plains and crater floors with favorable rover landing and transit conditions."
    };
  } else if (meters < 3000) {
    return {
      band: "Cratered Highlands",
      color: "#ea580c",
      desc: "Ancient cratered crust near the planetary datum with moderate topographic relief."
    };
  } else {
    return {
      band: "Volcanic Mountain Peak",
      color: "#fca5a5",
      desc: "Extreme volcanic shield terrain with near-vacuum atmospheric density and sharp basalt scarps."
    };
  }
}

/**
 * Dedicated Elevation Analysis Component
 * Displays:
 * - Real-time elevation readings & datum offset
 * - Interactive Elevation Profile cross-section chart with hover inspection
 * - Color-coded hypsometric scale and altimetry bands
 * - Hypsometric relief summary
 */
export default function ElevationAnalysisPanel({ region }) {
  const [inspectedTransectIdx, setInspectedTransectIdx] = useState(null);

  if (!region) return null;

  const profile = region.elevationProfile || [];
  const elevM = region.elevationMeters || -2530;
  const minM = region.elevationMinMeters ?? -2680;
  const maxM = region.elevationMaxMeters ?? -2380;
  const relief = Math.abs(maxM - minM);
  const elevCategory = classifyElevation(elevM);

  const activeTransectPoint = inspectedTransectIdx !== null ? profile[inspectedTransectIdx] : null;

  // SVG dimensions for interactive cross-section
  const svgWidth = 360;
  const svgHeight = 140;
  const padLeft = 45;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const altitudes = profile.map(p => p.altM);
  const minAlt = Math.min(...altitudes, minM);
  const maxAlt = Math.max(...altitudes, maxM);
  const altRange = Math.max(1, maxAlt - minAlt);

  const points = profile.map((pt, idx) => {
    const x = padLeft + (idx / Math.max(1, profile.length - 1)) * chartW;
    const y = padTop + chartH - ((pt.altM - minAlt) / altRange) * chartH;
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`
    : '';

  return (
    <div className={styles.elevationAnalysisPanel}>
      <div className={styles.sectionHeaderRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={styles.sectionSubhead}>Topographic Elevation Altimetry</span>
          <span className={styles.simulatedTag}>SIMULATED MOLA ALTIMETRY</span>
        </div>
      </div>

      {/* Primary Elevation Highlight Cards */}
      <div className={styles.elevationStatsGrid}>
        <div className={styles.elevStatCard}>
          <span className={styles.elevStatLabel}>Base Sector Elevation</span>
          <span className={styles.elevStatVal} style={{ color: elevCategory.color }}>
            {region.baseElevation}
          </span>
          <span className={styles.elevStatBand}>{elevCategory.band}</span>
        </div>

        <div className={styles.elevStatCard}>
          <span className={styles.elevStatLabel}>Vertical Relief</span>
          <span className={styles.elevStatVal}>{relief.toLocaleString()} m</span>
          <span className={styles.elevStatBand}>Range: {minM}m to {maxM}m</span>
        </div>
      </div>

      {/* Interactive Elevation Cross-Section Chart */}
      <div className={styles.elevChartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartTitle}>Interactive Transect Profile (W → E)</span>
          <span className={styles.chartHoverHint}>Hover points to inspect</span>
        </div>

        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className={styles.chartSvg}
          role="img"
          aria-label="Interactive Mars Elevation Profile"
        >
          <defs>
            <linearGradient id="elevAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#080b13" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padLeft} y1={padTop} x2={svgWidth - padRight} y2={padTop} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padLeft} y1={padTop + chartH / 2} x2={svgWidth - padRight} y2={padTop + chartH / 2} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={padLeft} y1={padTop + chartH} x2={svgWidth - padRight} y2={padTop + chartH} stroke="#475569" strokeWidth="1" />

          {/* Y Axis text */}
          <text x={padLeft - 6} y={padTop + 4} textAnchor="end" className={styles.chartAxisLabel}>
            {maxAlt > 0 ? `+${maxAlt}m` : `${maxAlt}m`}
          </text>
          <text x={padLeft - 6} y={padTop + chartH / 2 + 3} textAnchor="end" className={styles.chartAxisLabel}>
            {Math.round((maxAlt + minAlt) / 2)}m
          </text>
          <text x={padLeft - 6} y={padTop + chartH} textAnchor="end" className={styles.chartAxisLabel}>
            {minAlt > 0 ? `+${minAlt}m` : `${minAlt}m`}
          </text>

          {/* Area & line */}
          <path d={areaD} fill="url(#elevAreaGradient)" />
          <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive Transect Points */}
          {points.map((pt, i) => {
            const isHovered = inspectedTransectIdx === i;
            return (
              <g 
                key={i} 
                onMouseEnter={() => setInspectedTransectIdx(i)}
                onMouseLeave={() => setInspectedTransectIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#38bdf8" strokeWidth="2" />
                )}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isHovered ? 5 : 3.5} 
                  fill={isHovered ? '#38bdf8' : '#ffffff'} 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                />
              </g>
            );
          })}

          {/* X axis labels */}
          {points.length > 0 && (
            <>
              <text x={points[0].x} y={svgHeight - 6} textAnchor="start" className={styles.chartAxisLabel}>
                0 km (West)
              </text>
              <text x={points[points.length - 1].x} y={svgHeight - 6} textAnchor="end" className={styles.chartAxisLabel}>
                {points[points.length - 1].distKm} km (East)
              </text>
            </>
          )}
        </svg>

        {/* Hovered Point Telemetry Readout */}
        {activeTransectPoint ? (
          <div className={styles.activePointBox}>
            <div>
              <strong style={{ color: '#38bdf8' }}>{activeTransectPoint.point}</strong> ({activeTransectPoint.distKm} km)
            </div>
            <div style={{ color: '#f8fafc', fontWeight: 600 }}>
              Simulated Elevation: {activeTransectPoint.altM > 0 ? `+${activeTransectPoint.altM} m` : `${activeTransectPoint.altM} m`}
            </div>
          </div>
        ) : (
          <div className={styles.activePointBoxPlaceholder}>
            Select or hover any waypoint along the transect above to view localized altitude telemetry.
          </div>
        )}
      </div>

      {/* Color-Coded Hypsometric Altimetry Legend */}
      <div className={styles.hypsometricLegendCard}>
        <span className={styles.legendTitle}>Martian Altimetry Spectrum (MOLA Datum Model):</span>
        <div className={styles.hypsometricGradientBar} />
        <div className={styles.hypsometricBandsList}>
          <div className={styles.bandItem}>
            <span className={styles.bandDot} style={{ background: '#1e1b4b' }} />
            <span>&lt; -6,000 m (Deep Impact Basins)</span>
          </div>
          <div className={styles.bandItem}>
            <span className={styles.bandDot} style={{ background: '#38bdf8' }} />
            <span>-4,000 to -2,000 m (Sedimentary Lowlands)</span>
          </div>
          <div className={styles.bandItem}>
            <span className={styles.bandDot} style={{ background: '#10b981' }} />
            <span>-2,000 to 0 m (Mean Datum Margin)</span>
          </div>
          <div className={styles.bandItem}>
            <span className={styles.bandDot} style={{ background: '#ea580c' }} />
            <span>0 to +4,000 m (Highlands / Volcanic Aprons)</span>
          </div>
          <div className={styles.bandItem}>
            <span className={styles.bandDot} style={{ background: '#fca5a5' }} />
            <span>&gt; +8,000 m (Tharsis & Olympus Volcanoes)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
