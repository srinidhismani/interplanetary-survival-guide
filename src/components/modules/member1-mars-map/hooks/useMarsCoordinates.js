// Custom Hook: Mars Planetary Geodesy & Coordinate Engine
// Member 1 - Interactive Mars Map Module

import { useState, useCallback, useMemo } from 'react';

// Martian physical constants
export const MARS_RADIUS_KM = 3389.5; // Mean volumetric radius
export const MARS_CIRCUMFERENCE_KM = 2 * Math.PI * MARS_RADIUS_KM; // ~21,296 km
export const MARS_SOL_HOURS = 24.65979; // 24h 39m 35.244s

/**
 * Format decimal degrees into scientific Martian coordinates notation (e.g. 18° 22' 48" N, 77° 34' 48" E)
 */
export function formatMarsCoords(lat, lng) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return { latStr: '--°--\' N', lngStr: '--°--\' E', shortStr: 'Awaiting Target Lock' };
  }

  const latHem = lat >= 0 ? 'N' : 'S';
  const lngHem = lng >= 0 ? 'E' : 'W';

  const absLat = Math.abs(lat);
  const latDeg = Math.floor(absLat);
  const latMin = Math.floor((absLat - latDeg) * 60);
  const latSec = Math.round(((absLat - latDeg) * 60 - latMin) * 60);

  const absLng = Math.abs(lng);
  const lngDeg = Math.floor(absLng);
  const lngMin = Math.floor((absLng - lngDeg) * 60);
  const lngSec = Math.round(((absLng - lngDeg) * 60 - lngMin) * 60);

  const latStr = `${latDeg}°${latMin.toString().padStart(2, '0')}'${latSec.toString().padStart(2, '0')}" ${latHem}`;
  const lngStr = `${lngDeg}°${lngMin.toString().padStart(2, '0')}'${lngSec.toString().padStart(2, '0')}" ${lngHem}`;
  const shortStr = `${lat >= 0 ? '+' : ''}${lat.toFixed(2)}°, ${lng >= 0 ? '+' : ''}${lng.toFixed(2)}°`;

  return { latStr, lngStr, shortStr, lat, lng };
}

/**
 * Calculate Great Circle Distance between two coordinates on Mars surface
 */
export function calculateMarsDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(MARS_RADIUS_KM * c);
}

/**
 * Estimate elevation in meters from MOLA datum approximation
 */
export function estimateMarsElevation(lat, lng) {
  // Olympus Mons area
  if (lat > 13 && lat < 24 && lng > -140 && lng < -125) {
    const dist = Math.hypot(lat - 18.65, (lng - -133.8) * Math.cos(18.65 * Math.PI / 180));
    if (dist < 4) return Math.round(21900 - dist * 3500);
  }
  // Hellas Basin
  if (lat > -55 && lat < -30 && lng > 50 && lng < 95) {
    const dist = Math.hypot(lat - -42.4, (lng - 70.5) * Math.cos(-42.4 * Math.PI / 180));
    if (dist < 15) return Math.round(-7150 + dist * 250);
  }
  // Valles Marineris canyon
  if (lat > -20 && lat < -5 && lng > -90 && lng < -30) {
    return Math.round(-5500 + Math.sin(lng * 0.1) * 1500);
  }
  // Northern lowlands vs Southern highlands dichotomy
  if (lat > 20) {
    return Math.round(-3800 + Math.sin(lng * 0.05) * 800);
  } else if (lat < -10) {
    return Math.round(1800 + Math.cos(lat * 0.1) * 1200);
  }
  return Math.round(-1200 + Math.sin(lng * 0.05) * 900);
}

/**
 * Hook for live coordinate tracking, inspection, and distance calculation
 */
export function useMarsCoordinates() {
  const [cursorCoords, setCursorCoords] = useState({ lat: 0, lng: 0, elevation: -2400 });
  const [pinnedCoords, setPinnedCoords] = useState(null);

  const updateCursorCoords = useCallback((lat, lng) => {
    // Clamp to valid geographic ranges
    const clampedLat = Math.max(-90, Math.min(90, lat));
    let normalizedLng = ((lng + 180) % 360) - 180;
    if (normalizedLng < -180) normalizedLng += 360;

    const elevation = estimateMarsElevation(clampedLat, normalizedLng);
    setCursorCoords({ lat: clampedLat, lng: normalizedLng, elevation });
  }, []);

  const cursorFormatted = useMemo(() => {
    return formatMarsCoords(cursorCoords.lat, cursorCoords.lng);
  }, [cursorCoords]);

  const pinnedFormatted = useMemo(() => {
    if (!pinnedCoords) return null;
    return formatMarsCoords(pinnedCoords.lat, pinnedCoords.lng);
  }, [pinnedCoords]);

  return {
    cursorCoords,
    cursorFormatted,
    pinnedCoords,
    setPinnedCoords,
    updateCursorCoords,
    estimateElevation: estimateMarsElevation,
    calculateDistance: calculateMarsDistance,
    formatCoords: formatMarsCoords
  };
}
