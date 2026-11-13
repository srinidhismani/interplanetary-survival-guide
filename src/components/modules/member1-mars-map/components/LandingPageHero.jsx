// NASA-Inspired Landing Page Hero & Exploration Statistics HUD
// Member 1 - Interactive Mars Map Module

import React from 'react';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import {
  Sparkles,
  MapPin,
  Radio,
  Clock,
  Compass,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';

export default function LandingPageHero({ onOpenCatalog }) {
  const { locations, flyTo } = useMarsMission();

  const featuredQuickJumps = [
    { id: 'jezero-crater', label: 'Jezero Delta (Perseverance)' },
    { id: 'arcadia-planitia', label: 'Arcadia Glaciers (Starship Base)' },
    { id: 'olympus-mons', label: 'Olympus Mons (21.9 km Peak)' },
    { id: 'valles-marineris', label: 'Valles Marineris (Grand Canyon)' },
    { id: 'hellas-planitia', label: 'Hellas Basin (Deepest Lowland)' }
  ];

  return (
    <div className="nasa-landing-hero-banner">
      <div className="hero-content-wrapper">
        {/* Top Mission Tagline */}
        <div className="hero-tagline-row">
          <div className="nasa-mission-badge">
            <span className="badge-pulse-dot" />
            <span>NASA / JPL AREOCENTRIC SURFACE SYSTEM</span>
          </div>
          <div className="hero-latency-badge hidden-mobile">
            <Radio className="w-3.5 h-3.5 text-cyan-400 mr-1.5 animate-pulse" />
            <span>Earth-Mars Deep Space Delay: 00:14:18 (248.2M km)</span>
          </div>
        </div>

        {/* Hero Title & Synopsis */}
        <div className="hero-title-group">
          <h1 className="hero-main-title">
            INTERPLANETARY SURVIVAL GUIDE
            <span className="hero-title-highlight"> // MARTIAN SURFACE CARTOGRAPHY</span>
          </h1>
          <p className="hero-description">
            High-precision interactive planetary exploration terminal. Navigate multi-spectral optical mosaics, inspect 
            topographic elevation, survey subsurface water-ice glaciers, and assess survival viability for future human colonization.
          </p>
        </div>

        {/* Exploration Dashboard Quick Telemetry Counters */}
        <div className="hero-metrics-grid">
          <div className="hero-metric-card">
            <div className="metric-header">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>SURFACE MAPPED</span>
            </div>
            <div className="metric-value font-mono">144.8M km²</div>
            <div className="metric-sub">100% Global Coverage</div>
          </div>

          <div className="hero-metric-card">
            <div className="metric-header">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>SURVIVAL WAYPOINTS</span>
            </div>
            <div className="metric-value font-mono">{locations.length}+ SITES</div>
            <div className="metric-sub">Rovers, Ice & Bases</div>
          </div>

          <div className="hero-metric-card">
            <div className="metric-header">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>ACTIVE SURFACE ASSETS</span>
            </div>
            <div className="metric-value font-mono">3 ROVERS</div>
            <div className="metric-sub">Perseverance & Curiosity</div>
          </div>

          <div className="hero-metric-card hidden-mobile">
            <div className="metric-header">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>PLANETARY ROTATION</span>
            </div>
            <div className="metric-value font-mono">24h 39m 35s</div>
            <div className="metric-sub">1 Martian Sol</div>
          </div>
        </div>

        {/* Quick Location Jump Links Bar */}
        <div className="quick-jump-row">
          <span className="quick-jump-label">QUICK TARGET LOCK:</span>
          <div className="quick-jump-chips">
            {featuredQuickJumps.map((item) => {
              const loc = locations.find((l) => l.id === item.id);
              if (!loc) return null;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="quick-jump-chip"
                  onClick={() => flyTo(loc)}
                >
                  <MapPin className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="browse-catalog-btn"
            onClick={onOpenCatalog}
          >
            <Database className="w-3.5 h-3.5 mr-1" />
            Landmark Directory
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
