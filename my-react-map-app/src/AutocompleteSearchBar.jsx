import {useRef, useState, useEffect } from "react";
import {useMap,useMapsLibrary } from "@vis.gl/react-google-maps";

function AutocompleteSearchBar({ onPlaceSelected }) {
  const placesLib = useMapsLibrary("places");
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const autocomplete = new placesLib.Autocomplete(inputRef.current);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        const location = place.geometry.location;
        const newCoords = { lat: location.lat(), lng: location.lng() };
        
        setInputValue(place.formatted_address);
        onPlaceSelected(newCoords, place.formatted_address);
      }
    });

    return () => autocomplete.unbindAll();
  }, [placesLib]);

  return (
    <input
      style={{padding: '0', width: '90vw', height: '30px', borderRadius: '10px', marginBottom: '15px'}}
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Enter a location"
    />
  );
}

export default AutocompleteSearchBar;