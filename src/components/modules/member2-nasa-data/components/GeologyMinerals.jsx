import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  Droplets,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FlaskConical
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import {
  REGOLITH_CHEMICAL_COMPOSITION,
  MARS_MINERAL_REGISTRY
} from '../data/authenticNasaDatasets.js';

export default function GeologyMinerals({ onOpenSources }) {
  const [selectedMineral, setSelectedMineral] = useState(MARS_MINERAL_REGISTRY[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = ['ALL', 'Phyllosilicates (Hydrous Silicates)', 'Sulfates', 'Primary Igneous Silicate', 'Iron Oxide', 'Carbonates'];

  const filteredMinerals = MARS_MINERAL_REGISTRY.filter(m => {
    const matchesCat = filterCategory === 'ALL' || m.category === filterCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.keyLocations.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.waterSignificance.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h3 className="nasa-card-title">
              <Layers size={20} color="var(--mars-amber)" />
              Martian Geology, Mineralogy & Regolith Chemistry
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Mineral spectra mapped by MRO CRISM & elemental assays from MSL CheMin and Mars 2020 PIXL.
            </p>
          </div>
          <DataSourceBadge 
            source="NASA MRO CRISM & MSL CheMin" 
            instrument="Infrared Spectrometry & X-Ray Diffraction" 
            date="PDS Geosciences Archive"
            onClick={onOpenSources}
          />
        </div>

        {/* Critical Perchlorate Survival Alert Banner */}
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.35)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={24} color="var(--mars-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontFamily: 'var(--font-hud)', color: 'var(--mars-rose)', fontSize: '0.9rem', letterSpacing: '0.04em' }}>
                SURVIVAL HAZARD ADVISORY: REGOLITH PERCHLORATE TOXICITY (ClO₄⁻)
              </span>
              <span className="data-provenance-tag sample" style={{ borderColor: 'var(--mars-rose)', color: 'var(--mars-rose)', background: 'transparent' }}>
                NASA Phoenix / Curiosity Confirmed
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#fecdd3', lineHeight: '1.45' }}>
              NASA wet chemistry laboratories confirmed Martian regolith contains <strong>0.5% to 1.0% toxic perchlorate salts</strong> (Mg(ClO4)2, Ca(ClO4)2). Perchlorates severely disrupt human thyroid iodide uptake, damage lung tissues upon inhalation, and render raw Martian soil deadly to Earth crops. All soil used for greenhouse agriculture or habitat airlock re-entry must undergo aqueous rinse or microbial perchlorate remediation before exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Regolith Oxide Chemistry Breakdown */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <h4 className="nasa-card-title">
            <FlaskConical size={18} color="var(--mars-cyan)" />
            Average Martian Regolith Elemental Oxide Abundance (Weight %)
          </h4>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            NASA APXS / CheMin Ground Truth Calibration
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
          Basaltic crust dominated by silica and iron oxides (which give Mars its red color), with rich magnesium and sulfate content.
        </p>

        {/* Chemical Oxide Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {REGOLITH_CHEMICAL_COMPOSITION.map((item, idx) => {
            const isHazard = item.compound.includes('Perchlorates');
            const barWidth = Math.min(100, Math.max(2, item.percentWt * 2));
            return (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: `1px solid ${isHazard ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: isHazard ? 'var(--mars-rose)' : '#fff', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {item.compound}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      ({item.formula})
                    </span>
                  </div>
                  <span style={{ color: isHazard ? 'var(--mars-rose)' : 'var(--mars-cyan)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                    {item.percentWt} %
                  </span>
                </div>

                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      background: isHazard ? 'var(--mars-rose)' : 'linear-gradient(90deg, #e05a2b, #00f0ff)',
                      borderRadius: '3px'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.72rem', color: isHazard ? '#fda4af' : 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {item.role}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CRISM Mineral Explorer */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h4 className="nasa-card-title">
              <Sparkles size={18} color="var(--mars-amber)" />
              NASA MRO CRISM Key Mineral Signatures & In-Situ Resources
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Diagnostic NIR absorption bands (0.36 - 3.92 µm) and extraction potential
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--mars-cyan)' }}>
            Showing {filteredMinerals.length} of {MARS_MINERAL_REGISTRY.length} Minerals
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search mineral, location, or water significance..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem 0.5rem 2rem',
                color: '#fff',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '0.4rem' }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setFilterCategory(cat)}
                className="unit-toggle-btn"
                style={{
                  background: filterCategory === cat ? 'var(--mars-amber)' : 'rgba(255,255,255,0.06)',
                  color: filterCategory === cat ? '#000' : 'var(--text-secondary)',
                  borderRadius: '4px',
                  fontWeight: filterCategory === cat ? 'bold' : 'normal',
                  fontSize: '0.7rem'
                }}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Mineral Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {filteredMinerals.map((mineral, idx) => {
            const isSelected = selectedMineral.name === mineral.name;
            return (
              <div
                key={idx}
                onClick={() => setSelectedMineral(mineral)}
                style={{
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.3)',
                  border: `1px solid ${isSelected ? 'var(--mars-amber)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h5 style={{ margin: 0, fontFamily: 'var(--font-hud)', color: isSelected ? '#fff' : '#e2e8f0', fontSize: '0.88rem' }}>
                    {mineral.name}
                  </h5>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--mars-cyan)', background: 'rgba(0,240,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {mineral.category.split(' ')[0]}
                  </span>
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
                  Locations: {mineral.keyLocations}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {mineral.formationEra}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Mineral Deep Dive */}
        {selectedMineral && (
          <div style={{ background: 'rgba(14, 20, 32, 0.95)', border: '1px solid var(--mars-amber)', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-hud)', color: '#fff', fontSize: '1.05rem' }}>
                  {selectedMineral.name}
                </h4>
                <div style={{ fontSize: '0.74rem', color: 'var(--mars-amber)', fontFamily: 'var(--font-mono)' }}>
                  Category: {selectedMineral.category} • Spectral Band: {selectedMineral.spectralBandUm}
                </div>
              </div>
              <span className="data-provenance-tag verified">
                PDS CRISM Science Data Record
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--mars-cyan)', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                  <Droplets size={16} /> Water & Paleoclimate Significance:
                </div>
                <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.45' }}>
                  {selectedMineral.waterSignificance}
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--mars-green)', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                  <CheckCircle2 size={16} /> In-Situ Resource Utilization (ISRU):
                </div>
                <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.45' }}>
                  {selectedMineral.inSituResource}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="source-footer-bar">
          <span>Attribution: NASA / JHU-APL Compact Reconnaissance Imaging Spectrometer for Mars (CRISM)</span>
          <a href="https://crism.jhuapl.edu/" target="_blank" rel="noreferrer" className="source-link">
            JHU-APL CRISM Data Node <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
