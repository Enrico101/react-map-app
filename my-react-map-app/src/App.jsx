import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {APIProvider, Map, Marker, InfoWindow} from '@vis.gl/react-google-maps';
import AutocompleteSearchBar from './AutocompleteSearchBar';

function App() {
  const [mapCenter, setMapCenter] = useState();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [infoWindowContent, setInfoWindowContent] = useState(null);
  const useCenterDet = useRef(false);
  const apiKey = import.meta.env.VITE_API_KEY;

  const handlePlaceSelected = (coords, address) => {
    useCenterDet.current = true;
    setMapCenter(coords);
    setMarkerPosition(coords);
    setInfoWindowContent("loading ....");

    const map = new window.google.maps.Map(document.createElement("div"));
    const placesService = new window.google.maps.places.PlacesService(map);

    const request = {
      location: new window.google.maps.LatLng(coords.lat, coords.lng),
      radius: 50,
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const placeId = results[0].place_id;

        placesService.getDetails({ placeId }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            let funFacts = "";
            if (place.types.includes("restaurant")) funFacts = "🍽️ This place serves delicious food!";
            if (place.types.includes("museum")) funFacts = "🏛️ A place full of history!";
            if (place.types.includes("park")) funFacts = "🌳 A great place to relax and enjoy nature!";
            setInfoWindowContent(place?.formatted_address+", fun facts: "+funFacts+",⭐ Rating: "+ place?.rating +" / 5, website: "+place?.website);
          } else {
            setInfoWindowContent("No additional details found");
          }
        });
      } else {
        setInfoWindowContent("No place found nearby");
      }
    });
  };

  const handleMapClick = (e) => {
    const { latLng } = e.detail;
    const lat = latLng.lat;
    const lng = latLng.lng;
    
    setMapCenter({ lat, lng });
    setMarkerPosition({ lat, lng });
    setInfoWindowContent("Loading ....");

    const map = new window.google.maps.Map(document.createElement("div"));
    const placesService = new window.google.maps.places.PlacesService(map);

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 50,
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const placeId = results[0].place_id;

        placesService.getDetails({ placeId }, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            let funFacts = "";
            if (place.types.includes("restaurant")) funFacts = "🍽️ This place serves delicious food!";
            if (place.types.includes("museum")) funFacts = "🏛️ A place full of history!";
            if (place.types.includes("park")) funFacts = "🌳 A great place to relax and enjoy nature!";
            setInfoWindowContent(place.formatted_address+", fun facts: "+funFacts+",⭐ Rating: "+place.rating+" / 5, "+place.website);
          } else {
            setInfoWindowContent("No additional details found");
          }
        });
      } else {
        setInfoWindowContent("No place found nearby");
      }
    });

    useCenterDet.current = false
  };

  return (
    <APIProvider apiKey={apiKey}>
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
