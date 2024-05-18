import React, { useState, useEffect } from "react";
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
import { fetchHistoricalData, fetchForecastData } from "./FetchWeatherData";
import * as ss from "simple-statistics";

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

const generateYearDates = (year) => {
  const dates = [];
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
      dates.push(new Date(year, month, day));
    }
  }
  return dates;
};

const calculatePercentiles = (data) => {
  const yearDates = generateYearDates("2024");
  const dateMap = data.time.reduce((acc, time, index) => {
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const day = time.getDate().toString().padStart(2, "0");
    const dayMonth = `${month}-${day}`;
    if (!acc[dayMonth]) acc[dayMonth] = [];
    acc[dayMonth].push(data.temperature2m[index]);
    return acc;
  }, {});
  const result = {};
  yearDates.forEach((date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dayMonth = `${month}-${day}`;
    const temperatures = dateMap[dayMonth]?.sort((a, b) => a - b) || [];
    result[new Date(date)] = {
      p10: ss.quantileSorted(temperatures, 0.1),
      p50: ss.quantileSorted(temperatures, 0.5),
      p90: ss.quantileSorted(temperatures, 0.9),
    };
  });
  console.log("result", result);
  return result;
};

const ForecastChart = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [percentiles, setPercentiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPercentiles, setShowPercentiles] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchForecastData(latitude, longitude);
        console.log("fetchData", data);
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  const handleFetchHistoricalData = async () => {
    setLoading(true);
    setError(null);

    try {
      const historicalData = await fetchHistoricalData(
        latitude,
        longitude,
        "2020-01-01",
        "2022-01-01"
      );
      const calculatedPercentiles = calculatePercentiles(historicalData);
      setPercentiles(calculatedPercentiles);
      setShowPercentiles(true);
    } catch (e) {
      setError("Failed to fetch historical data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || loading) return <p>Loading...</p>;
  if (error || error) return <p>Error: {error}</p>;

  const percentileData = (percentileKey) => {
    const yearDates = generateYearDates("2024");
    return yearDates.map((time) => {
      return percentiles && percentiles[time]
        ? percentiles[time][percentileKey]
        : null;
    });
  };
  const chartData = {
    labels: weatherData ? weatherData.time : [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData ? weatherData.temperature2m : [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
      ...(showPercentiles && percentiles
        ? [
            {
              label: "10th Percentile",
              data: percentileData("p10"),
              fill: false,
              borderColor: "rgba(75, 192, 192, 0.2)",
              borderDash: [5, 5],
              tension: 0.1,
            },
            {
              label: "50th Percentile",
              data: percentileData("p50"),
              fill: false,
              borderColor: "rgba(75, 192, 192, 0.6)",
              tension: 0.1,
            },
            {
              label: "90th Percentile",
              data: percentileData("p90"),
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              borderDash: [5, 5],
              tension: 0.1,
            },
          ]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM d",
          displayFormats: {
            day: "MMM d",
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
        text: showPercentiles
          ? "Temperature Percentiles and Forecast"
          : "Hourly Temperature",
      },
    },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <button onClick={handleFetchHistoricalData} disabled={loading}>
        {loading
          ? "Loading..."
          : showPercentiles
          ? "Show Raw Data"
          : "Show Percentiles"}
      </button>
      {weatherData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ForecastChart;
