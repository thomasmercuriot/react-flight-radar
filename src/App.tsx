import React from 'react';
import MapComponent from './components/MapComponent';

const App: React.FC = () => {
  return (
    <div>
      <MapComponent
        accessToken={process.env.REACT_APP_MAPBOX_TOKEN!} // Get your own access token at https://account.mapbox.com/.
        center={[2.550, 49.008]} // By default, the map loads CDG Airport - This should be swapped out for the user's location.
        zoom={9} // Note: Zoom ranges from 0 to 22.
      />
    </div>
  );
};

export default App;
