import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl'; // npm install --save react-map-gl mapbox-gl @types/mapbox-gl
import 'mapbox-gl/dist/mapbox-gl.css'; // The base map library requires its stylesheet be included at all times.
import axios from 'axios'; // npm install axios | Axios is a simple promise based HTTP client for the browser and node.js.
import aircraftIconStandard from '../assets/standard-white-plane-icon-map.png';
import aircraftIconSelected from '../assets/standard-orange-plane-icon-map.png';
import { FeatureCollection, Point } from 'geojson'; // npm install @types/geojson
import PopupComponent, { AdditionalFlightData, AircraftPhoto } from './PopupComponent';
import DetailedPopupComponent from './DetailedPopupComponent';
import './styles/MapComponent.css';

interface MapComponentProps {
  accessToken: string;
  center: [number, number];
  zoom: number;
};

interface Aircraft {
  icao24: string;
  callsign: string;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  geo_altitude: number;
  squawk: string;
};

const MapComponent: React.FC<MapComponentProps> = ({ accessToken, center, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(center[0]);
  const [lat, setLat] = useState(center[1]);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds | null>(null); // The bounding box coordinates will be required when fetching our API.
  // Read API documentation at https://github.com/thomasmercuriot/node-flight-radar.
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Aircraft | null>(null); // To display the pop-up when an aircraft is clicked.
  const [showDetailedPopup, setShowDetailedPopup] = useState<boolean>(false);
  const [selectedFlightData, setSelectedFlightData] = useState<AdditionalFlightData | null>(null);
  const [selectedFlightPhotoData, setSelectedFlightPhotoData] = useState<AircraftPhoto | null>(null);
  const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const handleAircraftClick = (aircraft: Aircraft) => {
    setSelectedFlight(aircraft);
  };

  const handleClosePopup = () => {
    setSelectedFlight(null);
  };

  const handleShowDetailedPopup = () => {
    setShowDetailedPopup(true);
  };

  const handleCloseDetailedPopup = () => {
    setShowDetailedPopup(false);
  };

  useEffect(() => {
    console.log("showDetailedPopup has changed:", showDetailedPopup);
  }, [showDetailedPopup]);

  const fetchAircrafts = useCallback(async (boundingBox: mapboxgl.LngLatBounds | null) => {
    try {
      if (!boundingBox) return;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api`, {
        params: {
          lamin: boundingBox.getSouthWest().lat,
          lomin: boundingBox.getSouthWest().lng,
          lamax: boundingBox.getNorthEast().lat,
          lomax: boundingBox.getNorthEast().lng, // '/api?lamin=XXX&lomin=XXX&lamax=XXX&lomax=XXX'
        },
      });
      setAircrafts(response.data); // See API documentation for the expected response (https://github.com/thomasmercuriot/node-flight-radar).
    } catch (error) {
      console.log('Error fetching aircrafts:', error);
    }
  }, []);

  // To get the most out of Mapbox GL JS, we need to convert our aircrafts data to GeoJSON.
  // GeoJSON is a format for encoding a variety of geographic data structures. Read more at https://geojson.org/.

  const convertToGeoJSON = (aircrafts: Aircraft[]): FeatureCollection<Point> => {
    return {
      type: "FeatureCollection",
      features: aircrafts.map((aircraft) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [aircraft.longitude, aircraft.latitude],
        },
        properties: {
          icao24: aircraft.icao24,
          callsign: aircraft.callsign,
          last_contact: aircraft.last_contact,
          longitude: aircraft.longitude,
          latitude: aircraft.latitude,
          baro_altitude: aircraft.baro_altitude,
          velocity: aircraft.velocity,
          true_track: aircraft.true_track,
          vertical_rate: aircraft.vertical_rate,
          geo_altitude: aircraft.geo_altitude,
          squawk: aircraft.squawk,
        },
      })),
    };
  };

  useEffect(() => {
    if (map.current) return; // Initialize the map only once.
    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/thomasmercuriot/cm0mjab8c00bi01pj0oqm0v78', // Create your own style at https://studio.mapbox.com/.
      // center: [lng, lat],
      center: center,
      // zoom: mapZoom
      zoom: zoom,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);

          map.current?.setCenter([longitude, latitude]); // Center the map on the user's location.

          const geojson = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                },
                properties: {
                  message: 'You are here!',
                  iconSize: [60, 60],
                }
              }
            ]
          };

          for (const marker of geojson.features) {
            const el = document.createElement('div');
            const width = marker.properties.iconSize[0];
            const height = marker.properties.iconSize[1];
            el.className = 'marker';
            el.style.backgroundImage = `url(https://avatars.githubusercontent.com/u/164926532?v=4)`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = '100%';
            el.style.display = 'block';
            el.style.border = '2px solid #fff';
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';
            el.style.padding = '0';

            el.addEventListener('click', () => {
              window.alert(marker.properties.message);
            });

            new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates as [number, number])
              .addTo(map.current!);
          }

          // new mapboxgl.Marker({ color: 'red' })
          //   .setLngLat([longitude, latitude])
          //   .setPopup(new mapboxgl.Popup().setHTML("<h4>Hello from home</h4>")) // Optional popup
          //   .addTo(map.current!);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('The user denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            default:
              console.error('An unknown error occurred while trying to get user location.');
              break;
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 } // Optional parameters.
      );
    } else {
      console.error('Geolocation is not supported by this browser.'); // (e.g., Safari on macOS)
    }

    map.current.on('load', () => {
      if (map.current) {
        setBounds(map.current.getBounds());

        map.current.addSource('aircrafts', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: aircrafts.map((aircraft) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [aircraft.longitude, aircraft.latitude],
              },
              properties: {
                id: aircraft.icao24,
                icon: 'aircraft-icon',
              },
            })),
          },
          cluster: true, // Enable clustering to optimize readability and performance. (avoid overlapping markers & reduce the number of markers).
          // Read the documentation I used at https://docs.mapbox.com/mapbox-gl-js/example/cluster/.
          clusterMaxZoom: 12, // The example uses 14, but I found 12 to be more suitable.
          clusterRadius: 40, // The example uses 50, but I found 40 to be more suitable.
        });

        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'aircrafts',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              25, // 100
              '#f1f075',
              100, // 750
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        });

        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'aircrafts',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        // Unlike the previous version of the MapComponent (no clustering), we need to load the image we will use for the aircraft icon.
        // Previous integration of the icon: el.style.backgroundImage = `url(${aircraftIconStandard})`;
        // Icon by Emkamal Kamaluddin (https://www.iconfinder.com/susannanovaIDR).
        // https://www.iconfinder.com/icons/7217410/aircraft_transport_plane_transportation_airplane_travel_icon.
        // I used Adobe Photoshop to fill the icon with a solid color (white).

        map.current?.loadImage(aircraftIconStandard, (error, image) => {
          if (error) throw error;

          if (image && !map.current?.hasImage('aircraft-icon')) {
            map.current?.addImage('aircraft-icon', image);
          }
        });

        map.current!.loadImage(aircraftIconSelected, (error, image) => {
          if (error) throw error;
          if (!map.current!.hasImage('aircraft-icon-selected')) {
            map.current!.addImage('aircraft-icon-selected', image!);
          }
        });

        map.current?.addLayer({
          id: 'unclustered-point', // This layer will display the individual aircrafts (= Marker).
          type: 'symbol',
          source: 'aircrafts',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': 'aircraft-icon',
            'icon-size': 1 / 20,
            'icon-rotate': ['get', 'true_track'], // Rotate the icon based on the aircraft's true track.
            'icon-allow-overlap': true, // Allow the icon to overlap with other icons because the clustering will help avoid overlapping in most cases.
            // However, I want the clustering to be turned off over a certain zoom level to display the individual aircrafts rather than 2-5 aircrafts in a cluster.
            // Overlapping will mainly occur when the user is focused on an airport or a specific area with a high density of aircrafts.
          },
        });

        map.current.on('click', 'clusters', (e) => { // When the user clicks on a cluster, the map will zoom in to the cluster and center it.
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });

          const clusterId = features[0].properties?.cluster_id;
          if (!clusterId) return;

          const source = map.current!.getSource('aircrafts') as mapboxgl.GeoJSONSource;
          source.getClusterExpansionZoom(clusterId, (err: any, zoom: number | undefined | null) => {
            if (err || zoom === undefined || zoom === null) return;

            const coordinates = (features[0].geometry as GeoJSON.Point).coordinates;
            if (coordinates.length === 2) {
              map.current!.easeTo({
                center: [coordinates[0], coordinates[1]] as mapboxgl.LngLatLike,
                zoom: zoom
              });
            }
          })
        })

        map.current.on('click', 'unclustered-point', (e) => { // When the user clicks on an individual aircraft, it will center the map on the aircraft.
          if (e.features === undefined) return;

          handleAircraftClick(e.features[0].properties as Aircraft); // Display the pop-up with the aircraft's information.

          const clickedAircraft = e.features[0]?.properties?.id;
          const selectedAircraft = aircrafts.find((aircraft) => aircraft.icao24 === clickedAircraft);
          if (selectedAircraft) {
            handleAircraftClick(selectedAircraft);
          }

          const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice();

          if (coordinates.length === 2) {
            map.current!.easeTo({
              center: [coordinates[0], coordinates[1]] as mapboxgl.LngLatLike,
              // zoom: zoom (optional, I decided to keep the current zoom level).
            });
          }

          if (map.current === null) return;
          if (e.features[0].properties === null) return;

          // The following code is optional. It displays a native Mapbox popup when the user clicks on an individual aircraft.
          // It was used in development before I created the custom pop-up component.

          // new mapboxgl.Popup()
          //   .setLngLat([coordinates[0], coordinates[1]] as mapboxgl.LngLatLike)
          //   .setHTML(`
          //     <h3>${e.features[0].properties.icao24}</h3>
          //     <h3>${e.features[0].properties.callsign}</h3>
          //     <p>Last Contact: ${e.features[0].properties.last_contact} sec</p>
          //     <p>Longitude: ${e.features[0].properties.longitude}</p>
          //     <p>Latitude: ${e.features[0].properties.latitude}</p>
          //     <p>Altitude: ${e.features[0].properties.baro_altitude} ft</p>
          //     <p>Velocity: ${e.features[0].properties.velocity} kt</p>
          //     <p>Track: ${e.features[0].properties.true_track}°</p>
          //     <p>Vertical Rate: ${e.features[0].properties.vertical_rate} fpm</p>
          //     <p>Geo Altitude: ${e.features[0].properties.geo_altitude} ft</p>
          //     <p>Squawk: ${e.features[0].properties.squawk}</p>
          //   `) // You can customize the native Mapbox popup content here.
          //   .addTo(map.current);
        });

        map.current.on('mouseenter', 'clusters', () => {
          if (map.current === null) return;
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'clusters', () => {
          if (map.current === null) return;
          map.current.getCanvas().style.cursor = '';
        });

        map.current.on('mouseenter', 'unclustered-point', () => {
          if (map.current === null) return;
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'unclustered-point', () => {
          if (map.current === null) return;
          map.current.getCanvas().style.cursor = '';
        });

      }
    });

    map.current.on('move', () => {
      if (map.current) {
        setLng(Number(map.current.getCenter().lng.toFixed(4)));
        setLat(Number(map.current.getCenter().lat.toFixed(4)));
        setMapZoom(Number(map.current.getZoom().toFixed(2)));
        setBounds(map.current.getBounds());
      }
    });
  }, [accessToken, lng, lat, mapZoom, aircrafts, zoom, center]);

  useEffect(() => {
    const getData = setTimeout(() => { // Fetch aircrafts 2 seconds after the user stops moving the map. This will prevent too many API calls.
      // We are using the OpenSky Network REST API to fetch live aircraft location data. Anonymous users get 400 API credits per day.
      if (bounds) {
        fetchAircrafts(bounds);
      }
    }, 2000);
    return () => clearTimeout(getData);
  }, [bounds, fetchAircrafts]);

  useEffect(() => {
    if (!map.current) return;

    if (map.current.getSource('aircrafts')) {
      (map.current.getSource('aircrafts') as mapboxgl.GeoJSONSource).setData(
        convertToGeoJSON(aircrafts)
      );
    }
  }, [aircrafts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (map.current && map.current.getSource('aircrafts')) {
        (map.current.getSource('aircrafts') as mapboxgl.GeoJSONSource).setData(
          convertToGeoJSON(aircrafts)
        );
      }

      if (selectedFlight) {
        const updatedSelectedFlight = aircrafts.find((aircraft) => aircraft.icao24 === selectedFlight.icao24);
        if (updatedSelectedFlight) {
          setSelectedFlight(updatedSelectedFlight);
        }
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [aircrafts, selectedFlight]);

  useEffect(() => {
    if (selectedFlight && map.current) {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.remove();
      }

      const el = document.createElement('div');
      el.className = 'selected-marker';
      el.style.backgroundImage = `url(${aircraftIconSelected})`;
      el.style.width = '26px';
      el.style.height = '26px';
      el.style.backgroundSize = '100%';

      selectedMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([selectedFlight.longitude, selectedFlight.latitude])
        .setRotation(selectedFlight.true_track)
        .addTo(map.current);
    } else if (!selectedFlight && selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }
  }, [selectedFlight]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} />
      <div>
        <p>Longitude: {lng} | Latitude: {lat} | Zoom: {mapZoom}</p>
        {bounds && (
          <p>
            Bounding Box:<br />
            - SW: [{bounds.getSouthWest().lng.toFixed(4)}, {bounds.getSouthWest().lat.toFixed(4)}]<br />
            - NE: [{bounds.getNorthEast().lng.toFixed(4)}, {bounds.getNorthEast().lat.toFixed(4)}]
          </p>
        )}
        {userLocation && (
          <p>
            User Location:<br />
            - Longitude: {userLocation[0].toFixed(4)}<br />
            - Latitude: {userLocation[1].toFixed(4)}
          </p>
        )}
      </div>
      <div>
        {selectedFlight && (
          <PopupComponent
            flight={selectedFlight}
            setSelectedFlightData={setSelectedFlightData}
            setSelectedFlightPhotoData={setSelectedFlightPhotoData}
            onClose={handleClosePopup}
            onShowDetailed={handleShowDetailedPopup}
            hidden={showDetailedPopup}
          />
        )}
        {selectedFlight && showDetailedPopup && (
          <DetailedPopupComponent
            flight={selectedFlight}
            selectedFlightData={selectedFlightData}
            selectedFlightPhotoData={selectedFlightPhotoData}
            onClose={handleCloseDetailedPopup}
            show={showDetailedPopup}
          />
        )}
      </div>
    </div>
  );
};

export default MapComponent;
