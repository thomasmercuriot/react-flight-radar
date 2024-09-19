import React, { useState, useEffect } from 'react';
import './styles/PopupComponent.css';
import axios from 'axios'; // npm install axios | Axios is a simple promise based HTTP client for the browser and node.js.
import aircraftIconFlight from '../assets/icon-flight-origin-destination.png'; // https://www.iconfinder.com/font-awesome.
import aircraftIconWhite from '../assets/icon-plane-white.png'; // https://www.flaticon.com/fr/icone-gratuite/avion_5655607?term=avion&page=1&position=3&origin=tag&related_id=5655607.

// Read API documentation at https://github.com/thomasmercuriot/node-flight-radar.
// In addition to the API documentation, I will detail the code as much as possible.

interface PopupComponentProps {
  flight: {
    icao24: string; // Unique ICAO 24-bit address of the transponder in hex string representation.
    callsign: string | null; // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
    last_contact: number | null; // Unix timestamp (seconds) for the last update in general.
    longitude: number | null; // WGS-84 longitude in decimal degrees. Can be null.
    latitude: number | null; // WGS-84 latitude in decimal degrees. Can be null.
    baro_altitude: number | null; // Barometric altitude in meters. Can be null.
    velocity: number | null; // Velocity over ground in m/s. Can be null.
    true_track: number | null; // True track in decimal degrees clockwise from north (north=0°). Can be null.
    vertical_rate: number | null; // Vertical rate in m/s. A positive value indicates climbing, a negative value indicates descending. Can be null.
    geo_altitude: number | null; // Geometric altitude in meters. Can be null.
    squawk: string | null; // The transponder code aka Squawk. Can be null.
  } | null;
  onClose: () => void;
  onShowDetailed: () => void;
  hidden: boolean;
};

interface FlightOverview { // General information about the flight.
  registration: string | null; // Aircraft registration number. Retrieved from fetchRegistration.
  callsign: string | null;
  airline: string | null; // Airline name.
  duration: string | null; // Average duration of the flight.
  distance: string | null; // Distance between origin and destination.
  operationDays: string[] | null; // Days of the week the flight operates.
}

interface FlightLocation { // Origin and destination locations.
  city: string | null; // City name.
  code: string | null; // IATA code.
  airport: string | null; // Airport name.
}

interface FlightTime { // Departure and arrival times.
  date: string | null; // Date of the flight.
  scheduled: string | null; // Scheduled time.
  departed?: string | null; // Optional because some flights may not have departed yet.
  estimated?: string | null; // Optional because it may not always be available.
  timezone: string | null; // Timezone.
  terminal: string | null; // Terminal number.
  gate: string | null; // Gate number.
  status: string; // Departed, landed, cancelled, etc.
}

interface FlightProgress { // Flight progress information.
  percentage: number | null; // Percentage of the flight completed. Useful if I want to display a progress bar and calculate the traveled distance.
  status: string | null; // On time, delayed, etc.
}

interface AircraftInfo { // Information about the aircraft.
  type: string | null; // Aircraft type/model.
  transponder: string | null; // Transponder code.
  serial: string | null; // Aircraft's serial number.
}

interface CurrentFlight { // The current flight's flight number.
  flightNumber: string | null; // Flight number.
}

interface PastFlight { // Information about past flights. Useful for historical data.
  date: string | null; // Date of the flight.
  callsign: string | null; // Callsign.
  origin: string | null; // Origin airport.
  scheduledDeparture: string | null; // Scheduled departure time.
  actualDeparture: string | null; // Actual departure time.
  destination: string | null; // Destination airport.
  scheduledArrival: string | null; // Scheduled arrival time.
  delay: string | null; // Delay in minutes.
  status: string | null; // Departed, landed, cancelled, etc.
  duration: string | null; // Duration of the flight.
}

interface AdditionalFlightData { // Regroup all the additional data.
  registration: string;
  data: {
    overview: FlightOverview;
    origin: FlightLocation;
    destination: FlightLocation;
    departure: FlightTime;
    arrival: FlightTime;
    progress: FlightProgress;
    aircraft: AircraftInfo;
    thisFlight: CurrentFlight;
    otherFlights: PastFlight[];
  };
}

interface AircraftPhoto { // Aircraft photo information.
  photo: {
    photoUrl: string; // URL of the photo retrieved from https://airhistory.net/.
    photoData: {
      registration: string | null;
      alternateRegistration?: string | null; // Optional because some photos may not have this information.
      aircraftType: string | null; // Aircraft type/model. Might be more detailed than the one in AircraftInfo.
      aircraftLivery?: string | null; // Optional because some photos may not have this information.
      locationAirport: string | null; // Location where the photo was taken.
      locationCountry: string | null; // Country where the photo was taken.
      date: string | null; // Date the photo was taken.
      photographer: string | null; // Photographer's name.
    };
  }
}

const PopupComponent: React.FC<PopupComponentProps> = ({ flight, onClose, onShowDetailed, hidden }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [additionalFlightData, setAdditionalFlightData] = useState<AdditionalFlightData | null>(null);
  const [aircraftPhoto, setAircraftPhoto] = useState<AircraftPhoto | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (flight && flight.icao24) {

      const fetchRegistration = async (icao24: string) => {
        try {
          setLoading(true);
          setError(null);

          const registrationResponse = await axios.get<{ registration: string }>(`http://localhost:8000/api/registration/${icao24}`); // I am running my Node.js API locally on port 8000.
          const registration = registrationResponse.data.registration; // See API documentation for the expected response (https://github.com/thomasmercuriot/node-flight-radar).

          const additionalFlightDataResponse = await axios.get<AdditionalFlightData>(`http://localhost:8000/api/aircraft/${registration}`);
          setAdditionalFlightData(additionalFlightDataResponse.data);

          const aircraftPhotoResponse = await axios.get<AircraftPhoto>(`http://localhost:8000/api/photo/${registration}`);
          setAircraftPhoto(aircraftPhotoResponse.data);

          setLoading(false);

        } catch (error) {
          console.log('Error fetching additional flight data:', error);
          setError('Error fetching additional flight data');
          setLoading(false);
        }
      };

      fetchRegistration(flight.icao24);
    };
  }, [flight]);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'green'; // Vert pour "on time"
      case 'delayed':
        return 'orange'; // Orange pour "delayed"
      case 'cancelled':
        return 'red'; // Rouge pour "cancelled"
      default:
        return 'white'; // Couleur par défaut
    }
  };

  if (!flight) return null;

  return (
    <div className={`flight-info-popup ${isClosing ? 'closing' : ''} ${hidden ? 'hidden' : ''}`}>
      <div className="flight-info-popup-header">
        <div className="flight-info-popup-header-left">
          <div className="header-text-upper">
            {flight.callsign && <p id="header-text-upper-callsign">{flight.callsign}</p>}
            {additionalFlightData && (
              <div id="header-text-upper-pill">
                <p id="header-text-upper-flightNumber">{additionalFlightData.data.thisFlight.flightNumber}</p>
              </div>
            )}
            {additionalFlightData && (
              <div id="header-text-upper-pill-reg">
                <p id="header-text-upper-registration">{additionalFlightData.registration}</p>
              </div>
            )}
          </div>
          <div className="header-text-lower">
            {additionalFlightData && <p id="header-text-lower-airline">{additionalFlightData.data.overview.airline}</p>}
            {aircraftPhoto && <p id="header-text-lower-aircraft">{aircraftPhoto.photo.photoData.aircraftType}</p>}
          </div>
        </div>
        <div className="flight-info-popup-header-right">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {aircraftPhoto && (
          <div className="image-container">
            <img src={aircraftPhoto.photo.photoUrl} alt="Aircraft" id='aircraft-photo' />
          </div>
        )}
        </div>
      </div>
      <div className="flight-info-popup-body">
        <div className="flight-info-popup-body-top">
          <div className="flight-info-popup-body-top-airports">
            {additionalFlightData && (
              <div className="origin-airport">
                <h2 id="origin-airport-code">{additionalFlightData.data.origin.code && additionalFlightData.data.origin.code.slice(1,5)}</h2>
                <p id="origin-airport-city">{additionalFlightData.data.origin.city}</p>
              </div>
            )}
            <img src={aircraftIconFlight} alt="origin-destination-icon" />
            {additionalFlightData && (
              <div className="destination-airport">
                <h2 id="destination-airport-code">{additionalFlightData.data.destination.code && additionalFlightData.data.destination.code.slice(1,5)}</h2>
                <p id="destination-airport-city">{additionalFlightData.data.destination.city}</p>
              </div>
            )}
          </div>
          <div className="flight-info-popup-body-top-progress-bar">
            {additionalFlightData?.data.progress.percentage && (
              <div className="progress-bar-fill" style={{ width: (additionalFlightData.data.progress.percentage) + '%' }}></div>
            )}
            <img src={aircraftIconWhite} alt="Aircraft Icon" />
            {additionalFlightData?.data.progress.percentage && (
              <div className="progress-bar-empty" style={{ width: ( 90 - additionalFlightData.data.progress.percentage) + '%' }}></div>
            )}
          </div>
          <div className="flight-info-popup-body-top-arrival">
            {additionalFlightData?.data.progress.status && (
              <div className="estimated-arrival">
                <p>{additionalFlightData.data.progress.status.charAt(0).toUpperCase() + additionalFlightData.data.progress.status.slice(1).replace(/h\s/, 'h')}</p>
              </div>
            )}
            {additionalFlightData && (
              <div className="arrival-status">
                <p style={{ color: getStatusColor(additionalFlightData.data.arrival.status) }}>●</p>
                <p>{additionalFlightData.data.arrival.status}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flight-info-popup-body-bottom">
          <button id='hidden-button' onClick={handleCloseClick}>View all Live Flight Data</button>
          <button onClick={onShowDetailed}>View all Live Flight Data</button>
        </div>
      </div>
      <h3>Flight Information</h3>
      <h2>ICAO24: {flight.icao24}</h2>
      <h2>Callsign: {flight.callsign}</h2>
      <p>Last Contact: {flight.last_contact}</p>
      <p>Longitude: {flight.longitude}</p>
      <p>Latitude: {flight.latitude}</p>
      <p>Altitude: {flight.baro_altitude} ft</p>
      <p>Velocity: {flight.velocity} kt</p>
      <p>Track: {flight.true_track}°</p>
      <p>Vertical Rate: {flight.vertical_rate} fpm</p>
      <p>Geo Altitude: {flight.geo_altitude} ft</p>
      <p>Squawk: {flight.squawk}</p>
      <h3>Aircraft Photo</h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {aircraftPhoto && (
        <div className="image-container">
          <img src={aircraftPhoto.photo.photoUrl} alt="Aircraft" id='aircraft-photo' />
          <h2>Registration: {aircraftPhoto.photo.photoData.registration}</h2>
          {aircraftPhoto.photo.photoData.alternateRegistration && <p>Alternate Registration: {aircraftPhoto.photo.photoData.alternateRegistration}</p>}
          <p>Aircraft Type: {aircraftPhoto.photo.photoData.aircraftType}</p>
          {aircraftPhoto.photo.photoData.aircraftLivery && <p>Aircraft Livery: {aircraftPhoto.photo.photoData.aircraftLivery}</p>}
          <p>Location: {aircraftPhoto.photo.photoData.locationAirport}, {aircraftPhoto.photo.photoData.locationCountry}</p>
          <p>Date: {aircraftPhoto.photo.photoData.date}</p>
          <p>Photographer: {aircraftPhoto.photo.photoData.photographer}</p>
        </div>
      )}
      <h3>Additional Flight Data</h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {additionalFlightData && (
        <div>
          <h2>Registration: {additionalFlightData.registration}</h2>
          <h3>Overview</h3>
          <p>Airline: {additionalFlightData.data.overview.airline}</p>
          <p>Duration: {additionalFlightData.data.overview.duration}</p>
          <p>Distance: {additionalFlightData.data.overview.distance}</p>
          <p>Operation Days: {additionalFlightData.data.overview.operationDays?.join(', ')}</p>
          <h3>Origin</h3>
          <p>City: {additionalFlightData.data.origin.city}</p>
          <p>Code: {additionalFlightData.data.origin.code}</p>
          <p>Airport: {additionalFlightData.data.origin.airport}</p>
          <h3>Destination</h3>
          <p>City: {additionalFlightData.data.destination.city}</p>
          <p>Code: {additionalFlightData.data.destination.code}</p>
          <p>Airport: {additionalFlightData.data.destination.airport}</p>
          <h3>Departure</h3>
          <p>Date: {additionalFlightData.data.departure.date}</p>
          <p>Scheduled: {additionalFlightData.data.departure.scheduled}</p>
          <p>Departed: {additionalFlightData.data.departure.departed}</p>
          <p>Estimated: {additionalFlightData.data.departure.estimated}</p>
          <p>Timezone: {additionalFlightData.data.departure.timezone}</p>
          <p>Terminal: {additionalFlightData.data.departure.terminal}</p>
          <p>Gate: {additionalFlightData.data.departure.gate}</p>
          <p>Status: {additionalFlightData.data.departure.status}</p>
          <h3>Arrival</h3>
          <p>Date: {additionalFlightData.data.arrival.date}</p>
          <p>Scheduled: {additionalFlightData.data.arrival.scheduled}</p>
          <p>Timezone: {additionalFlightData.data.arrival.timezone}</p>
          <p>Terminal: {additionalFlightData.data.arrival.terminal}</p>
          <p>Gate: {additionalFlightData.data.arrival.gate}</p>
          <p>Status: {additionalFlightData.data.arrival.status}</p>
          <h3>Progress</h3>
          <p>Percentage: {additionalFlightData.data.progress.percentage}</p>
          <p>Status: {additionalFlightData.data.progress.status}</p>
          <h3>Aircraft</h3>
          <p>Type: {additionalFlightData.data.aircraft.type}</p>
          <p>Transponder: {additionalFlightData.data.aircraft.transponder}</p>
          <p>Serial: {additionalFlightData.data.aircraft.serial}</p>
          <h3>Other Flights</h3>
          <ul>
            {additionalFlightData.data.otherFlights.map((flight, index) => (
              <li key={index}>
                <p>Date: {flight.date}</p>
                <p>Callsign: {flight.callsign}</p>
                <p>Origin: {flight.origin}</p>
                <p>Scheduled Departure: {flight.scheduledDeparture}</p>
                <p>Actual Departure: {flight.actualDeparture}</p>
                <p>Destination: {flight.destination}</p>
                <p>Scheduled Arrival: {flight.scheduledArrival}</p>
                <p>Delay: {flight.delay}</p>
                <p>Status: {flight.status}</p>
                <p>Duration: {flight.duration}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PopupComponent;
