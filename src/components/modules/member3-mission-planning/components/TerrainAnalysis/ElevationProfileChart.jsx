import React from 'react';
import styles from '../../styles/terrainAnalysis.module.css';

/**
 * Reusable visual elevation cross-section chart for the selected terrain sector.
 * Displays simulated elevation across distance (W to E transect).
 */
export default function ElevationProfileChart({ region }) {
  if (!region || !region.elevationProfile || region.elevationProfile.length === 0) {
    return null;
  }

  const profile = region.elevationProfile;
  const altitudes = profile.map(p => p.altM);
  const minAlt = Math.min(...altitudes);
  const maxAlt = Math.max(...altitudes);
  const altRange = Math.max(1, maxAlt - minAlt);

  const svgWidth = 360;
  const svgHeight = 130;
  const padLeft = 45;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Generate SVG path coordinates
  const points = profile.map((pt, idx) => {
    const x = padLeft + (idx / (profile.length - 1)) * chartW;
    const y = padTop + chartH - ((pt.altM - minAlt) / altRange) * chartH;
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Closed area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartHeader}>
        <span className={styles.chartTitle}>Simulated Elevation Cross-Section</span>
        <span className={styles.simulatedTag}>SIMULATED TRANSECT</span>
      </div>

      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        className={styles.chartSvg}
        aria-label="Simulated Mars elevation profile chart"
      >
        <defs>
          <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        <line 
          x1={padLeft} y1={padTop} 
          x2={svgWidth - padRight} y2={padTop} 
          stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" 
        />
        <line 
          x1={padLeft} y1={padTop + chartH / 2} 
          x2={svgWidth - padRight} y2={padTop + chartH / 2} 
          stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" 
        />
        <line 
          x1={padLeft} y1={padTop + chartH} 
          x2={svgWidth - padRight} y2={padTop + chartH} 
          stroke="#475569" strokeWidth="1" 
        />

        {/* Y Axis labels */}
        <text x={padLeft - 6} y={padTop + 4} textAnchor="end" className={styles.chartAxisLabel}>
          {maxAlt > 0 ? `+${maxAlt}m` : `${maxAlt}m`}
        </text>
        <text x={padLeft - 6} y={padTop + chartH / 2 + 3} textAnchor="end" className={styles.chartAxisLabel}>
          {Math.round((maxAlt + minAlt) / 2)}m
        </text>
        <text x={padLeft - 6} y={padTop + chartH} textAnchor="end" className={styles.chartAxisLabel}>
          {minAlt > 0 ? `+${minAlt}m` : `${minAlt}m`}
        </text>

        {/* Elevation Area & Line */}
        <path d={areaD} fill="url(#elevationGrad)" />
        <path d={pathD} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
            <title>{`${pt.point}: ${pt.altM}m at ${pt.distKm}km`}</title>
          </g>
        ))}

        {/* X Axis distance marks */}
        <text x={points[0].x} y={svgHeight - 6} textAnchor="start" className={styles.chartAxisLabel}>
          0 km (W)
        </text>
        <text x={points[points.length - 1].x} y={svgHeight - 6} textAnchor="end" className={styles.chartAxisLabel}>
          {points[points.length - 1].distKm} km (E)
        </text>
      </svg>

      <div className={styles.profileSummaryRow}>
        <span>Datum Min: <strong>{region.elevationMinMeters ? `${region.elevationMinMeters} m` : region.baseElevation}</strong></span>
        <span>Transect Peak: <strong>{region.elevationMaxMeters ? `${region.elevationMaxMeters} m` : region.baseElevation}</strong></span>
        <span>Net Relief: <strong>{altRange} m</strong></span>
      </div>
    </div>
  );
}
