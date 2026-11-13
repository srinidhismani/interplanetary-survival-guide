// Interactive 3D Photorealistic Mars Globe Component
// Powered by Three.js WebGL Engine
// Features: Spherical Coordinate Projection, 3D Interactive Location Pins,
// Atmospheric Glow Shader, Orbital Drag/Zoom, Real-Time Raycasting, Auto-Rotation.

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useMarsMission } from '../../../../context/MarsMissionContext';
import { CATEGORY_ICONS } from '../data/marsLocations';
import { formatMarsCoords, estimateMarsElevation } from '../hooks/useMarsCoordinates';

export default function MarsGlobe3D({ onHoverCoords, onSelectCoordinate }) {
  const mountRef = useRef(null);
  const {
    allLocations,
    selectedLocation,
    setSelectedLocation,
    activeLayer,
    filterCategory,
    searchQuery,
    flyToTarget
  } = useMarsMission();

  const [isRotating, setIsRotating] = useState(true);
  const [hoveredLoc, setHoveredLoc] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Filtered locations
  const filteredLocations = allLocations.filter((loc) => {
    const matchesCat = filterCategory === 'all' || loc.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.mission && loc.mission.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Convert Lat/Lng to 3D Cartesian Vector on Sphere of radius R
  const latLngToVector3 = useCallback((lat, lng, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }, []);

  // Convert 3D Vector on sphere back to Lat/Lng
  const vector3ToLatLng = useCallback((vec3) => {
    const norm = vec3.clone().normalize();
    const lat = 90 - Math.acos(norm.y) * (180 / Math.PI);
    let lng = Math.atan2(norm.z, -norm.x) * (180 / Math.PI) - 180;
    if (lng < -180) lng += 360;
    if (lng > 180) lng -= 360;
    return { lat, lng };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // 2. Deep Space Starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.12,
      transparent: true,
      opacity: 0.75
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 3. Procedural High-Res Texture for Active Layer
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Generate Mars planetary texture according to active layer
    const renderGlobeTexture = (type) => {
      const w = 2048;
      const h = 1024;

      if (type === 'topography') {
        const grad = ctx.createLinearGradient(0, h, 0, 0);
        grad.addColorStop(0.0, '#0369a1');
        grad.addColorStop(0.2, '#0284c7');
        grad.addColorStop(0.4, '#15803d');
        grad.addColorStop(0.6, '#eab308');
        grad.addColorStop(0.85, '#dc2626');
        grad.addColorStop(1.0, '#ffffff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (type === 'infrared') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0.0, '#1e1b4b');
        grad.addColorStop(0.3, '#4338ca');
        grad.addColorStop(0.6, '#06b6d4');
        grad.addColorStop(0.8, '#f59e0b');
        grad.addColorStop(1.0, '#fef08a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (type === 'relief') {
        const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 80, w * 0.5, h * 0.5, w * 0.7);
        grad.addColorStop(0.0, '#334155');
        grad.addColorStop(0.6, '#1e293b');
        grad.addColorStop(1.0, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else {
        // True color Viking Optical
        const grad = ctx.createRadialGradient(w * 0.45, h * 0.5, 100, w * 0.5, h * 0.5, w * 0.8);
        grad.addColorStop(0.0, '#b45309');
        grad.addColorStop(0.35, '#9a3412');
        grad.addColorStop(0.7, '#7c2d12');
        grad.addColorStop(1.0, '#451a03');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Albedo dark basalt markings (Syrtis Major)
      ctx.fillStyle = type === 'topography' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(30, 10, 5, 0.6)';
      ctx.filter = 'blur(16px)';
      ctx.beginPath();
      ctx.ellipse(w * 0.8, h * 0.44, w * 0.08, h * 0.12, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Hellas Basin
      ctx.beginPath();
      ctx.ellipse(w * 0.69, h * 0.73, w * 0.09, h * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Olympus Mons
      ctx.filter = 'none';
      ctx.fillStyle = type === 'topography' ? '#ffffff' : '#ea580c';
      ctx.beginPath();
      ctx.arc(w * 0.128, h * 0.39, 28, 0, Math.PI * 2);
      ctx.fill();

      // Valles Marineris canyon rift
      ctx.strokeStyle = type === 'topography' ? '#0284c7' : '#270e03';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(w * 0.26, h * 0.58);
      ctx.bezierCurveTo(w * 0.32, h * 0.54, w * 0.38, h * 0.62, w * 0.44, h * 0.58);
      ctx.stroke();

      // North Polar Ice Cap
      const polarGrad = ctx.createLinearGradient(0, 0, 0, h * 0.08);
      polarGrad.addColorStop(0, '#ffffff');
      polarGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = polarGrad;
      ctx.fillRect(0, 0, w, h * 0.08);

      // South Polar Ice Cap
      const sPolarGrad = ctx.createLinearGradient(0, h * 0.92, 0, h);
      sPolarGrad.addColorStop(0, 'transparent');
      sPolarGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = sPolarGrad;
      ctx.fillRect(0, h * 0.92, w, h * 0.08);
    };

    renderGlobeTexture(activeLayer.type);
    const marsTexture = new THREE.CanvasTexture(canvas);
    marsTexture.colorSpace = THREE.SRGBColorSpace;

    // 4. Mars Sphere Mesh
    const sphereRadius = 1.35;
    const marsGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const marsMaterial = new THREE.MeshStandardMaterial({
      map: marsTexture,
      roughness: 0.85,
      metalness: 0.1
    });
    const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
    scene.add(marsMesh);

    // 5. Atmospheric Haze Shell (Thin CO2 Martian atmosphere)
    const atmosGeometry = new THREE.SphereGeometry(sphereRadius * 1.025, 48, 48);
    const atmosMaterial = new THREE.MeshBasicMaterial({
      color: 0xfb923c,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    scene.add(atmosMesh);

    // 6. Lighting
    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    sunLight.position.set(5, 2, 4);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.4);
    scene.add(ambientLight);

    // 7. 3D Location Marker Group
    const markerGroup = new THREE.Group();
    marsMesh.add(markerGroup);

    const markerMeshes = [];

    filteredLocations.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, sphereRadius * 1.015);
      const isSelected = selectedLocation && selectedLocation.id === loc.id;
      const iconCfg = CATEGORY_ICONS[loc.category] || CATEGORY_ICONS.rover;

      // Pin Pinhead Geometry
      const pinGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x22c55e : new THREE.Color(iconCfg.color)
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { location: loc };
      markerGroup.add(pinMesh);
      markerMeshes.push(pinMesh);

      // Pin Needle Stem
      const stemGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.05, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.copy(pos.clone().multiplyScalar(0.985));
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      markerGroup.add(stemMesh);
    });

    // 8. Interaction & Controls (Orbit Drag, Zoom, Raycasting)
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onMouseDown = (e) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      rotationVelocityX = 0;
      rotationVelocityY = 0;
    };

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseVector.x = (mouseX / width) * 2 - 1;
      mouseVector.y = -(mouseY / height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;

        rotationVelocityX = deltaX * 0.004;
        rotationVelocityY = deltaY * 0.004;

        marsMesh.rotation.y += rotationVelocityX;
        marsMesh.rotation.x += rotationVelocityY;
        // Clamp x tilt to avoid flipping
        marsMesh.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, marsMesh.rotation.x));

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Raycast to find hovered location or surface coordinates
      raycaster.setFromCamera(mouseVector, camera);
      const markerIntersects = raycaster.intersectObjects(markerMeshes);

      if (markerIntersects.length > 0) {
        const hitLoc = markerIntersects[0].object.userData.location;
        setHoveredLoc(hitLoc);
        setTooltipPos({ x: mouseX, y: mouseY });
      } else {
        setHoveredLoc(null);

        // Raycast against Mars Globe surface to get Lat/Lng
        const globeIntersects = raycaster.intersectObject(marsMesh);
        if (globeIntersects.length > 0 && onHoverCoords) {
          const localPoint = marsMesh.worldToLocal(globeIntersects[0].point.clone());
          const coords = vector3ToLatLng(localPoint);
          const elev = estimateMarsElevation(coords.lat, coords.lng);
          onHoverCoords({ lat: coords.lat, lng: coords.lng, elevation: elev });
        }
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onClick = (e) => {
      const rect = mount.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseVector.x = (mouseX / width) * 2 - 1;
      mouseVector.y = -(mouseY / height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const markerIntersects = raycaster.intersectObjects(markerMeshes);

      if (markerIntersects.length > 0) {
        const hitLoc = markerIntersects[0].object.userData.location;
        setSelectedLocation(hitLoc);
      } else {
        const globeIntersects = raycaster.intersectObject(marsMesh);
        if (globeIntersects.length > 0) {
          const localPoint = marsMesh.worldToLocal(globeIntersects[0].point.clone());
          const coords = vector3ToLatLng(localPoint);
          const elev = estimateMarsElevation(coords.lat, coords.lng);
          const formatted = formatMarsCoords(coords.lat, coords.lng);

          const surfacePoint = {
            id: `3d-coord-${Date.now()}`,
            name: 'Orbital Recon Lock',
            category: 'crater',
            categoryLabel: 'Orbital Target Point',
            lat: Number(coords.lat.toFixed(2)),
            lng: Number(coords.lng.toFixed(2)),
            elevation: elev,
            diameter: 12,
            mission: '3D Globe Surface Intercept',
            landingDate: 'Current Sol',
            status: 'geological',
            description: `Orbital coordinates at ${formatted.latStr}, ${formatted.lngStr} with elevation ${elev}m MOLA datum.`,
            survivalViability: {
              score: 72,
              tier: 'Orbital Survey Sector',
              waterIce: 'Trace to moderate permafrost',
              atmosphere: '6.8 mbar',
              radiation: 'High orbital exposure',
              solarPower: 'Good',
              terrain: 'Impact ejecta plain'
            },
            tacticalNotes: 'Telemetry confirmed via Deep Space Network.'
          };

          setSelectedLocation(surfacePoint);
          if (onSelectCoordinate) onSelectCoordinate(surfacePoint);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.002;
      camera.position.z = Math.max(1.8, Math.min(6.5, camera.position.z + zoomDelta));
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    mount.addEventListener('click', onClick);
    mount.addEventListener('wheel', onWheel, { passive: false });

    // Handle FlyTo animation
    if (flyToTarget) {
      const targetPhi = (90 - flyToTarget.lat) * (Math.PI / 180);
      const targetTheta = (flyToTarget.lng + 180) * (Math.PI / 180);
      // Smoothly orient globe so target faces camera
      marsMesh.rotation.y = -targetTheta + Math.PI / 2;
      marsMesh.rotation.x = targetPhi - Math.PI / 2;
    }

    // 9. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotation if enabled and not dragging
      if (isRotating && !isMouseDown) {
        marsMesh.rotation.y += 0.0018;
      }

      // Inertia decay
      if (!isMouseDown) {
        rotationVelocityX *= 0.94;
        rotationVelocityY *= 0.94;
        marsMesh.rotation.y += rotationVelocityX;
        marsMesh.rotation.x += rotationVelocityY;
      }

      // Starfield slow orbit
      starField.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [
    activeLayer,
    filteredLocations,
    selectedLocation,
    isRotating,
    flyToTarget,
    latLngToVector3,
    vector3ToLatLng
  ]);

  return (
    <div
      ref={mountRef}
      className="mars-globe-3d-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'grab'
      }}
    >
      {/* 3D Globe HUD Controls */}
      <div className="globe-hud-overlay">
        <button
          type="button"
          className={`hud-ctrl-btn ${isRotating ? 'active-glow' : ''}`}
          onClick={() => setIsRotating(!isRotating)}
          title="Toggle Auto-Rotation"
        >
          {isRotating ? '⏸ Rotate' : '▶ Rotate'}
        </button>
        <span className="hud-badge-3d">WebGL 3D Planetary Sphere</span>
      </div>

      {/* Hover Marker Tooltip Preview */}
      {hoveredLoc && (
        <div
          className="marker-hover-tooltip"
          style={{
            position: 'absolute',
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y + 14}px`,
            pointerEvents: 'none'
          }}
        >
          <div className="tooltip-badge">{hoveredLoc.categoryLabel}</div>
          <div className="tooltip-title">{hoveredLoc.name}</div>
          <div className="tooltip-meta">
            <span>{hoveredLoc.lat >= 0 ? `${hoveredLoc.lat}°N` : `${Math.abs(hoveredLoc.lat)}°S`}</span>,{' '}
            <span>{hoveredLoc.lng >= 0 ? `${hoveredLoc.lng}°E` : `${Math.abs(hoveredLoc.lng)}°W`}</span>
          </div>
          {hoveredLoc.survivalViability && (
            <div className="tooltip-viability">
              Survival Rating: <strong>{hoveredLoc.survivalViability.score}/100</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
