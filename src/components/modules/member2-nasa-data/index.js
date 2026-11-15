/**
 * Member 2 - NASA Scientific Data Integration Module
 * Main Barrel Export
 * 
 * Provides both the default full module container and all reusable sub-components
 * so Member 1 (Martian Map) and Member 3 (Survival Guide) can import whatever they need.
 */

export { default } from './NasaScientificDataModule.jsx';
export { default as NasaScientificDataModule } from './NasaScientificDataModule.jsx';

// Reusable Sub-Components
export { default as DataOverview } from './components/DataOverview.jsx';
export { default as ThermalViewer } from './components/ThermalViewer.jsx';
export { default as GeologyMinerals } from './components/GeologyMinerals.jsx';
export { default as TopographyElevation } from './components/TopographyElevation.jsx';
export { default as AtmosphereObservations } from './components/AtmosphereObservations.jsx';
export { default as RoverImagery } from './components/RoverImagery.jsx';
export { default as DataVisualizer } from './components/DataVisualizer.jsx';
export { default as DataSourceBadge } from './components/DataSourceBadge.jsx';
export { default as DatasetSourcesModal } from './components/DatasetSourcesModal.jsx';

// Services & Authentic Datasets
export { nasaApiService } from './services/nasaApiService.js';
export * from './data/authenticNasaDatasets.js';
