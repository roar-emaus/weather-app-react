import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SearchBar from "./SearchBar";

const MapComponent = ({ clickCoords, setClickCoords }) => {
  const position = [clickCoords.lat, clickCoords.lng];

  const SetViewOnClick = ({ coords }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  };

  const handleSearchComplete = (lat, lng) => {
    const newCoords = { lat, lng };
    setClickCoords(newCoords);
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickCoords({ lat, lng });
      },
    });
    return null;
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} />
        <SetViewOnClick coords={position} />
        <MapEvents />
      </MapContainer>
      <SearchBar onSearchComplete={handleSearchComplete} />
    </div>
  );
};

export default MapComponent;
