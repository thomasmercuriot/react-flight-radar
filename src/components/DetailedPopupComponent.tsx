import React, { useState, useEffect } from 'react';
import './styles/DetailedPopupComponent.css';
import { AdditionalFlightData, AircraftPhoto } from './PopupComponent';

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

  if (!isVisible) return null;

  console.log(flight);


  return (
    <div className={`detailed-popup ${isClosing ? 'hidden' : ''}`}>
      <div className="detailed-popup-image">
        <img src={selectedFlightPhotoData?.photo.photoUrl} alt={selectedFlightData?.registration} />
      </div>
      <div className='popup-content'>
        <span className='close' onClick={handleClose}>&times;</span>
        <h1>Detailed Pop-Up</h1>
        <p>Plane ICAO24 : {flight.icao24}</p>

      </div>
    </div>
  );
};

export default DetailedPopupComponent;
