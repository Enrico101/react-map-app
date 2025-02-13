import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {APIProvider, Map, Marker, InfoWindow} from '@vis.gl/react-google-maps';
import AutocompleteSearchBar from './AutocompleteSearchBar';

function App() {
  const [mapCenter, setMapCenter] = useState(); //Default: Current workplace.
  const [markerPosition, setMarkerPosition] = useState(null);
  const [infoWindowContent, setInfoWindowContent] = useState(null);
  const useCenterDet = useRef(false);

  const handlePlaceSelected = (coords, address) => {
    useCenterDet.current = true;
    setMapCenter(coords);
    setMarkerPosition(coords);
    setInfoWindowContent(address);
  };

  const handleMapClick = (e) => {
    const { latLng } = e.detail;
    const lat = latLng.lat;
    const lng = latLng.lng;
    setMapCenter({ lat, lng });
    setMarkerPosition({ lat, lng });
    setInfoWindowContent("Coming Soon");
    useCenterDet.current = false
  };

  return (
    <APIProvider apiKey="AIzaSyDSSgQOameE5y4wrB1v-4GWpTsmiRg2pVE">
      <div>
        <h1>MAP Challenge</h1>
        <h3>By Enrico Radcliffe</h3>
        <AutocompleteSearchBar onPlaceSelected={handlePlaceSelected} />
        <div>
          <Map
            defaultCenter={{ lat: -25.97903348794783, lng: 28.11624526977539 }}
            defaultTilt={0}
            center={useCenterDet.current ? mapCenter:null}
            style={{width: '90vw', height: '85vh'}}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            onClick={handleMapClick}
          >
            {markerPosition && <Marker position={markerPosition} />}
            <InfoWindow pixelOffset={[0,-40]} position={markerPosition}>
              <div>
                <h3 style={{color: 'black'}}>InfoWindow content</h3>
                <strong style={{color: 'black'}}>
                  {infoWindowContent}
                </strong>
              </div>
            </InfoWindow>
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}

export default App;
