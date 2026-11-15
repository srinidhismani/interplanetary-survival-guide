import React, { useState } from 'react';
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Thermometer,
  Wind,
  Mountain,
  Calendar,
  Info
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import {
  MEDA_7SOL_WEATHER_RECORDS,
  ANNUAL_ATMOSPHERIC_PRESSURE_CYCLE,
  MOLA_TOPOGRAPHY_BENCHMARKS,
  REGOLITH_CHEMICAL_COMPOSITION
} from '../data/authenticNasaDatasets.js';

export default function DataVisualizer({ onOpenSources, unit = 'C', tempConvert }) {
  const [activeChart, setActiveChart] = useState('diurnal-temp');
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Chart 1: Diurnal Temperatures (MEDA 7-Sol)
  const renderDiurnalTempChart = () => {
    const data = MEDA_7SOL_WEATHER_RECORDS;
    const minTemp = -95;
    const maxTemp = 20;

    const getY = (val) => {
      const normalized = (val - minTemp) / (maxTemp - minTemp);
      return padding.top + graphHeight - normalized * graphHeight;
    };

    const getX = (index) => {
      return padding.left + (index / (data.length - 1)) * graphWidth;
    };

    const groundMaxPoints = data.map((d, i) => `${getX(i)},${getY(d.tempGroundMaxC)}`).join(' ');
    const airMaxPoints = data.map((d, i) => `${getX(i)},${getY(d.tempAirMaxC)}`).join(' ');
    const airMinPoints = data.map((d, i) => `${getX(i)},${getY(d.tempAirMinC)}`).join(' ');
    const groundMinPoints = data.map((d, i) => `${getX(i)},${getY(d.tempGroundMinC)}`).join(' ');

    return (
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
          <defs>
            <linearGradient id="grid-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e05a2b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect x={padding.left} y={padding.top} width={graphWidth} height={graphHeight} fill="url(#grid-grad)" />

          {/* Horizontal grid lines */}
          {[-80, -60, -40, -20, 0, 20].map((t) => {
            const y = getY(t);
            return (
              <g key={t}>
                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <text x={padding.left - 10} y={y + 4} fill="#64748b" fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">
                  {t}°C
                </text>
              </g>
            );
          })}

          {/* X Axis Sol labels */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <g key={i}>
                <line x1={x} y1={padding.top} x2={x} y2={padding.top + graphHeight} stroke="rgba(255,255,255,0.05)" />
                <text x={x} y={svgHeight - 12} fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="var(--font-mono)">
                  Sol {d.sol}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <polyline fill="none" stroke="#e05a2b" strokeWidth="2.5" points={groundMaxPoints} />
          <polyline fill="none" stroke="#fbbf24" strokeWidth="2" points={airMaxPoints} />
          <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points={airMinPoints} />
          <polyline fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="4 2" points={groundMinPoints} />

          {/* Interactive point circles */}
          {data.map((d, i) => {
            const x = getX(i);
            const yGroundMax = getY(d.tempGroundMaxC);
            const yAirMin = getY(d.tempAirMinC);
            return (
              <g key={i}>
                <circle 
                  cx={x} 
                  cy={yGroundMax} 
                  r="5" 
                  fill="#e05a2b" 
                  stroke="#fff" 
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredDataPoint({
                    title: `Sol ${d.sol} (${d.earthDate})`,
                    detail: `Ground Peak: ${tempConvert(d.tempGroundMaxC)} | Air Max: ${tempConvert(d.tempAirMaxC)} | Air Min: ${tempConvert(d.tempAirMinC)} | Ground Min: ${tempConvert(d.tempGroundMinC)}`
                  })}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />
                <circle 
                  cx={x} 
                  cy={yAirMin} 
                  r="4" 
                  fill="#38bdf8" 
                  stroke="#fff" 
                  strokeWidth="1"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredDataPoint({
                    title: `Sol ${d.sol} (${d.earthDate})`,
                    detail: `Air Min: ${tempConvert(d.tempAirMinC)} | Ground Min: ${tempConvert(d.tempGroundMinC)}`
                  })}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: '#e05a2b' }} /> Ground Max (TIRS skin)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: '#fbbf24' }} /> Air Max (ATS 1.5m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: '#38bdf8' }} /> Air Min
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: '#818cf8', borderBottom: '1px dashed' }} /> Ground Min (Pre-dawn freeze)
          </span>
        </div>
      </div>
    );
  };

  // Chart 2: Annual CO2 Atmospheric Pressure (L_s 0°-360°)
  const renderPressureCycleChart = () => {
    const data = ANNUAL_ATMOSPHERIC_PRESSURE_CYCLE;
    const minP = 650;
    const maxP = 950;

    const getY = (p) => padding.top + graphHeight - ((p - minP) / (maxP - minP)) * graphHeight;
    const getX = (i) => padding.left + (i / (data.length - 1)) * graphWidth;

    const points = data.map((d, i) => `${getX(i)},${getY(d.globalPressurePa)}`).join(' ');
    const areaPoints = `${padding.left},${padding.top + graphHeight} ${points} ${padding.left + graphWidth},${padding.top + graphHeight}`;

    return (
      <div>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
          <defs>
            <linearGradient id="pressure-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[700, 750, 800, 850, 900].map(p => {
            const y = getY(p);
            return (
              <g key={p}>
                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <text x={padding.left - 10} y={y + 4} fill="#64748b" fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">
                  {p} Pa
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <polygon fill="url(#pressure-grad)" points={areaPoints} />

          {/* Line */}
          <polyline fill="none" stroke="#00f0ff" strokeWidth="3" points={points} />

          {/* Dots */}
          {data.map((d, i) => {
            const x = getX(i);
            const y = getY(d.globalPressurePa);
            return (
              <g key={i}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r="5" 
                  fill="#00f0ff" 
                  stroke="#fff" 
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredDataPoint({
                    title: d.season,
                    detail: `Global Pressure: ${d.globalPressurePa} Pa (${(d.globalPressurePa/100).toFixed(2)} mbar) - ${d.description}`
                  })}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />
                <text x={x} y={svgHeight - 12} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                  L_s {d.ls}°
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Atmospheric mass fluctuates by 25% due to polar CO2 dry-ice cap freeze/sublimation cycle
        </div>
      </div>
    );
  };

  // Chart 3: Topography vs Elevation & Pressure Profile
  const renderTopographyChart = () => {
    const data = MOLA_TOPOGRAPHY_BENCHMARKS;
    const minElev = -8000;
    const maxElev = 22000;

    const getY = (elev) => padding.top + graphHeight - ((elev - minElev) / (maxElev - minElev)) * graphHeight;
    const barWidth = graphWidth / data.length - 8;

    return (
      <div>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="chart-svg">
          {/* Zero Datum Line */}
          {(() => {
            const zeroY = getY(0);
            return (
              <g>
                <line x1={padding.left} y1={zeroY} x2={svgWidth - padding.right} y2={zeroY} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x={svgWidth - padding.right} y={zeroY - 6} fill="#fbbf24" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                  0m Datum (610.5 Pa)
                </text>
              </g>
            );
          })()}

          {/* Elevation bars */}
          {data.map((item, i) => {
            const x = padding.left + i * (barWidth + 8) + 4;
            const zeroY = getY(0);
            const itemY = getY(item.elevationMeters);
            const isAbove = item.elevationMeters >= 0;
            const barH = Math.abs(zeroY - itemY);
            const topY = isAbove ? itemY : zeroY;

            return (
              <g key={i}>
                <rect 
                  x={x}
                  y={topY}
                  width={barWidth}
                  height={Math.max(4, barH)}
                  fill={isAbove ? 'rgba(224, 90, 43, 0.7)' : 'rgba(0, 240, 255, 0.7)'}
                  rx="3"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredDataPoint({
                    title: item.name,
                    detail: `Elevation: ${item.elevationMeters} m (${item.elevationKm} km) | Pressure: ${item.surfacePressurePa} Pa | Radiation Multiplier: ${item.radiationExposureMultiplier}x`
                  })}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                />
                <text 
                  x={x + barWidth / 2} 
                  y={svgHeight - 12} 
                  fill="#94a3b8" 
                  fontSize="9" 
                  textAnchor="middle" 
                  fontFamily="var(--font-mono)"
                >
                  {item.name.split(' ')[0].substring(0, 5)}
                </text>
              </g>
            );
          })}
        </svg>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', background: '#e05a2b', borderRadius: '2px' }} /> Volcanoes / Highlands (&gt; 0m datum)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', background: '#00f0ff', borderRadius: '2px' }} /> Basins / Canyons (&lt; 0m datum)
          </span>
        </div>
      </div>
    );
  };

  // Chart 4: Regolith Composition
  const renderRegolithChart = () => {
    const data = REGOLITH_CHEMICAL_COMPOSITION.slice(0, 8); // Top oxides
    const maxVal = 50;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
        {data.map((item, idx) => {
          const widthPercent = (item.percentWt / maxVal) * 100;
          const isPerchlorate = item.compound.includes('Perchlorates');
          return (
            <div 
              key={idx}
              style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}
              onMouseEnter={() => setHoveredDataPoint({
                title: item.compound,
                detail: `${item.formula} (${item.percentWt} wt%): ${item.role}`
              })}
              onMouseLeave={() => setHoveredDataPoint(null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: isPerchlorate ? 'var(--mars-rose)' : '#fff' }}>{item.compound}</span>
                <span style={{ color: isPerchlorate ? 'var(--mars-rose)' : 'var(--mars-cyan)', fontWeight: 'bold' }}>{item.percentWt}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${widthPercent}%`,
                    height: '100%',
                    background: isPerchlorate ? 'var(--mars-rose)' : 'linear-gradient(90deg, #e05a2b, #38bdf8)',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h3 className="nasa-card-title">
              <LineChart size={20} color="var(--mars-cyan)" />
              NASA Scientific Analytical Charts & Data Visualizations
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Interactive time-series, pressure cycles, topographical altimetry, and regolith assays.
            </p>
          </div>
          <DataSourceBadge 
            source="Perseverance MEDA, MGS MOLA & MRO CRISM" 
            instrument="Integrated Multi-Mission Science Archive" 
            date="PDS Calibrated Level 3"
            onClick={onOpenSources}
          />
        </div>

        {/* Chart Selector Buttons */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActiveChart('diurnal-temp')}
            className={`nasa-tab-btn ${activeChart === 'diurnal-temp' ? 'active' : ''}`}
          >
            <Thermometer size={14} /> Diurnal Temperature Swings (7 Sols)
          </button>
          <button
            onClick={() => setActiveChart('pressure-cycle')}
            className={`nasa-tab-btn ${activeChart === 'pressure-cycle' ? 'active' : ''}`}
          >
            <Wind size={14} /> Annual CO₂ Pressure Cycle (L_s 0°-360°)
          </button>
          <button
            onClick={() => setActiveChart('topography')}
            className={`nasa-tab-btn ${activeChart === 'topography' ? 'active' : ''}`}
          >
            <Mountain size={14} /> MOLA Elevation Profile Benchmarks
          </button>
          <button
            onClick={() => setActiveChart('regolith')}
            className={`nasa-tab-btn ${activeChart === 'regolith' ? 'active' : ''}`}
          >
            <Layers size={14} /> Regolith Mineral Oxide Assays
          </button>
        </div>

        {/* Hover inspection pill */}
        <div style={{ minHeight: '38px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '6px', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <Activity size={14} color="var(--mars-cyan)" />
          {hoveredDataPoint ? (
            <div>
              <strong style={{ color: '#fff', marginRight: '6px' }}>{hoveredDataPoint.title}:</strong>
              <span style={{ color: 'var(--mars-cyan)' }}>{hoveredDataPoint.detail}</span>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              Hover over graph data points or bars for real-time telemetry readout...
            </span>
          )}
        </div>

        {/* Chart Area */}
        <div className="chart-container" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' }}>
          {activeChart === 'diurnal-temp' && renderDiurnalTempChart()}
          {activeChart === 'pressure-cycle' && renderPressureCycleChart()}
          {activeChart === 'topography' && renderTopographyChart()}
          {activeChart === 'regolith' && renderRegolithChart()}
        </div>

        <div className="source-footer-bar">
          <span>Observation Dates: MEDA Sol 915-921 (Sept 2023) | MOLA Global Grid | CRISM Spectral Node</span>
          <button onClick={onOpenSources} className="nasa-btn-outline" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
            Full Provenance Log
          </button>
        </div>
      </div>
    </div>
  );
}
