# Interplanetary Survival Guide: Martian Map 🚀🔴

> Collaborative Multi-Member Planetary Science & Survival Project for Mars Exploration.
> Developed by a three-member team using React, JavaScript, HTML5 Canvas, Three.js WebGL, and CSS.

---

## 👨‍🚀 Team Architecture & Module Division

This project is built under a unified, modular repository structure where each team member owns a dedicated module directory under `src/components/modules/` without stepping on each other's code:

| Member | Module Directory | Assigned Responsibility | Status |
| :--- | :--- | :--- | :--- |
| **Member 1** *(Current)* | `src/components/modules/member1-mars-map/` | **Interactive Mars Map & Frontend Exploration Terminal** | **✅ Fully Functional & Complete** |
| **Member 2** | `src/components/modules/member2-nasa-data/` | NASA Weather Telemetry, InSight & Rover Sensor Data | 🔄 Integration Slot Prepared |
| **Member 3** | `src/components/modules/member3-mission-planning/` | Survival Resource Planning & Traverse Logistics | 🔄 Integration Slot Prepared |

---

## 🗺️ Member 1: Interactive Mars Map Features

1. **NASA-Inspired Exploration Terminal**:
   - Deep space NASA/JPL telemetry HUD styling.
   - Real-time Earth-Mars light-speed communication latency clock (14m 18s).
   - Global exploration dashboard with 144.8M km² surface coverage and Sol time counter.

2. **Dual-Engine Interactive Mapping**:
   - **2D Surface Map Canvas**: Smooth panning, mouse-wheel/pinch zooming (1x to 8x), and coordinate projection.
   - **3D Orbital Globe (Three.js WebGL)**: Photorealistic rotating Martian sphere, atmospheric glow shader, stars background, and 3D spherical coordinate pin projections.

3. **Multi-Spectral Optical Layers**:
   - **NASA Viking Optical Mosaic**: True-color rusty iron oxide albedo and basalt plains.
   - **MOLA Topographic Elevation**: Color-coded laser altimetry (-8 km blue to +22 km white).
   - **THEMIS Daytime Thermal Infrared**: Thermal inertia and bedrock emissivity gradients.
   - **Tactical Shaded Relief**: High-contrast hillshade highlighting crater rims and canyon escarpments.
   - **Subsurface Water Ice Overlay**: Radar-derived glacier deposits across Utopia & Arcadia Planitia.

4. **Rich Martian Landmark Database (25+ Authentic Sites)**:
   - **Active Rovers**: Perseverance & Ingenuity (Jezero Crater Delta), Curiosity (Gale Crater / Mount Sharp), Zhurong.
   - **Historic Landers**: InSight (Elysium Planitia), Viking 1 & 2, Opportunity (Meridiani Planum), Spirit (Gusev Crater).
   - **Extreme Volcanic Peaks**: Olympus Mons (21.9 km peak), Tharsis Montes (Ascraeus, Pavonis, Arsia Mons).
   - **Tectonic Chasmata**: Valles Marineris (4,000 km grand canyon rift), Noctis Labyrinthus, Candor Chasma.
   - **Impact Basins**: Hellas Planitia (deepest basin, 12.4 mbar), Argyre Planitia.
   - **Glacial Reserves & Colonies**: Arcadia Planitia (Starship colony zone), Utopia Planitia, Korolev Crater ice dome.

5. **Real-Time Geodesy & Coordinate HUD**:
   - Real-time cursor coordinates in Areocentric Latitude & Longitude (Decimal and DMS notation).
   - Continuous MOLA elevation datum estimation.
   - Coordinated Mars Time (MTC) and Solar Longitude ($L_s$) seasonal tracking.

6. **Interactive Location Dossier & Survival Viability Matrix**:
   - Detailed scientific background and landing history.
   - Survival viability score (1-100) and tier rating.
   - Breakdown of water-ice accessibility, atmospheric density, cosmic radiation shielding, and solar power.
   - Actionable buttons: *Fly to Target*, *Copy Coordinates*, *Transmit to Telemetry*, and *Add to Mission Route*.

7. **Deploy Custom Survival Beacons**:
   - Interactive modal allowing colonists to drop custom GPS beacons with life-support supply notes.

---

## 🔌 How Member 1's Module Integrates with Members 2 & 3

### 1. Shared Context: `MarsMissionContext.jsx`
All cross-module state lives in `src/context/MarsMissionContext.jsx`:
- **Member 2 Integration**: When a user clicks **"Telemetry Feed"** in Member 1's dossier, `setTelemetryTarget(loc)` is triggered. Member 2's module accesses `telemetryTarget` or `selectedLocation` directly via `useMarsMission()`.
- **Member 3 Integration**: When a user clicks **"Add to Plan"**, `addToMissionRoute(loc)` appends the location to `routeWaypoints`. Member 3's module automatically computes cumulative traverse distance using `calculateMarsDistance()`!

### 2. Standalone Export
Member 1's entire system is cleanly exported from `src/components/modules/member1-mars-map/index.js`:
```jsx
import { MarsMapModule } from './components/modules/member1-mars-map';

// Inside your layout / router:
<MarsMapModule />
```

---

## 💻 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Production build
npm run build
```

Application runs at `http://localhost:3000/`.
