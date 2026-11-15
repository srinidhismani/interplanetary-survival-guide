// Main Application Root
// Project: "Interplanetary Survival Guide: Martian Map"
// Shared architecture for Member 1 (Mars Map), Member 2 (NASA Data), and Member 3 (Mission Planning)

import React from 'react';
import { MarsMissionProvider, useMarsMission } from './context/MarsMissionContext';
import Navbar from './components/common/Navbar';
import HomePage from './components/home/HomePage';
import MarsMapModule from './components/modules/member1-mars-map';
import NasaDataModule from './components/modules/member2-nasa-data';
import MissionPlanningModule from './components/modules/member3-mission-planning';

function AppContent() {
  const { activeModule, setActiveModule, navigateToModule } = useMarsMission();

  return (
    <div className="interplanetary-app-shell">
      {/* Shared Aerospace Navbar */}
      <Navbar activeModule={activeModule} onSelectModule={setActiveModule} />

      {/* Dynamic Module Outlet */}
      <main className="app-main-content">
        {activeModule === 'home' && <HomePage />}
        {activeModule === 'member1-map' && <MarsMapModule />}
        {activeModule === 'member2-nasa' && <NasaDataModule />}
        {activeModule === 'member3-planning' && <MissionPlanningModule />}
      </main>

      {/* Global NASA Mission Telemetry Footer */}
      <footer className="app-mission-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="font-bold text-slate-300">INTERPLANETARY SURVIVAL GUIDE</span>
            <span className="text-slate-500 mx-2">|</span>
            <span className="text-slate-400">Martian Cartography & Exploration System</span>
            <span className="text-slate-500 mx-2">•</span>
            <span className="text-cyan-400">NASA JPL & PDS Science Archive</span>
          </div>
          
          <div className="footer-links flex items-center gap-4 text-xs font-mono">
            <button
              type="button"
              className="footer-nav-link text-slate-400 hover:text-white"
              onClick={() => navigateToModule('home')}
            >
              Mission Control
            </button>
            <span className="text-slate-700">/</span>
            <button
              type="button"
              className="footer-nav-link text-cyan-400 hover:text-cyan-300"
              onClick={() => navigateToModule('member1-map')}
            >
              Surface Map
            </button>
            <span className="text-slate-700">/</span>
            <button
              type="button"
              className="footer-nav-link text-amber-400 hover:text-amber-300"
              onClick={() => navigateToModule('member2-nasa')}
            >
              Science Telemetry
            </button>
            <span className="text-slate-700">/</span>
            <button
              type="button"
              className="footer-nav-link text-emerald-400 hover:text-emerald-300"
              onClick={() => navigateToModule('member3-planning')}
            >
              Route & Terrain Planner
            </button>
          </div>

          <div className="footer-right font-mono text-xs text-slate-500">
            NASA JPL / MOLA DATUM ELEVATION GRID // MARTIAN AREODESY 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MarsMissionProvider>
      <AppContent />
    </MarsMissionProvider>
  );
}
