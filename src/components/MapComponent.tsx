import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // run npm install -D @types/leaflet for TypeScript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import plane from '../assets/images/icons/plane-icon.svg';
// import pinplane from '../assets/images/icons/pinplane.svg';
import dot from '../assets/images/icons/dot.svg';
import { fetchFlights } from '../services/openSkyAPIService';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow
// });

// L.Marker.prototype.options.icon = customMarker;

const customMarkerOptions: L.IconOptions = {
  iconUrl: dot,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  // shadowUrl: dot,
  // shadowSize: [10, 10],
  // shadowAnchor: [0, 0],
};

const customMarker = L.icon(customMarkerOptions);
L.Marker.prototype.options.icon = customMarker;

interface Flight {
  icao24: string | null;
  longitude: number | null;
  latitude: number | null;
  velocity: number | null;
}

const MapComponent: React.FC = () => {

  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await fetchFlights(); // lamin, lomin, lamax, lomax 48.9910, 2.4907, 49.0282, 2.6270
        const transformedFlights: Flight[] = data.states
        .filter((state: any[]) => state[5] !== null && state[6] !== null)
        .map((state: any[]) => ({
          icao24: state[0],
          longitude: state[5],
          latitude: state[6],
          velocity: state[9] !== null ? state[9] * 3.6 : null,
        }));
        setFlights(transformedFlights);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    getFlights();
  }, []);

  return (
    <MapContainer
      center={[49.008434, 2.552350]}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[49.008434, 2.552350]}>
        <Popup>
          Hello from react-flight-radar !
        </Popup>
      </Marker>
      {flights.map((flight, index) => (
        flight.latitude !== null && flight.longitude !== null && (
          <Marker key={index} position={[flight.latitude, flight.longitude]}>
            <Popup>
              Flight ICAO24: {flight.icao24} <br />
              Speed: {flight.velocity !== null ? `${flight.velocity.toFixed(2)} km/h` : 'N/A'}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapComponent;
