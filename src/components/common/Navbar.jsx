// NASA Aerospace Responsive Navigation Bar
// Connects the three modules of the Interplanetary Survival Guide project

import React, { useState } from 'react';
import { Compass, Radio, Route, Menu, X, Satellite, ShieldCheck } from 'lucide-react';
import './common.css';

export default function Navbar({ activeModule, onSelectModule }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modules = [
    {
      id: 'member1-map',
      label: 'Interactive Mars Map',
      tag: 'Member 1',
      icon: Compass,
      featured: true
    },
    {
      id: 'member2-nasa',
      label: 'NASA Data & Weather',
      tag: 'Member 2',
      icon: Radio
    },
    {
      id: 'member3-planning',
      label: 'Mission Planning',
      tag: 'Member 3',
      icon: Route
    }
  ];

  return (
    <header className="nasa-app-header">
      <div className="navbar-container">
        {/* Brand & Project Identity */}
        <div className="navbar-brand">
          <div className="brand-logo-hex">
            <Satellite className="w-5 h-5 text-orange-400" />
          </div>
          <div className="brand-titles">
            <span className="brand-agency">NASA // JPL EXPLORATION</span>
            <span className="brand-project">Interplanetary Survival Guide</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectModule(m.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{m.label}</span>
                <span className={`member-tag ${isActive ? 'active-tag' : ''}`}>{m.tag}</span>
              </button>
            );
          })}
        </nav>

        {/* Telemetry Status Indicator */}
        <div className="navbar-status-indicator hidden-mobile">
          <span className="telemetry-live-dot" />
          <span className="telemetry-label font-mono">LINK: DSN-GOLDSTONE // SOL 124</span>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                type="button"
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectModule(m.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">{m.label}</span>
                <span className="member-tag">{m.tag}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
