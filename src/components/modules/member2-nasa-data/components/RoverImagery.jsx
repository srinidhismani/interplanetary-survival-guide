import React, { useState, useEffect } from 'react';
import {
  Camera,
  Search,
  Filter,
  Radio,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Maximize2,
  X,
  Compass,
  Calendar
} from 'lucide-react';
import DataSourceBadge from './DataSourceBadge.jsx';
import { nasaApiService } from '../services/nasaApiService.js';
import { VERIFIED_ROVER_ARCHIVE } from '../data/authenticNasaDatasets.js';

export default function RoverImagery({ onOpenSources }) {
  const [selectedRover, setSelectedRover] = useState('perseverance');
  const [solInput, setSolInput] = useState(892);
  const [cameraFilter, setCameraFilter] = useState('ALL');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Initial load
  useEffect(() => {
    handleQueryPhotos();
  }, [selectedRover]);

  const handleQueryPhotos = async () => {
    setIsLoading(true);
    try {
      const res = await nasaApiService.fetchRoverPhotos({
        rover: selectedRover,
        sol: solInput,
        camera: cameraFilter === 'ALL' ? null : cameraFilter,
        apiKey: apiKeyInput.trim() || undefined
      });
      setQueryResult(res);
    } catch (err) {
      console.error(err);
      setQueryResult(nasaApiService.getFallbackRoverPhotos(selectedRover, solInput, err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const cameras = selectedRover === 'perseverance'
    ? ['ALL', 'NAVCAM_LEFT', 'NAVCAM_RIGHT', 'FRONT_HAZCAM_LEFT_A', 'MCZ_LEFT', 'MCZ_RIGHT', 'SKYCAM']
    : ['ALL', 'FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="nasa-card">
        <div className="nasa-card-header">
          <div>
            <h3 className="nasa-card-title">
              <Camera size={20} color="var(--mars-green)" />
              NASA Mars Rover In-Situ Imagery & Observations
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Multispectral stereo panoramas and scientific observations from Perseverance & Curiosity.
            </p>
          </div>
          <DataSourceBadge 
            source="NASA Open API & JPL-Caltech Image Archive" 
            instrument="Mastcam-Z / SuperCam / Navcam" 
            date="Live API & Ground Truth"
            onClick={onOpenSources}
          />
        </div>

        {/* API Control Bar */}
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Rover Spacecraft
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className={`unit-toggle-btn ${selectedRover === 'perseverance' ? 'active' : ''}`}
                onClick={() => setSelectedRover('perseverance')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '4px' }}
              >
                Perseverance
              </button>
              <button
                className={`unit-toggle-btn ${selectedRover === 'curiosity' ? 'active' : ''}`}
                onClick={() => setSelectedRover('curiosity')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '4px' }}
              >
                Curiosity
              </button>
            </div>
          </div>

          <div style={{ width: '110px' }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Target Sol
            </label>
            <input 
              type="number"
              value={solInput}
              onChange={e => setSolInput(Number(e.target.value))}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '4px',
                padding: '0.45rem 0.6rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem'
              }}
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Camera Filter
            </label>
            <select
              value={cameraFilter}
              onChange={e => setCameraFilter(e.target.value)}
              style={{
                width: '100%',
                background: '#0b101b',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '4px',
                padding: '0.45rem 0.6rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem'
              }}
            >
              {cameras.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              NASA API Key (Optional)
            </label>
            <input 
              type="text"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="Defaults to DEMO_KEY"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '4px',
                padding: '0.45rem 0.6rem',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem'
              }}
            />
          </div>

          <button
            onClick={handleQueryPhotos}
            disabled={isLoading}
            className="nasa-btn nasa-btn-primary"
            style={{ padding: '0.55rem 1.15rem' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Querying...
              </>
            ) : (
              <>
                <Search size={14} /> Query NASA Telemetry
              </>
            )}
          </button>
        </div>

        {/* Query status notification */}
        {queryResult && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.85rem', padding: '0.5rem 0.75rem', background: queryResult.isLive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', borderRadius: '6px', border: `1px solid ${queryResult.isLive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`, fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {queryResult.isLive ? (
                <ShieldCheck size={14} color="#34d399" />
              ) : (
                <AlertCircle size={14} color="#fbbf24" />
              )}
              <span style={{ color: queryResult.isLive ? '#34d399' : '#fbbf24' }}>
                {queryResult.isLive ? 'LIVE NASA OPEN API TELEMETRY' : 'VERIFIED GROUND TRUTH ARCHIVE'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span style={{ color: '#cbd5e1' }}>
                {queryResult.photos.length} observations indexed
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              {queryResult.rateLimitNotice}
            </div>
          </div>
        )}
      </div>

      {/* Imagery Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {queryResult?.photos?.map((photo, idx) => (
          <div 
            key={idx}
            className="nasa-card"
            style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
          >
            {/* Image banner with overlay */}
            <div 
              style={{ position: 'relative', width: '100%', height: '220px', background: '#05070c', cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => setActivePhotoModal(photo)}
            >
              <img 
                src={photo.thumbnailUrl || photo.imageUrl} 
                alt={photo.caption}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onError={(e) => {
                  // Fallback to NASA test pattern or placeholder if NASA assets domain is blocked
                  e.target.src = "https://images-assets.nasa.gov/image/PIA25680/PIA25680~medium.jpg";
                }}
              />
              <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '4px' }}>
                <span className="data-provenance-tag verified" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.65)' }}>
                  SOL {photo.sol}
                </span>
                <span className="data-provenance-tag" style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.65)', color: '#38bdf8' }}>
                  {photo.rover}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#fff', backdropFilter: 'blur(4px)' }}>
                <Maximize2 size={12} /> Click to Expand
              </div>
            </div>

            {/* Photo metadata */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>{photo.instrument}</span>
                  <span>{photo.earthDate}</span>
                </div>

                <h5 style={{ margin: '0 0 0.4rem 0', fontFamily: 'var(--font-hud)', fontSize: '0.9rem', color: '#fff' }}>
                  {photo.landingSite}
                </h5>

                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  {photo.caption}
                </p>

                {photo.scienceObjective && (
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '2px solid var(--mars-cyan)', padding: '0.4rem 0.6rem', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                    <strong style={{ color: 'var(--mars-cyan)' }}>Science Objective:</strong> {photo.scienceObjective}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>{photo.sourceAttribution}</span>
                <span style={{ color: 'var(--mars-red-primary)' }}>ID: {photo.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal for high-res inspection */}
      {activePhotoModal && (
        <div className="nasa-modal-overlay" onClick={() => setActivePhotoModal(null)}>
          <div className="nasa-modal-box" style={{ maxWidth: '1000px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="data-provenance-tag verified">
                  NASA PDS Observation Archive
                </span>
                <span style={{ fontFamily: 'var(--font-hud)', color: '#fff', fontSize: '0.95rem' }}>
                  {activePhotoModal.rover} • Sol {activePhotoModal.sol}
                </span>
              </div>
              <button 
                onClick={() => setActivePhotoModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ width: '100%', maxHeight: '60vh', overflow: 'hidden', borderRadius: '8px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <img 
                src={activePhotoModal.imageUrl} 
                alt={activePhotoModal.caption}
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>

            <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--mars-red-primary)', display: 'block', marginBottom: '4px' }}>Observation Caption:</strong>
              {activePhotoModal.caption}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
              <div><strong>Instrument:</strong> {activePhotoModal.instrument}</div>
              <div><strong>Earth Date:</strong> {activePhotoModal.earthDate}</div>
              <div><strong>Attribution:</strong> {activePhotoModal.sourceAttribution}</div>
              <div><strong>PDS ID:</strong> {activePhotoModal.pdsIdentifier}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <a 
                href={activePhotoModal.imageUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="nasa-btn nasa-btn-primary"
                style={{ fontSize: '0.78rem' }}
              >
                Open Full Resolution Source Image <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
