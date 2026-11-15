/**
 * Public API for Member 3's Terrain Module
 * 
 * To integrate into the shared team project:
 * Copy the `src/modules/terrain` folder into the team project,
 * then import `TerrainModule` (or individual subcomponents/data) from here:
 * 
 * import { TerrainModule } from './modules/terrain';
 */

export { default } from './components/TerrainModule';
export { default as TerrainModule } from './components/TerrainModule';
export { default as MissionPlanningModule } from './components/TerrainModule';
export { default as TerrainAnalysis } from './components/TerrainAnalysis/TerrainAnalysis';
export { default as InteractiveTerrainMap } from './components/TerrainAnalysis/InteractiveTerrainMap';
export { default as TerrainInfoPanel } from './components/TerrainAnalysis/TerrainInfoPanel';
export { default as ElevationAnalysisPanel } from './components/TerrainAnalysis/ElevationAnalysisPanel';
export { default as SlopeAnalysisPanel } from './components/TerrainAnalysis/SlopeAnalysisPanel';
export { default as TerrainInspectorTool, RECON_TARGETS } from './components/TerrainAnalysis/TerrainInspectorTool';
export { default as ElevationProfileChart } from './components/TerrainAnalysis/ElevationProfileChart';
export { default as SlopeGauge } from './components/TerrainAnalysis/SlopeGauge';
export { default as SurfaceRoughnessCard } from './components/TerrainAnalysis/SurfaceRoughnessCard';
export { default as MapLayerControls } from './components/TerrainAnalysis/MapLayerControls';
export { default as TerrainCard } from './components/TerrainAnalysis/TerrainCard';

export { default as HazardIdentification } from './components/HazardIdentification/HazardIdentification';
export { default as HazardAlert } from './components/HazardIdentification/HazardAlert';
export { default as HazardDetailCard } from './components/HazardIdentification/HazardDetailCard';
export { default as HazardSummaryPanel } from './components/HazardIdentification/HazardSummaryPanel';
export { default as HazardFilterBar } from './components/HazardIdentification/HazardFilterBar';

export { default as ScientificPOIs } from './components/ScientificPOIs/ScientificPOIs';
export { default as PoiDetailCard } from './components/ScientificPOIs/PoiDetailCard';
export { default as PoiFilterBar } from './components/ScientificPOIs/PoiFilterBar';

export { default as MissionPlanning } from './components/MissionPlanning/MissionPlanning';
export { default as RoutePlannerControl } from './components/MissionPlanning/RoutePlannerControl';
export { default as RouteDetailsPanel } from './components/MissionPlanning/RouteDetailsPanel';
export { default as WaypointList } from './components/MissionPlanning/WaypointList';

export { default as MissionDashboard } from './components/MissionDashboard/MissionDashboard';
export { default as MissionDetailsCard } from './components/MissionDashboard/MissionDetailsCard';
export { default as SelectedLocationsCard } from './components/MissionDashboard/SelectedLocationsCard';
export { default as PlannedRouteCard } from './components/MissionDashboard/PlannedRouteCard';
export { default as HazardsOverviewCard } from './components/MissionDashboard/HazardsOverviewCard';
export { default as MissionSummaryModal } from './components/MissionDashboard/MissionSummaryModal';

export { default as Badge } from './components/common/Badge';
export { default as StatCard } from './components/common/StatCard';

export * from './data/simulatedMarsData';
export * from './utils/routePlanner';
