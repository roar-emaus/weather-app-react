import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import WeatherComponent from "./WeatherComponent";

function App() {
  const [clickCoords, setClickCoords] = useState({ lat: 59.9202, lng: 10.865 });
  useEffect(() => {
    console.log("useEffect: ", clickCoords);
  }, [clickCoords]);
  return (
    <div>
      <div className="Map" style={{ height: "50vh", width: "100%" }}>
        <MapComponent
          clickCoords={clickCoords}
          setClickCoords={setClickCoords}
        />
      </div>
      <div className="Weather" style={{ height: "50vh", width: "100vh" }}>
        <WeatherComponent
          latitude={clickCoords.lat}
          longitude={clickCoords.lng}
        />
      </div>
    </div>
  );
}

export default App;
