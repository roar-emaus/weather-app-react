import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import ForecastData from "./FetchForecast";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const ForecastChart = ({ latitude, longitude }) => {
  const { weatherData, loading, error } = ForecastData(latitude, longitude);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "MMM d, HH",
          displayFormats: {
            hour: "MMM d, HH",
            day: "MMM d, HH",
          },
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Hourly Temperature",
      },
    },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {weatherData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ForecastChart;
