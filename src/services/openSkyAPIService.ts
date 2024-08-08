// Service to fetch flight data from OpenSky API.
// See the official documentation of the OpenSky Network’s live API at https://openskynetwork.github.io/opensky-api/rest.html

// testFlightData.json is a static file with flight data for testing purposes.
// You can use it to simulate the API response during development as anonymous users get 400 API credits per day.

import testFlightData from '../testFlightData.json';

export const fetchFlights = (): { time: number; states: any[][] } => {
  return testFlightData;
};

// Uncomment the code below to fetch flight data from the OpenSky API.
// The API is rate-limited to 10 requests per minute.
// The base URL for the API is https://opensky-network.org/api/states/all

// const API_URL = 'https://opensky-network.org/api/states/all';

// interface FlightData {
//   icao24: string;
//   longitude: number;
//   latitude: number;
//   velocity: number;
// }

// export const fetchFlights = async (
//   lamin: number,
//   lomin: number,
//   lamax: number,
//   lomax: number
//   ): Promise<FlightData[]> => {

//   const url = `${API_URL}?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch flight data: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching flight data:', error);
//     throw error;
//   }
// };
