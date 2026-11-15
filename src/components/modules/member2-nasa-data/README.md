# Member 2: NASA Scientific Data Integration Module
**Project:** Interplanetary Survival Guide: Martian Map  
**Assigned Member:** Member 2  
**Integration Status:** Complete & Production Ready  

---

## 1. Overview
The **NASA Scientific Data Integration Module** serves as the empirical scientific backbone of the *Interplanetary Survival Guide: Martian Map*. It ingests, visualizes, and correlates authentic data from NASA rovers, orbiters, and landers to support surface navigation, site selection, and colonist survival protocols.

### Core Capabilities:
1. **NASA Scientific Data Display**: Multi-mission telemetry fleet tracker (Perseverance, Curiosity, InSight, MRO, Odyssey, MAVEN) and fundamental planetary constants from the NASA Goddard Space Flight Center (GSFC) Planetary Fact Sheet.
2. **Mars Thermal Information**: Global thermal inertia regimes from the 2001 Mars Odyssey THEMIS instrument (J m⁻² K⁻¹ s⁻¹/²), diurnal temperature gradients, subsurface damping profiles (-10 cm depth), and nocturnal frost line risk warnings.
3. **Geological and Mineral Information**: Regolith chemical oxide abundance (SiO2, FeO, MgO, Al2O3, SO3) with critical survival warnings for toxic **Perchlorates (ClO4-)**, plus CRISM hyperspectral mineral identification (Fe/Mg smectite clays with extractable water, hydrated sulfates, olivine, hematite, carbonates).
4. **Topographic and Elevation Information**: MGS MOLA (Mars Orbiter Laser Altimeter) 0-meter datum (610.5 Pa water triple point reference) with elevation benchmarks from Olympus Mons (+21.2 km) down to Hellas Planitia (-7.1 km) and a 250 km cross-sectional topographic transect of Valles Marineris.
5. **Atmospheric Observations**: Mars 2020 Perseverance MEDA 7-Sol calibrated weather telemetry (Sol 915 - Sol 921) at Jezero Crater, global atmospheric composition (95.3% CO2 with MOXIE O2 extraction notes), dust optical depth (Tau), and the 25-30% annual polar CO2 condensation pressure cycle.
6. **Mars Rover Images & In-Situ Observations**: Live NASA Mars Rover Photos API query engine (Perseverance & Curiosity) with automatic fallback to curated NASA/JPL-Caltech high-resolution science images, camera instrument filters, Sol selector, and full metadata lightbox.
7. **Charts & Data Visualization**: Interactive, responsive SVG data visualization suite (Diurnal temperature swings, annual CO2 pressure cycle, MOLA elevation profiles, and regolith mineral abundance).
8. **Data Provenance & Dataset Sources**: Strict adherence to scientific integrity. Every metric and chart displays its authentic NASA mission, instrument, and observation Sol/date with explicit labeling of sample/demonstration data vs verified NASA PDS ground truth archives.

---

## 2. File and Directory Structure
```
src/modules/nasa-data/
├── index.js                           # Main barrel export for team integration
├── NasaScientificDataModule.jsx       # Top-level standalone container component
├── README.md                          # Documentation and integration guide
├── data/
│   └── authenticNasaDatasets.js       # Ground truth NASA PDS & GSFC scientific datasets
├── services/
│   └── nasaApiService.js              # Live NASA Open API service with resilient fallback
├── styles/
│   └── nasaData.css                   # Scoped NASA HUD styling (no collision with other modules)
└── components/
    ├── DataOverview.jsx               # Telemetry dashboard & active fleet status
    ├── AtmosphereObservations.jsx     # MEDA weather records, dust Tau & gas ratios
    ├── ThermalViewer.jsx              # THEMIS thermal inertia & diurnal depth gradients
    ├── GeologyMinerals.jsx            # CRISM mineralogy, regolith assays & perchlorate alerts
    ├── TopographyElevation.jsx        # MOLA laser altimetry, datum benchmarks & transects
    ├── RoverImagery.jsx               # NASA Rover Photos API & curated high-res gallery
    ├── DataVisualizer.jsx             # Interactive multi-parameter SVG chart suite
    ├── DataSourceBadge.jsx            # Reusable provenance & demo/verified badge
    └── DatasetSourcesModal.jsx        # Full PDS archive citations & methodology modal
```

---

## 3. How Other Team Members Can Integrate This Module

### Option A: Embed Full Module into Main App (Recommended)
Member 1 or Member 3 can render the entire NASA Scientific Data module inside their page, modal, or tab navigation:

```jsx
import NasaScientificDataModule from './modules/nasa-data';

function App() {
  return (
    <div>
      <NasaScientificDataModule 
        initialTab="overview"     // 'overview' | 'atmosphere' | 'thermal' | 'geology' | 'topography' | 'rover-imagery' | 'charts'
        defaultUnit="C"           // 'C' | 'K' | 'F'
        showSharedHeader={true}   // Toggle telemetry header
      />
    </div>
  );
}
```

### Option B: Import Individual Reusable Components
Team members can cherry-pick specific components into their modules:

```jsx
// In Member 1's Martian Map:
import { TopographyElevation, ThermalViewer } from './modules/nasa-data';

// In Member 3's Survival Guide:
import { AtmosphereObservations, GeologyMinerals } from './modules/nasa-data';
```

### Option C: Import Raw NASA Datasets & Services Directly
```jsx
import { 
  MARS_PLANETARY_CONSTANTS, 
  MEDA_7SOL_WEATHER_RECORDS, 
  MOLA_TOPOGRAPHY_BENCHMARKS,
  REGOLITH_CHEMICAL_COMPOSITION,
  nasaApiService 
} from './modules/nasa-data';
```

---

## 4. Scientific Provenance & Sources
- **NASA Goddard Space Flight Center**: Mars Planetary Fact Sheet.
- **NASA / CAB (INTA-CSIC) / JPL-Caltech**: Mars 2020 Perseverance MEDA Science Archive (Sol 915-921).
- **NASA / JHU-APL**: MRO Compact Reconnaissance Imaging Spectrometer for Mars (CRISM).
- **NASA / MIT / GSFC**: MGS Mars Orbiter Laser Altimeter (MOLA) MEGDR v2.
- **NASA / Arizona State University**: 2001 Mars Odyssey THEMIS Global Thermal Inertia Dataset.
- **NASA Open Data Portal**: Mars Rover Photos API (`https://api.nasa.gov/`).
