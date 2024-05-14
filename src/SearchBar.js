import React, { useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const SearchBar = ({ onSearchComplete }) => {
  const [input, setInput] = useState("");

  const handleSearch = async () => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: input });
    if (results && results.length > 0) {
      const { x, y, label } = results[0]; // x is longitude, y is latitude
      onSearchComplete(y, x);
      console.log(
        `Search result for '${label}' at Latitude: ${y}, Longitude: ${x}`
      );
    } else {
      console.log("No results found");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a place..."
        style={{ width: "300px", height: "25px", marginRight: "5px" }}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
