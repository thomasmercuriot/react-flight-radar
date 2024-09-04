import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl'; // npm install --save react-map-gl mapbox-gl @types/mapbox-gl
import 'mapbox-gl/dist/mapbox-gl.css'; // The base map library requires its stylesheet be included at all times.
import axios from 'axios'; // npm install axios | Axios is a simple promise based HTTP client for the browser and node.js.

interface MapComponentProps {
  accessToken: string;
  center: [number, number];
  zoom: number;
};

interface Aircraft {
  icao24: string;
  callsign: string;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  geo_altitude: number;
  squawk: string;
};

const MapComponent: React.FC<MapComponentProps> = ({ accessToken, center, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(center[0]);
  const [lat, setLat] = useState(center[1]);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds | null>(null); // The bounding box coordinates will be required when fetching our API.
  // Read API documentation at https://github.com/thomasmercuriot/node-flight-radar.
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);

  const fetchAircrafts = useCallback(async (boundingBox: mapboxgl.LngLatBounds | null) => {
    try {
      if (!boundingBox) return;
      const response = await axios.get('http://localhost:8000/api', { // I am running my Node.js API locally on port 8000.
        params: {
          lamin: boundingBox.getSouthWest().lat,
          lomin: boundingBox.getSouthWest().lng,
          lamax: boundingBox.getNorthEast().lat,
          lomax: boundingBox.getNorthEast().lng, // '/api?lamin=XXX&lomin=XXX&lamax=XXX&lomax=XXX'
        },
      });
      setAircrafts(response.data); // See API documentation for the expected response (https://github.com/thomasmercuriot/node-flight-radar).
    } catch (error) {
      console.log('Error fetching aircrafts:', error);
    }
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/thomasmercuriot/cm0mjab8c00bi01pj0oqm0v78', // Create your own style at https://studio.mapbox.com/.
      center: [lng, lat],
      zoom: mapZoom
    });

    map.current.on('load', () => {
      if (map.current) {
        setBounds(map.current.getBounds());
      }
    });

    map.current.on('move', () => {
      if (map.current) {
        setLng(Number(map.current.getCenter().lng.toFixed(4)));
        setLat(Number(map.current.getCenter().lat.toFixed(4)));
        setMapZoom(Number(map.current.getZoom().toFixed(2)));
        setBounds(map.current.getBounds());
      }
    });
  }, [accessToken, lng, lat, mapZoom]);

  useEffect(() => {
    if (bounds) {
      fetchAircrafts(bounds);
    }
  }, [bounds, fetchAircrafts]);

  useEffect(() => {
    if (map.current && aircrafts.length) {
      aircrafts.forEach((aircraft) => {
        const el = document.createElement('div');
        el.className = 'aircraft-marker';
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.backgroundColor = 'red';
        el.style.borderRadius = '50%';

        new mapboxgl.Marker(el)
          .setLngLat([aircraft.longitude, aircraft.latitude])
          .addTo(map.current!);
      });
    }
  }, [aircrafts]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '80vh', width: '100%' }} />
      <div>
        <p>Longitude: {lng} | Latitude: {lat} | Zoom: {mapZoom}</p>
        {bounds && (
          <p>
            Bounding Box:<br />
            - SW: [{bounds.getSouthWest().lng.toFixed(4)}, {bounds.getSouthWest().lat.toFixed(4)}]<br />
            - NE: [{bounds.getNorthEast().lng.toFixed(4)}, {bounds.getNorthEast().lat.toFixed(4)}]
          </p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
