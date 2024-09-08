import React, { useState, useEffect } from 'react';
import './styles/PopupComponent.css';
import axios from 'axios'; // npm install axios | Axios is a simple promise based HTTP client for the browser and node.js.

interface PopupComponentProps {
  flight: {
    icao24: string;
    callsign: string | null;
    baro_altitude: number | null;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    geo_altitude: number | null;
    squawk: string | null;
  } | null;
  onClose: () => void;
}

const PopupComponent: React.FC<PopupComponentProps> = ({ flight, onClose }) => {
  const [registration, setRegistration] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistration = async (icao24: string) => {
    try {
      setLoading(true);
      setError(null);
      if (!icao24) return;
      const response = await axios.get(`http://localhost:8000/api/registration/${icao24}`); // I am running my Node.js API locally on port 8000.
      setRegistration(response.data.registration); // See API documentation for the expected response (https://github.com/thomasmercuriot/node-flight-radar).
    } catch (error) {
      console.log('Error fetching registration:', error);
      setError('Error fetching registration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flight && flight.icao24) {
      fetchRegistration(flight.icao24);
    } else {
      setRegistration(null);
    }
  }, [flight]);

  if (!flight) return null;

  return (
    <div className="flight-info-popup">
      <button className="close-btn" onClick={onClose}>X</button>
      <h3>Flight Information</h3>
      <h2>ICAO24: {flight.icao24}</h2>
      <h2>Callsign: {flight.callsign}</h2>
      {loading ? (
        <h2>Loading registration...</h2>
      ) : error ? (
        <h2 className="error">{error}</h2>
      ) : (
        <h2>Registration: {registration || 'N/A'}</h2>
      )}
      <p>Altitude: {flight.baro_altitude} ft</p>
      <p>Velocity: {flight.velocity} kt</p>
      <p>Track: {flight.true_track}°</p>
      <p>Vertical Rate: {flight.vertical_rate} fpm</p>
      <p>Geo Altitude: {flight.geo_altitude} ft</p>
      <p>Squawk: {flight.squawk}</p>
    </div>
  );
};

export default PopupComponent;
