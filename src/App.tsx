import React from 'react';
import MapComponent from './components/MapComponent';

const App: React.FC = () => {
  return (
    <div>
      <MapComponent
        accessToken={process.env.REACT_APP_MAPBOX_TOKEN!} // Get your own access token at https://account.mapbox.com/.
        center={[2.550, 49.008]} // CDG Airport
        zoom={13}
      />
    </div>
  );
};

export default App;
