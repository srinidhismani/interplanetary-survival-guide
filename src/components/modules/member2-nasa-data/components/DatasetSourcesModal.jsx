import React from 'react';
import { X, Database, ShieldCheck, ExternalLink, BookOpen, Radio } from 'lucide-react';
import { DATASET_PROVENANCE_REGISTRY } from '../data/authenticNasaDatasets.js';

export default function DatasetSourcesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="nasa-modal-overlay" onClick={onClose}>
      <div className="nasa-modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(224, 90, 43, 0.3)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', background: 'rgba(224,90,43,0.2)', borderRadius: '8px', border: '1px solid var(--mars-red-primary)' }}>
              <Database size={20} color="var(--mars-red-primary)" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-hud)', margin: 0, fontSize: '1.15rem', color: '#fff' }}>
                NASA Scientific Data Provenance & Archive Registry
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Official mission citations, observation dates, and Planetary Data System (PDS) identifiers
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="nasa-btn-outline" 
            style={{ padding: '0.4rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '0.9rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.82rem', lineHeight: '1.5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--mars-cyan)', fontWeight: 'bold', marginBottom: '4px', fontFamily: 'var(--font-hud)' }}>
            <ShieldCheck size={16} /> Strict NASA Data Integrity Policy
          </div>
          <p style={{ margin: 0, color: '#cbd5e1' }}>
            Scientific Planetary Mission Standards: No measurements are invented. All physical constants, atmospheric pressures, thermal inertia values, regolith compositions, and topographic elevations are sourced directly from published NASA Planetary Data System (PDS) peer-reviewed archives and NASA Goddard Space Flight Center fact sheets. Demonstration or test data is always explicitly marked with a distinct badge.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {DATASET_PROVENANCE_REGISTRY.map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(14, 20, 32, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-hud)', color: 'var(--mars-red-primary)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>
                  {item.moduleCategory}
                </span>
                <span className="data-provenance-tag verified">
                  <ShieldCheck size={12} /> {item.status}
                </span>
              </div>

              <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>
                {item.datasetName}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Originating Agency:</strong> {item.originatingAgency}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Mission:</strong> {item.spacecraftMission}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Observation Timeframe:</strong> {item.observationDates}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Mars Epoch / Season:</strong> {item.marsTimeFrame}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {item.instruments.map((inst, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                    {inst}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                <a 
                  href={item.accessUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--mars-cyan)', textDecoration: 'none', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}
                >
                  PDS Archive Node Repository <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button onClick={onClose} className="nasa-btn nasa-btn-primary" style={{ minWidth: '140px' }}>
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
}
