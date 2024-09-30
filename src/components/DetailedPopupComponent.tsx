import React, { useState, useEffect } from 'react';
import './styles/DetailedPopupComponent.css';
import { AdditionalFlightData, AircraftPhoto } from './PopupComponent';
import photoCredentialsIcon from '../assets/photo-credentials-icon.png'; // https://www.iconfinder.com/Kh.Artyom.
import aircraftIconFlight from '../assets/icon-flight-origin-destination.png'; // https://www.iconfinder.com/font-awesome.
import aircraftIconWhite from '../assets/icon-plane-white.png'; // https://www.flaticon.com/fr/icone-gratuite/avion_5655607?term=avion&page=1&position=3&origin=tag&related_id=5655607.
import informationIcon from '../assets/information-icon.png'; // https://www.iconfinder.com/DesignRevision.
import whiteDropdownIcon from '../assets/white-dropdown-icon.png'; // https://www.iconfinder.com/deemakdaksina.
import whiteLiftupIcon from '../assets/white-liftup-icon.png'; // https://www.iconfinder.com/deemakdaksina.
import whiteLocationIcon from '../assets/white-location-icon.png'; // https://www.iconfinder.com/font-awesome.
import whiteDateIcon from '../assets/white-date-icon.png'; // https://www.iconfinder.com/ionicons-icons.
import whiteLineIcon from '../assets/white-line-icon.png'; // https://www.iconfinder.com/deemakdaksina.

interface DetailedPopupComponentProps {
  flight: any;
  show: boolean;
  selectedFlightData: AdditionalFlightData | null;
  selectedFlightPhotoData: AircraftPhoto | null;
  onClose: () => void;
}

const DetailedPopupComponent: React.FC<DetailedPopupComponentProps> = ({ flight, show, selectedFlightData, selectedFlightPhotoData, onClose }) => {

  const [isVisible, setIsVisible] = useState(show);
  const [isClosing, setIsClosing] = useState(false);
  const [isExpandedPhoto, setIsExpandedPhoto] = useState(false);
  const [startTime] = useState(flight.last_contact);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [show]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleToggleExpandedPhoto = () => {
    setIsExpandedPhoto(!isExpandedPhoto);
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTime * 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!isVisible) return null;

  return (
    <div className={`detailed-popup ${isClosing ? 'hidden' : ''}`}>
      <div className="detailed-popup-banner">
        <div className="detailed-popup-banner-upper">
          {flight.callsign && (
            <p id="detailed-popup-banner-upper-callsign">{flight.callsign}</p>
          )}
          {selectedFlightData?.data.thisFlight.flightNumber && (
            <div className="detailed-popup-banner-upper-pill">
              <p id="detailed-popup-banner-upper-flight-number">{selectedFlightData.data.thisFlight.flightNumber}</p>
            </div>
          )}
          {selectedFlightData?.registration && (
            <div className="detailed-popup-banner-upper-pill">
              <p id="detailed-popup-banner-upper-registration">{selectedFlightData.registration}</p>
            </div>
          )}
        </div>
        <div className="detailed-popup-banner-lower">
          {selectedFlightData?.data.overview.airline && (
            <p id="detailed-popup-banner-lower-airline">{selectedFlightData.data.overview.airline}</p>
          )}
          {selectedFlightPhotoData?.photo.photoData.aircraftType && (
            <p id="detailed-popup-banner-lower-aircraft">{selectedFlightPhotoData.photo.photoData.aircraftType}</p>
          )}
        </div>
      </div>
      <div className="detailed-popup-body">
        <div className="detailed-popup-body-image-container">
          <div className="detailed-popup-body-image">
            {selectedFlightPhotoData?.photo.photoUrl && (
              <img src={selectedFlightPhotoData?.photo.photoUrl} alt={selectedFlightData?.registration} />
            )}
          </div>
          <div
            className={`detailed-popup-body-image-credentials ${isExpandedPhoto ? 'expanded-photo' : ''}`}
            onClick={handleToggleExpandedPhoto}
          >
            {selectedFlightPhotoData?.photo.photoData.photographer && (
              <div className="detailed-popup-body-image-credentials-photographer">
                <img src={photoCredentialsIcon} alt="Photographer" />
                <p id="detailed-popup-body-image-credentials-photographer">Photographer : {selectedFlightPhotoData.photo.photoData.photographer}</p>
                <span id="detailed-popup-body-image-credentials-photographer-button"
                  style={{backgroundImage: isExpandedPhoto ? `url(${whiteLiftupIcon})` : `url(${whiteDropdownIcon})`}}
                  >
                </span>
              </div>
            )}
            {selectedFlightPhotoData?.photo.photoData.photographer && isExpandedPhoto && (
              <div className="detailed-popup-body-image-credentials-expanded">
                <div className="detailed-popup-body-image-credentials-location">
                  <img src={whiteLocationIcon} alt="Location" />
                  <p id="detailed-popup-body-image-credentials-location">
                    Location : {selectedFlightPhotoData?.photo?.photoData?.locationAirport?.slice(0,-3).length < 30 ?
                      `${selectedFlightPhotoData?.photo?.photoData?.locationAirport?.slice(0,-3)}` :
                      `${selectedFlightPhotoData?.photo?.photoData?.locationAirport?.slice(0,30)}...`}
                  </p>
                </div>
                <div className="detailed-popup-body-image-credentials-date">
                  <img src={whiteDateIcon} alt="Date" />
                  <p id="detailed-popup-body-image-credentials-date">Date : {selectedFlightPhotoData.photo.photoData.date}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="detailed-popup-body-overview">
          <div className="detailed-popup-body-overview-airports">
            <div className="detailed-popup-body-overview-airports-origin">
              {selectedFlightData?.data.origin.code && (
                <p id="detailed-popup-body-overview-airports-origin-code">{
                  selectedFlightData.data.origin.code.slice(1, 4)
                }</p>
              )}
              {selectedFlightData?.data.origin.city && (
                <p id="detailed-popup-body-overview-airports-origin-city">{selectedFlightData.data.origin.city}</p>
              )}
              {selectedFlightData?.data.departure.timezone && (
                <p id="detailed-popup-body-overview-airports-origin-timezone">{
                  selectedFlightData?.data?.departure?.timezone?.match(/\(UTC[-+]?\d{2}:\d{2}\)/)?.[0]
                }</p>
              )}
            </div>
            <div className="detailed-popup-overview-airports-icon">
              <img src={aircraftIconFlight} alt="Flight Origin & Destination" />
            </div>
            <div className="detailed-popup-body-overview-airports-destination">
              {selectedFlightData?.data.destination.code && (
                <p id="detailed-popup-body-overview-airports-destination-code">{
                  selectedFlightData.data.destination.code.slice(1, 4)
                }</p>
              )}
              {selectedFlightData?.data.destination.city && (
                <p id="detailed-popup-body-overview-airports-destination-city">{selectedFlightData.data.destination.city}</p>
              )}
              {selectedFlightData?.data.arrival.timezone && (
                <p id="detailed-popup-body-overview-airports-destination-timezone">{
                  selectedFlightData?.data?.arrival?.timezone?.match(/\(UTC[-+]?\d{2}:\d{2}\)/)?.[0]
                }</p>
              )}
            </div>
          </div>
          <div className="detailed-popup-body-overview-progress-bar">
            {selectedFlightData?.data.progress.percentage && (
              <div id="detailed-popup-body-overview-progress-bar-fill" style={{ width: (selectedFlightData.data.progress.percentage - 5) + '%' }}></div>
            )}
            <img id="detailed-popup-body-overview-progress-bar-icon" src={aircraftIconWhite} alt="Aircraft Icon" />
            {selectedFlightData?.data.progress.percentage && (
              <div id="detailed-popup-body-overview-progress-bar-empty" style={{ width: ( 95 - selectedFlightData.data.progress.percentage) + '%' }}></div>
            )}
          </div>
          <div className="detailed-popup-body-overview-status">
            {selectedFlightData?.data.progress.status && (
              <div className="detailed-popup-body-overview-status-estimated-arrival">
                <p>{selectedFlightData.data.progress.status.charAt(11) === '1' || selectedFlightData.data.progress.status.charAt(16) === '1' ?
                  `${selectedFlightData.data.progress.status.charAt(0).toUpperCase() + selectedFlightData.data.progress.status.slice(1).replace(/h\s/, ' hour and ').replace(/m/, ' minutes')}` :
                  `${selectedFlightData.data.progress.status.charAt(0).toUpperCase() + selectedFlightData.data.progress.status.slice(1).replace(/h\s/, ' hours and ').replace(/m/, ' minutes')}`}
                </p>
              </div>
            )}
            {selectedFlightData && (
              <div className="detailed-popup-body-overview-status-arrival-status">
                <p style={{ color: getStatusColor(selectedFlightData.data.arrival.status) }}>●</p>
                <p>{selectedFlightData.data.arrival.status}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detailed-popup-body-virtual-cockpit">
            <div className="detailed-popup-body-virtual-cockpit-title">
              <div className="detailed-popup-body-virtual-cockpit-title-text">
                <img src={informationIcon} alt="Virtual Cockpit" style={{width: '15px', height: '15px'}} />
                <p id="detailed-popup-body-virtual-cockpit-title-text" >Virtual Cockpit</p>
                <p id="detailed-popup-body-virtual-cockpit-title-last-contact" >
                  (Last contact :
                  {currentTime < 1000 ? ' 0 seconds ago' :
                    currentTime < 2000 ? ' 1 second ago' :
                      currentTime < 60000 ? ` ${Math.floor(currentTime / 1000)} seconds ago` :
                        currentTime < 120000 ? ' 1 minute ago' :
                          currentTime < 3600000 ? ` ${Math.floor(currentTime / 60000)} minutes ago` :
                            currentTime < 7200000 ? ' 1 hour ago' :
                            ` ${Math.floor(currentTime / 3600000)} hours ago`})
                </p>
              </div>
              <img src={whiteLineIcon} alt="Virtual Cockpit" style={{width: '15px', height: '15px'}} />
            </div>
            <div className="detailed-popup-body-virtual-cockpit-grid">
              <div className="detailed-popup-body-virtual-cockpit-grid-longitude">
                <p id="detailed-popup-body-virtual-cockpit-grid-longitude-text" >Longitude</p>
                {flight?.longitude && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-longitude-value" >
                    {flight.longitude}° E
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-latitude">
                <p id="detailed-popup-body-virtual-cockpit-grid-latitude-text" >Latitude</p>
                {flight?.latitude && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-latitude-value" >
                    {flight.latitude}° S
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-baro-altitude">
                <p id="detailed-popup-body-virtual-cockpit-grid-baro-altitude-text" >Barometric Altitude</p>
                {flight?.baro_altitude && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-baro-altitude-value" >
                    {flight.baro_altitude} m | {Math.floor(flight.baro_altitude * 3.28084)} ft
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-geo-altitude">
                <p id="detailed-popup-body-virtual-cockpit-grid-geo-altitude-text" >Geometric Altitude</p>
                {flight?.geo_altitude && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-geo-altitude-value" >
                    {flight.geo_altitude} m | {Math.floor(flight.geo_altitude * 3.28084)} ft
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-velocity">
                <p id="detailed-popup-body-virtual-cockpit-grid-velocity-text" >Ground Speed</p>
                {flight?.velocity && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-velocity-value" >
                    {Math.floor(flight.velocity * 3.6)} km/h | {Math.floor(flight.velocity * 2.23694)} mph
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-vertical-rate">
                <p id="detailed-popup-body-virtual-cockpit-grid-vertical-rate-text" >Vertical Speed</p>
                {flight?.vertical_rate && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-vertical-rate-value" >
                    {flight.vertical_rate} m/s | {Math.floor(flight.vertical_rate * 196.850394)} ft/min
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-true-track">
                <p id="detailed-popup-body-virtual-cockpit-grid-true-track-text" >True Course</p>
                {flight?.true_track && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-true-track-value" >
                    {flight.true_track}° N
                  </p>
                )}
              </div>
              <div className="detailed-popup-body-virtual-cockpit-grid-squawk">
                <p id="detailed-popup-body-virtual-cockpit-grid-squawk-text" >Squawk</p>
                {flight?.squawk && (
                  <p id="detailed-popup-body-virtual-cockpit-grid-squawk-value" >
                    {flight.squawk}
                  </p>
                )}
              </div>
            </div>
          </div>

        <div className="detailed-popup-body-about-flight">

          <div className="detailed-popup-body-about-flight-title">
            <img src={informationIcon} alt="Information Icon" />
            {selectedFlightData?.data.overview.airline && selectedFlightData?.data.thisFlight.flightNumber && (
              <p id="detailed-popup-body-about-flight-title-text" >
                About Flight {selectedFlightData.data.thisFlight.flightNumber}
              </p>
            )}
            <img id="detailed-popup-body-about-flight-title-line" src={whiteLineIcon} alt="About Flight" style={{width: '15px', height: '15px'}} />
          </div>

          <div className="detailed-popup-body-about-flight-grid">
            <div className="detailed-popup-body-about-flight-grid-duration">
              <p id="detailed-popup-body-about-flight-grid-duration-text" >Avg. Duration : </p>
              {selectedFlightData?.data.overview.duration && (
                <p id="detailed-popup-body-about-flight-grid-duration-value" >
                  {selectedFlightData.data.overview.duration}
                </p>
              )}
            </div>
            <div className="detailed-popup-body-about-flight-grid-distance">
              <p id="detailed-popup-body-about-flight-grid-distance-text" >Avg. Distance : </p>
              {selectedFlightData?.data.overview.distance && (
                <p id="detailed-popup-body-about-flight-grid-distance-value" >
                  {selectedFlightData.data.overview.distance}
                </p>
              )}
            </div>
          </div>

          <div className="detailed-popup-body-about-flight-week-days-grid">
              <div className="detailed-popup-body-about-flight-week-days" id="first-week-day">
                <p id="monday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Mon") ? 'active-days' : ''}`}>MON</p>
              </div>
              <div className="detailed-popup-body-about-flight-week-days">
                <p id="tuesday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Tue") ? 'active-days' : ''}`}>TUE</p>
              </div>
              <div className="detailed-popup-body-about-flight-week-days">
                <p id="wednesday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Wed") ? 'active-days' : ''}`}>WED</p>
              </div>
              <div className="detailed-popup-body-about-flight-week-days">
                <p id="thursday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Thu") ? 'active-days' : ''}`}>THU</p>
              </div>
              <div className="detailed-popup-body-about-flight-week-days">
                <p id="friday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Fri") ? 'active-days' : ''}`}>FRI</p>
              </div>
              <div className="detailed-popup-body-about-flight-week-days">
                <p id="saturday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Sat") ? 'active-days' : ''}`}>SAT</p>
              </div>
              <div className="detailed-popup-body-about-flight-week-days" id="last-week-day">
                <p id="sunday" className={`${selectedFlightData?.data?.overview?.operationDays?.includes("Sun") ? 'active-days' : ''}`}>SUN</p>
              </div>
          </div>

        </div>



      </div>
      <div className="detailed-popup-footer">
        <button onClick={handleClose}>Back to Live Map</button>
      </div>
    </div>
  );
};

export default DetailedPopupComponent;
