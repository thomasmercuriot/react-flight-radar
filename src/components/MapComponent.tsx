import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // run npm install -D @types/leaflet for TypeScript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent: React.FC = () => {
  return (
    <MapContainer center={[49.008434, 2.552350]} zoom={13} scrollWheelZoom={false} style={{ height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[49.008434, 2.552350]}>
        <Popup>
          Hello from react-flight-radar !
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
