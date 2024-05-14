import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchWeatherApi } from "openmeteo"; // Ensure this import matches your actual API module path
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function WeatherComponent({ latitude, longitude }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      const params = {
        latitude: latitude,
        longitude: longitude,
        hourly: "temperature_2m",
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      try {
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0]; // Assuming there's always at least one response

        // Extract necessary attributes
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        const timeRange = range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        );

        const formattedWeatherData = {
          hourly: {
            time: timeRange.map((t) =>
              new Date((t + utcOffsetSeconds) * 1000).toISOString()
            ),
            temperature2m: hourly.variables(0).valuesArray(),
          },
        };
        setWeatherData(formattedWeatherData);
      } catch (e) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const chartData = {
    labels: weatherData ? weatherData.hourly.time : [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData ? weatherData.hourly.temperature2m : [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h1>Weather Data</h1>
      {weatherData ? <Line data={chartData} /> : <p>No data available</p>}
    </div>
  );
}

// Helper function to form time ranges
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export default WeatherComponent;
