// Member 3 Module Integration Stub
// "Survival & Mission Planning Module" (Assigned to Member 3)
// Designed for seamless integration with Member 1's Interactive Mars Map

import React from 'react';
import { useMarsMission } from '../../../context/MarsMissionContext';
import { calculateMarsDistance, formatMarsCoords } from '../member1-mars-map/hooks/useMarsCoordinates';
import { ShieldCheck, Route, Compass, CheckSquare, Sparkles, Navigation } from 'lucide-react';
import './MissionPlanningModule.css';

export default function MissionPlanningModule() {
  const { routeWaypoints, flyTo } = useMarsMission();

  // Calculate cumulative route distance across all waypoints
  let totalDistanceKm = 0;
  for (let i = 0; i < routeWaypoints.length - 1; i++) {
    totalDistanceKm += calculateMarsDistance(
      routeWaypoints[i].lat,
      routeWaypoints[i].lng,
      routeWaypoints[i + 1].lat,
      routeWaypoints[i + 1].lng
    );
  }

  return (
    <section className="member-module-placeholder" aria-label="Mission Planning Module">
      <div className="placeholder-banner">
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-emerald-400" />
          <span className="badge-member text-emerald-400">MEMBER 3 MODULE REPOSITORY</span>
        </div>
        <h2>Interplanetary Survival & Mission Planning Module</h2>
        <p>
          This module is developed by <strong>Member 3</strong> of the team. It provides survival resource calculators,
          EVA traverse checklists, rover power requirements, and multi-leg landing site logistics.
        </p>

        {/* Live Route Waypoints added from Member 1's Map */}
        <div className="mission-route-box">
          <div className="flex items-center justify-between mb-2">
            <span className="integration-tag text-emerald-400">
              ACTIVE MISSION TRAVERSE LEGS (TRANSMITTED FROM MEMBER 1'S MAP):
            </span>
            <span className="font-mono text-emerald-300 text-sm font-bold">
              Total Traverse: {totalDistanceKm} km
            </span>
          </div>

          <div className="route-list-grid">
            {routeWaypoints.map((wp, idx) => {
              const formatted = formatMarsCoords(wp.lat, wp.lng);
              return (
                <div key={wp.id || idx} className="route-stop-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="leg-badge">LEG #{idx + 1}</span>
                    <button
                      type="button"
                      className="fly-to-leg-btn"
                      onClick={() => flyTo(wp)}
                      title="Jump to this waypoint on Member 1's Map"
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1" />
                      View on Map
                    </button>
                  </div>
                  <h4 className="font-bold text-white text-base">{wp.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {formatted.latStr}, {formatted.lngStr}
                  </p>
                  {wp.survivalViability && (
                    <div className="text-xs text-emerald-400 mt-1">
                      Viability Rating: <strong>{wp.survivalViability.score}/100</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="survival-checklist-preview">
          <h4 className="text-slate-200 font-bold mb-2 flex items-center">
            <CheckSquare className="w-4 h-4 text-emerald-400 mr-2" />
            Core Martian Survival Directives
          </h4>
          <ul className="checklist-items">
            <li>✓ Pressurization: Maintain 101.3 kPa inside habitat domes with N2/O2 mix</li>
            <li>✓ ISRU Water: Minimum 4.5 liters H2O per astronaut/sol via regolith extraction</li>
            <li>✓ Radiation Protocol: Evacuate surface to lava tube bunkers during solar flare alert</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
