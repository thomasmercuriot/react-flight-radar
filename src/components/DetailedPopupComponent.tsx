import React, { useState, useEffect } from 'react';
import './styles/DetailedPopupComponent.css';
import { AdditionalFlightData, AircraftPhoto } from './PopupComponent';
import photoCredentialsIcon from '../assets/photo-credentials-icon.png'; // https://www.iconfinder.com/Kh.Artyom.
import aircraftIconFlight from '../assets/icon-flight-origin-destination.png'; // https://www.iconfinder.com/font-awesome.
import aircraftIconWhite from '../assets/icon-plane-white.png'; // https://www.flaticon.com/fr/icone-gratuite/avion_5655607?term=avion&page=1&position=3&origin=tag&related_id=5655607.
import informationIcon from '../assets/information-icon.png'; // https://www.iconfinder.com/DesignRevision.

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

  if (!isVisible) return null;

  console.log(flight);


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
          <div className="detailed-popup-body-image-credentials">
            <img src={photoCredentialsIcon} alt="Photographer" />
            {selectedFlightPhotoData?.photo.photoData.photographer && (
              <p id="detailed-popup-body-image-credentials-photographer">Photographer : {selectedFlightPhotoData.photo.photoData.photographer}</p>
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
                <p>{selectedFlightData.data.progress.status.charAt(0).toUpperCase() + selectedFlightData.data.progress.status.slice(1).replace(/h\s/, 'h')}</p>
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



        <div className="detailed-popup-body-about-flight">



          <div className="detailed-popup-body-about-flight-title">
            <img src={informationIcon} alt="Information Icon" />
            {selectedFlightData?.data.overview.airline && selectedFlightData?.data.thisFlight.flightNumber && (
              <p id="detailed-popup-body-about-flight-title-text" >
                About {selectedFlightData.data.overview.airline} Flight {selectedFlightData.data.thisFlight.flightNumber}
              </p>
            )}
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
