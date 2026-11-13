// Main Application Root
// Project: "Interplanetary Survival Guide: Martian Map"
// Shared architecture for Member 1 (Mars Map), Member 2 (NASA Data), and Member 3 (Mission Planning)

import React, { useState } from 'react';
import { MarsMissionProvider } from './context/MarsMissionContext';
import Navbar from './components/common/Navbar';
import MarsMapModule from './components/modules/member1-mars-map';
import NasaDataModule from './components/modules/member2-nasa-data';
import MissionPlanningModule from './components/modules/member3-mission-planning';

export default function App() {
  // Active module tab ('member1-map' is Member 1's primary interactive module)
  const [activeModule, setActiveModule] = useState('member1-map');

  return (
    <MarsMissionProvider>
      <div className="interplanetary-app-shell">
        {/* Shared Aerospace Navbar */}
        <Navbar activeModule={activeModule} onSelectModule={setActiveModule} />

        {/* Dynamic Module Outlet */}
        <main className="app-main-content">
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
              <span className="text-slate-400">Collaborative 3-Member Aerospace Project</span>
            </div>
            <div className="footer-right font-mono text-xs text-slate-500">
              NASA JPL / MOLA DATUM ELEVATION GRID // MARTIAN AREODESY 2026
            </div>
          </div>
        </footer>
      </div>
    </MarsMissionProvider>
  );
}
