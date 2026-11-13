// Interactive 2D Mars Surface Map Canvas
// Features: Pan, Zoom, Equirectangular Projection, Multi-spectral Optical Layers,
// Grid Telemetry, Interactive Markers, Subsurface Ice Overlays, Coordinate Inspector.

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import { useMarsCoordinates, formatMarsCoords, estimateMarsElevation } from '../hooks/useMarsCoordinates';
import { CATEGORY_ICONS } from '../data/marsLocations';

export default function MarsCanvas2D({ onHoverCoords, onSelectCoordinate }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const {
    allLocations,
    selectedLocation,
    setSelectedLocation,
    activeLayer,
    showGrid,
    showLabels,
    showIceOverlay,
    filterCategory,
    searchQuery,
    flyToTarget
  } = useMarsMission();

  // Transform state: offset (x, y) and zoom scale
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Animation frame ref
  const animFrameRef = useRef(null);
  const pulsePhaseRef = useRef(0);

  // Filtered locations
  const filteredLocations = allLocations.filter((loc) => {
    const matchesCat = filterCategory === 'all' || loc.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.mission && loc.mission.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (loc.categoryLabel && loc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Convert Martian Lat/Lng to normalized map space [0..1, 0..1]
  // Equirectangular projection:
  // Lng [-180..+180] -> [0..1]
  // Lat [+90..-90] -> [0..1] (Note: North is Top, South is Bottom)
  const coordsToNormalized = useCallback((lat, lng) => {
    const nx = (lng + 180) / 360;
    const ny = (90 - lat) / 180;
    return { nx, ny };
  }, []);

  // Convert canvas pixel position to Martian Lat/Lng
  const pixelToCoords = useCallback((px, py, width, height, currentTransform) => {
    // Inverse transform
    const mapW = width * currentTransform.scale;
    const mapH = height * currentTransform.scale;
    const mapX = (width - mapW) / 2 + currentTransform.x;
    const mapY = (height - mapH) / 2 + currentTransform.y;

    const nx = (px - mapX) / mapW;
    const ny = (py - mapY) / mapH;

    const lng = nx * 360 - 180;
    const lat = 90 - ny * 180;

    return {
      lat: Math.max(-90, Math.min(90, lat)),
      lng: Math.max(-180, Math.min(180, lng))
    };
  }, []);

  // Handle FlyTo requests from context
  useEffect(() => {
    if (!flyToTarget || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const { nx, ny } = coordsToNormalized(flyToTarget.lat, flyToTarget.lng);
    const targetScale = Math.max(2.2, flyToTarget.zoom || 2.5);

    // Target map size
    const mapW = width * targetScale;
    const mapH = height * targetScale;

    // Centered offset
    const targetX = width / 2 - (mapW * nx);
    const targetY = height / 2 - (mapH * ny);

    // Animate smoothly to target
    const startX = transform.x;
    const startY = transform.y;
    const startScale = transform.scale;
    const duration = 650;
    const startTime = performance.now();

    const animateFlight = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setTransform({
        x: startX + (targetX - startX) * ease,
        y: startY + (targetY - startY) * ease,
        scale: startScale + (targetScale - startScale) * ease
      });

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      }
    };

    requestAnimationFrame(animateFlight);
  }, [flyToTarget, coordsToNormalized]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;
      pulsePhaseRef.current = (pulsePhaseRef.current + 0.04) % (Math.PI * 2);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, width, height);

      // Calculate Map viewport dimensions
      const mapW = width * transform.scale;
      const mapH = height * transform.scale;
      const mapX = (width - mapW) / 2 + transform.x;
      const mapY = (height - mapH) / 2 + transform.y;

      ctx.save();
      // Clip to Map bounds
      ctx.beginPath();
      ctx.rect(mapX, mapY, mapW, mapH);
      ctx.clip();

      // ==========================================
      // 1. RENDER BASE PLANETARY OPTICAL LAYER
      // ==========================================
      drawPlanetarySurface(ctx, mapX, mapY, mapW, mapH, activeLayer.type);

      // ==========================================
      // 2. SUBSURFACE WATER ICE OVERLAY (IF ENABLED)
      // ==========================================
      if (showIceOverlay) {
        drawIceOverlay(ctx, mapX, mapY, mapW, mapH);
      }

      // ==========================================
      // 3. SCIENTIFIC COORDINATE GRID (LAT/LONG)
      // ==========================================
      if (showGrid) {
        drawCoordinateGrid(ctx, mapX, mapY, mapW, mapH, transform.scale);
      }

      ctx.restore(); // Restore clip

      // Map border HUD ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mapX, mapY, mapW, mapH);

      // ==========================================
      // 4. RENDER LOCATION MARKERS & PINS
      // ==========================================
      filteredLocations.forEach((loc) => {
        const { nx, ny } = coordsToNormalized(loc.lat, loc.lng);
        const px = mapX + nx * mapW;
        const py = mapY + ny * mapH;

        // Skip markers outside view canvas
        if (px < -40 || px > width + 40 || py < -40 || py > height + 40) return;

        const isSelected = selectedLocation && selectedLocation.id === loc.id;
        const isHovered = hoveredLocation && hoveredLocation.id === loc.id;
        const iconConfig = CATEGORY_ICONS[loc.category] || CATEGORY_ICONS.rover;

        drawMarker(
          ctx,
          px,
          py,
          loc,
          isSelected,
          isHovered,
          iconConfig,
          pulsePhaseRef.current,
          showLabels,
          transform.scale
        );
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    transform,
    activeLayer,
    showGrid,
    showLabels,
    showIceOverlay,
    filteredLocations,
    selectedLocation,
    hoveredLocation,
    coordsToNormalized
  ]);

  // =========================================================================
  // MAP GRAPHICS PROCEDURAL GENERATORS (AUTHENTIC NASA GEOGRAPHICAL FEATURES)
  // =========================================================================

  const drawPlanetarySurface = (ctx, x, y, w, h, layerType) => {
    // Base gradient per layer
    if (layerType === 'topography') {
      // NASA MOLA Elevation Color Spectrum
      const grad = ctx.createLinearGradient(x, y + h, x, y);
      grad.addColorStop(0.0, '#0369a1'); // Deep Southern highlands & basins
      grad.addColorStop(0.2, '#0284c7');
      grad.addColorStop(0.4, '#15803d'); // Lowland plains
      grad.addColorStop(0.6, '#eab308'); // High plateaus
      grad.addColorStop(0.85, '#dc2626'); // Volcanic shields
      grad.addColorStop(1.0, '#ffffff'); // Polar & peak white caps
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    } else if (layerType === 'infrared') {
      // THEMIS Thermal Infrared
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0.0, '#1e1b4b');
      grad.addColorStop(0.3, '#4338ca');
      grad.addColorStop(0.6, '#06b6d4');
      grad.addColorStop(0.8, '#f59e0b');
      grad.addColorStop(1.0, '#fef08a');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    } else if (layerType === 'relief') {
      // Shaded Relief Tactical
      const grad = ctx.createRadialGradient(x + w * 0.5, y + h * 0.5, 50, x + w * 0.5, y + h * 0.5, w * 0.7);
      grad.addColorStop(0.0, '#334155');
      grad.addColorStop(0.6, '#1e293b');
      grad.addColorStop(1.0, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    } else {
      // Optical Viking True Color Mosaic
      const grad = ctx.createRadialGradient(x + w * 0.45, y + h * 0.5, 80, x + w * 0.5, y + h * 0.5, w * 0.8);
      grad.addColorStop(0.0, '#b45309'); // Iron oxide bright rust
      grad.addColorStop(0.35, '#9a3412');
      grad.addColorStop(0.7, '#7c2d12');
      grad.addColorStop(1.0, '#451a03'); // Dark basalt
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    }

    // Draw Major Mars Albedo & Geological Features:
    // 1. Syrtis Major Planum (Dark Volcanic Shield ~290°E, 10°N) -> nx: ~0.8, ny: ~0.44
    drawFeatureAlbedo(ctx, x + w * 0.80, y + h * 0.44, w * 0.08, h * 0.12, layerType, 'dark');
    
    // 2. Hellas Planitia (Colossal Impact Basin ~70°E, 42°S) -> nx: ~0.69, ny: ~0.73
    drawFeatureCircular(ctx, x + w * 0.69, y + h * 0.73, w * 0.09, h * 0.14, layerType, 'basin');
    
    // 3. Argyre Planitia (~316°E / -44°W, 50°S) -> nx: ~0.38, ny: ~0.77
    drawFeatureCircular(ctx, x + w * 0.38, y + h * 0.77, w * 0.05, h * 0.08, layerType, 'basin');

    // 4. Olympus Mons (~-133.8°W, 18.6°N) -> nx: ~0.128, ny: ~0.39
    drawVolcanoPeak(ctx, x + w * 0.128, y + h * 0.39, w * 0.035, layerType, 'Olympus Mons');

    // 5. Tharsis Montes Triad (Ascraeus, Pavonis, Arsia)
    drawVolcanoPeak(ctx, x + w * 0.21, y + h * 0.43, w * 0.02, layerType);
    drawVolcanoPeak(ctx, x + w * 0.185, y + h * 0.495, w * 0.02, layerType);
    drawVolcanoPeak(ctx, x + w * 0.163, y + h * 0.546, w * 0.02, layerType);

    // 6. Valles Marineris Canyon System (-59°W, 14°S) -> nx: ~0.336, ny: ~0.577
    drawVallesMarineris(ctx, x + w * 0.26, y + h * 0.56, w * 0.18, h * 0.05, layerType);

    // 7. North Polar Cap (Planum Boreum - Permanent Water Ice)
    drawPolarCap(ctx, x, y, w, h * 0.08, true, layerType);

    // 8. South Polar Cap (Planum Australe - CO2 Ice)
    drawPolarCap(ctx, x, y + h * 0.92, w, h * 0.08, false, layerType);

    // 9. Planetary Dust & Crater Texture Stipples
    drawSurfaceCraterDetails(ctx, x, y, w, h, layerType);
  };

  const drawFeatureAlbedo = (ctx, cx, cy, rx, ry, layerType, kind) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0.4, 0, Math.PI * 2);
    if (layerType === 'topography') {
      ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
    } else if (layerType === 'infrared') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
    } else {
      ctx.fillStyle = kind === 'dark' ? 'rgba(30, 10, 5, 0.55)' : 'rgba(217, 119, 6, 0.4)';
    }
    ctx.filter = 'blur(8px)';
    ctx.fill();
    ctx.restore();
  };

  const drawFeatureCircular = (ctx, cx, cy, rx, ry, layerType) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (layerType === 'topography') {
      ctx.fillStyle = 'rgba(2, 132, 199, 0.75)'; // Low elevation basin
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.9)';
    } else if (layerType === 'infrared') {
      ctx.fillStyle = 'rgba(67, 56, 202, 0.6)';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    } else {
      ctx.fillStyle = 'rgba(180, 83, 9, 0.45)';
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.7)';
    }
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const drawVolcanoPeak = (ctx, cx, cy, radius, layerType) => {
    ctx.save();
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
    if (layerType === 'topography') {
      grad.addColorStop(0.0, '#ffffff'); // Highest altitude
      grad.addColorStop(0.3, '#ec4899');
      grad.addColorStop(0.7, '#dc2626');
      grad.addColorStop(1.0, 'transparent');
    } else if (layerType === 'infrared') {
      grad.addColorStop(0.0, '#fef08a');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1.0, 'transparent');
    } else {
      grad.addColorStop(0.0, '#451a03'); // Caldera dark basalt
      grad.addColorStop(0.4, '#ea580c');
      grad.addColorStop(1.0, 'transparent');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Caldera summit ring
    ctx.strokeStyle = layerType === 'topography' ? 'rgba(255,255,255,0.8)' : 'rgba(69, 26, 3, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawVallesMarineris = (ctx, x, y, w, h, layerType) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.5);
    ctx.bezierCurveTo(x + w * 0.3, y - h * 0.4, x + w * 0.6, y + h * 1.3, x + w, y + h * 0.6);

    if (layerType === 'topography') {
      ctx.strokeStyle = '#0284c7'; // Deep canyon rift
    } else if (layerType === 'infrared') {
      ctx.strokeStyle = '#312e81';
    } else {
      ctx.strokeStyle = '#270e03';
    }
    ctx.lineWidth = Math.max(3, h * 0.6);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Secondary chasmata branches
    ctx.beginPath();
    ctx.moveTo(x + w * 0.35, y + h * 0.2);
    ctx.lineTo(x + w * 0.65, y + h * 0.1);
    ctx.lineWidth = Math.max(1.5, h * 0.3);
    ctx.stroke();
    ctx.restore();
  };

  const drawPolarCap = (ctx, x, y, w, h, isNorth, layerType) => {
    ctx.save();
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    if (isNorth) {
      grad.addColorStop(0.0, '#ffffff');
      grad.addColorStop(0.7, 'rgba(224, 242, 254, 0.85)');
      grad.addColorStop(1.0, 'transparent');
    } else {
      grad.addColorStop(0.0, 'transparent');
      grad.addColorStop(0.3, 'rgba(224, 242, 254, 0.85)');
      grad.addColorStop(1.0, '#ffffff');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  };

  const drawSurfaceCraterDetails = (ctx, x, y, w, h, layerType) => {
    // Southern highlands ancient crater field
    ctx.save();
    const craterPoints = [
      { rx: 0.15, ry: 0.72, r: 12 },
      { rx: 0.28, ry: 0.68, r: 8 },
      { rx: 0.48, ry: 0.62, r: 15 },
      { rx: 0.55, ry: 0.78, r: 9 },
      { rx: 0.85, ry: 0.65, r: 18 },
      { rx: 0.92, ry: 0.74, r: 10 }
    ];

    craterPoints.forEach((c) => {
      const cx = x + c.rx * w;
      const cy = y + c.ry * h;
      ctx.beginPath();
      ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
      ctx.strokeStyle = layerType === 'topography' ? 'rgba(21, 128, 61, 0.5)' : 'rgba(69, 26, 3, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.restore();
  };

  // Subsurface water-ice reserves overlay
  const drawIceOverlay = (ctx, x, y, w, h) => {
    ctx.save();
    // Arcadia Planitia Ice Reserve (nx: ~0.025 to 0.15, ny: ~0.25 to 0.35)
    const arcX = x + w * 0.06;
    const arcY = y + h * 0.28;
    const arcGrad = ctx.createRadialGradient(arcX, arcY, 10, arcX, arcY, w * 0.08);
    arcGrad.addColorStop(0.0, 'rgba(6, 182, 212, 0.7)');
    arcGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.3)');
    arcGrad.addColorStop(1.0, 'transparent');
    ctx.fillStyle = arcGrad;
    ctx.beginPath();
    ctx.ellipse(arcX, arcY, w * 0.09, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Utopia Planitia Massive Ice Sheet (nx: ~0.88, ny: ~0.23)
    const utoX = x + w * 0.88;
    const utoY = y + h * 0.23;
    const utoGrad = ctx.createRadialGradient(utoX, utoY, 15, utoX, utoY, w * 0.1);
    utoGrad.addColorStop(0.0, 'rgba(56, 189, 248, 0.75)');
    utoGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.35)');
    utoGrad.addColorStop(1.0, 'transparent');
    ctx.fillStyle = utoGrad;
    ctx.beginPath();
    ctx.ellipse(utoX, utoY, w * 0.11, h * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ice radar contour labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 11px "Rajdhani", sans-serif';
    ctx.fillText('SHARAD ICE SHEET: ~14,000 km³ H2O', utoX - 80, utoY - 30);
    ctx.fillText('SHALLOW ICE DEPTH: 1-2m', arcX - 60, arcY - 25);
    ctx.restore();
  };

  // Scientific Lat/Long coordinate grid
  const drawCoordinateGrid = (ctx, x, y, w, h, scale) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.lineWidth = 0.8;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '500 10px "Space Grotesk", monospace';

    // Latitude parallels: every 30 degrees (-60, -30, 0, 30, 60)
    for (let lat = -60; lat <= 60; lat += 30) {
      const ny = (90 - lat) / 180;
      const lineY = y + ny * h;

      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(x, lineY);
      ctx.lineTo(x + w, lineY);
      ctx.stroke();

      // Equator is solid
      if (lat === 0) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x, lineY);
        ctx.lineTo(x + w, lineY);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.fillText('0° EQUATOR', x + 12, lineY - 4);
      } else {
        const label = `${Math.abs(lat)}° ${lat > 0 ? 'N' : 'S'}`;
        ctx.fillText(label, x + 8, lineY - 4);
      }
    }

    // Longitude meridians: every 45 degrees (-135, -90, -45, 0, 45, 90, 135)
    for (let lng = -135; lng <= 135; lng += 45) {
      const nx = (lng + 180) / 360;
      const lineX = x + nx * w;

      ctx.beginPath();
      ctx.setLineDash([4, 6]);
      ctx.moveTo(lineX, y);
      ctx.lineTo(lineX, y + h);
      ctx.stroke();

      if (lng === 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(lineX, y);
        ctx.lineTo(lineX, y + h);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.fillText('0° MERIDIAN (Airy-0)', lineX + 4, y + 16);
      } else {
        const label = `${Math.abs(lng)}° ${lng > 0 ? 'E' : 'W'}`;
        ctx.fillText(label, lineX + 4, y + 16);
      }
    }
    ctx.restore();
  };

  // Interactive Marker Pin Drawing
  const drawMarker = (ctx, px, py, loc, isSelected, isHovered, iconCfg, pulse, showLabels, scale) => {
    ctx.save();
    const color = iconCfg.color || '#38bdf8';

    // Radar scanning pulse for active rovers or selected location
    if (loc.status === 'active' || isSelected) {
      const pulseRadius = 12 + Math.sin(pulse) * 8;
      ctx.beginPath();
      ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? 'rgba(34, 197, 94, 0.65)' : `${color}66`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer ripple
      ctx.beginPath();
      ctx.arc(px, py, pulseRadius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? 'rgba(34, 197, 94, 0.25)' : `${color}25`;
      ctx.stroke();
    }

    // Outer glow
    const outerRadius = isSelected ? 9 : isHovered ? 8 : 6;
    ctx.beginPath();
    ctx.arc(px, py, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? '#22c55e' : color;
    ctx.shadowColor = isSelected ? '#22c55e' : color;
    ctx.shadowBlur = isSelected ? 16 : 8;
    ctx.fill();

    // Center core
    ctx.beginPath();
    ctx.arc(px, py, outerRadius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#060913';
    ctx.shadowBlur = 0;
    ctx.fill();

    // Custom waypoint beacon pin ring
    if (loc.isCustom) {
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#22c55e';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
    }

    // Label Rendering
    if (showLabels || isSelected || isHovered) {
      const fontSize = isSelected ? 12 : 11;
      ctx.font = `600 ${fontSize}px "Rajdhani", sans-serif`;
      const labelText = loc.name;
      const textWidth = ctx.measureText(labelText).width;

      // Label background box
      ctx.fillStyle = 'rgba(6, 9, 19, 0.85)';
      ctx.strokeStyle = isSelected ? '#22c55e' : 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      const boxX = px + 12;
      const boxY = py - 18;
      const boxW = textWidth + 14;
      const boxH = 22;

      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.fillStyle = isSelected ? '#4ade80' : '#f8fafc';
      ctx.fillText(labelText, boxX + 7, boxY + 15);
    }

    ctx.restore();
  };

  // =========================================================================
  // MOUSE & TOUCH EVENT HANDLERS (PAN, ZOOM, SELECTION, LIVE TELEMETRY)
  // =========================================================================

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Handle Pan Drag
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }

    // Convert mouse position to Martian Geographic Lat/Long
    const coords = pixelToCoords(mouseX, mouseY, rect.width, rect.height, transform);
    const elevation = estimateMarsElevation(coords.lat, coords.lng);

    if (onHoverCoords) {
      onHoverCoords({ lat: coords.lat, lng: coords.lng, elevation });
    }

    // Check hit test against markers
    const dpr = window.devicePixelRatio || 1;
    const mapW = rect.width * transform.scale;
    const mapH = rect.height * transform.scale;
    const mapX = (rect.width - mapW) / 2 + transform.x;
    const mapY = (rect.height - mapH) / 2 + transform.y;

    let hit = null;
    for (const loc of filteredLocations) {
      const { nx, ny } = coordsToNormalized(loc.lat, loc.lng);
      const px = mapX + nx * mapW;
      const py = mapY + ny * mapH;
      const dist = Math.hypot(mouseX - px, mouseY - py);
      if (dist < 16) {
        hit = loc;
        break;
      }
    }

    setHoveredLocation(hit);
    setTooltipPos({ x: mouseX, y: mouseY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (hoveredLocation) {
      setSelectedLocation(hoveredLocation);
      return;
    }

    // If clicked on empty surface, select custom coordinate
    const coords = pixelToCoords(mouseX, mouseY, rect.width, rect.height, transform);
    const elevation = estimateMarsElevation(coords.lat, coords.lng);
    const formatted = formatMarsCoords(coords.lat, coords.lng);

    const surfaceSelection = {
      id: `coord-${Date.now()}`,
      name: `Martian Surface Point`,
      category: 'crater',
      categoryLabel: 'Surface Coordinate',
      lat: Number(coords.lat.toFixed(2)),
      lng: Number(coords.lng.toFixed(2)),
      elevation: elevation,
      diameter: 10,
      mission: 'Manual Exploration Target Lock',
      landingDate: 'Current Sol',
      status: 'geological',
      description: `Exploration coordinate targeting ${formatted.latStr}, ${formatted.lngStr} at estimated elevation ${elevation > 0 ? '+' : ''}${elevation}m MOLA datum.`,
      survivalViability: {
        score: Math.max(30, Math.min(85, Math.round(65 - Math.abs(coords.lat) * 0.4 + (elevation < 0 ? 15 : -10)))),
        tier: coords.lat > 35 ? 'Glacial Permafrost Zone' : coords.lat < -30 ? 'Southern Highlands Regolith' : 'Equatorial Exploration Strip',
        waterIce: coords.lat > 40 ? 'High (Permafrost present)' : 'Low to Trace',
        atmosphere: elevation < -4000 ? '9.1 mbar (Depressed basin)' : '6.1 mbar (Standard surface)',
        radiation: 'Moderate surface flux',
        solarPower: Math.abs(coords.lat) < 25 ? 'High (Tropical solar angle)' : 'Moderate',
        terrain: 'Martian regolith, crater ejecta, basalt sand ripples'
      },
      tacticalNotes: 'Inspect terrain stability before deploying crew rover or descent modules.'
    };

    setSelectedLocation(surfaceSelection);
    if (onSelectCoordinate) {
      onSelectCoordinate(surfaceSelection);
    }
  };

  // Wheel Zoom (smooth centered zoom)
  const handleWheel = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setTransform((prev) => {
      const newScale = Math.max(0.85, Math.min(8.0, prev.scale * zoomFactor));
      // Zoom toward cursor
      const ratio = newScale / prev.scale;
      const newX = mouseX - (mouseX - prev.x) * ratio;
      const newY = mouseY - (mouseY - prev.y) * ratio;
      return { x: newX, y: newY, scale: newScale };
    });
  };

  // Zoom HUD buttons
  const zoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(8.0, prev.scale * 1.3)
    }));
  };

  const zoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.85, prev.scale * 0.77)
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="mars-map-canvas-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'crosshair',
        backgroundColor: '#060913'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />

      {/* Floating HUD Zoom & Compass Controls */}
      <div className="canvas-hud-controls">
        <button
          type="button"
          className="hud-ctrl-btn"
          onClick={zoomIn}
          title="Zoom In (Wheel Up)"
        >
          +
        </button>
        <button
          type="button"
          className="hud-ctrl-btn"
          onClick={zoomOut}
          title="Zoom Out (Wheel Down)"
        >
          −
        </button>
        <button
          type="button"
          className="hud-ctrl-btn hud-reset-btn"
          onClick={resetView}
          title="Reset Global View"
        >
          ⟲
        </button>
        <div className="hud-scale-indicator">
          {transform.scale.toFixed(1)}x
        </div>
      </div>

      {/* Hover Marker Tooltip Preview */}
      {hoveredLocation && (
        <div
          className="marker-hover-tooltip"
          style={{
            position: 'absolute',
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y + 14}px`,
            pointerEvents: 'none'
          }}
        >
          <div className="tooltip-badge">{hoveredLocation.categoryLabel}</div>
          <div className="tooltip-title">{hoveredLocation.name}</div>
          <div className="tooltip-meta">
            <span>{hoveredLocation.lat >= 0 ? `${hoveredLocation.lat}°N` : `${Math.abs(hoveredLocation.lat)}°S`}</span>,{' '}
            <span>{hoveredLocation.lng >= 0 ? `${hoveredLocation.lng}°E` : `${Math.abs(hoveredLocation.lng)}°W`}</span>
          </div>
          {hoveredLocation.survivalViability && (
            <div className="tooltip-viability">
              Survival Rating: <strong>{hoveredLocation.survivalViability.score}/100</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
