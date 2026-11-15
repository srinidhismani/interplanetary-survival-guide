// NASA Aerospace Responsive Navigation Bar
// Unified navigation for the Interplanetary Survival Guide: Martian Map

import React, { useState } from 'react';
import { LayoutDashboard, Compass, Radio, Route, Menu, X, Satellite } from 'lucide-react';
import './common.css';

export default function Navbar({ activeModule, onSelectModule }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: 'Mission Control',
      icon: LayoutDashboard
    },
    {
      id: 'member1-map',
      label: 'Interactive Mars Map',
      icon: Compass
    },
    {
      id: 'member2-nasa',
      label: 'Science & Telemetry',
      icon: Radio
    },
    {
      id: 'member3-planning',
      label: 'Terrain & Route Planner',
      icon: Route
    }
  ];

  return (
    <header className="nasa-app-header">
      <div className="navbar-container">
        {/* Brand & Project Identity - Clickable to Home */}
        <div 
          className="navbar-brand cursor-pointer"
          onClick={() => onSelectModule('home')}
          title="Return to Mission Control"
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-logo-hex">
            <Satellite className="w-5 h-5 text-orange-400" />
          </div>
          <div className="brand-titles">
            <span className="brand-agency">NASA // JPL MARTIAN AREODESY</span>
            <span className="brand-project">Interplanetary Survival Guide</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectModule(item.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Telemetry Status Indicator */}
        <div className="navbar-status-indicator hidden-mobile">
          <span className="telemetry-live-dot" />
          <span className="telemetry-label font-mono">DSN-GOLDSTONE // DELAY 14m 18s // SOL 921</span>
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectModule(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
