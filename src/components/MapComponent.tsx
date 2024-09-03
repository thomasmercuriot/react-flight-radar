import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // npm install --save react-map-gl mapbox-gl @types/mapbox-gl
import 'mapbox-gl/dist/mapbox-gl.css'; // The base map library requires its stylesheet be included at all times.

interface MapComponentProps {
  accessToken: string;
  center: [number, number];
  zoom: number;
};

const MapComponent: React.FC<MapComponentProps> = ({ accessToken, center, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(center[0]);
  const [lat, setLat] = useState(center[1]);
  const [mapZoom, setMapZoom] = useState(zoom);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/thomasmercuriot/cm0mjab8c00bi01pj0oqm0v78',
      center: [lng, lat],
      zoom: mapZoom
    });

    map.current.on('move', () => {
      if (map.current) {
        setLng(Number(map.current.getCenter().lng.toFixed(4)));
        setLat(Number(map.current.getCenter().lat.toFixed(4)));
        setMapZoom(Number(map.current.getZoom().toFixed(2)));
      }
    });
  }, [accessToken, lng, lat, mapZoom]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} />
      <div>
        Longitude: {lng} | Latitude: {lat} | Zoom: {mapZoom}
      </div>
    </div>
  );
};

export default MapComponent;
