import React, { useState, useEffect } from 'react';
import './styles/DetailedPopupComponent.css';

interface DetailedPopupComponentProps {
  flight: any;
  show: boolean;
  onClose: () => void;
}

const DetailedPopupComponent: React.FC<DetailedPopupComponentProps> = ({ flight, show, onClose }) => {

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

  return (
    <div className={`detailed-popup ${isClosing ? 'hidden' : ''}`}>
      <div className='popup-content'>
        <span className='close' onClick={handleClose}>&times;</span>
        <h1>Detailed Pop-Up</h1>
        <p>Plane ICAO24 : {flight.icao24}</p>
      </div>
    </div>
  );
};

export default DetailedPopupComponent;
