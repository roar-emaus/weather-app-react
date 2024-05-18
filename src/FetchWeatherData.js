import { fetchWeatherApi } from "openmeteo";

// Helper function to form time ranges
const range = (start, stop, step) =>
  Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_, i) => start + i * step
  );

const fetchWeatherData = async (url, params) => {
  const response = await fetchWeatherApi(url, params);

  if (!response || response.length === 0) {
    throw new Error("No response received from the weather API");
  }

  const data = response[0];
  const utcOffsetSeconds = data.utcOffsetSeconds();
  const hourly = data.hourly();
  const timeRange = range(
    Number(hourly.time()),
    Number(hourly.timeEnd()),
    hourly.interval()
  );
  return {
    time: timeRange.map((t) => new Date((t + utcOffsetSeconds) * 1000)),
    temperature2m: hourly.variables(0).valuesArray(),
  };
};

const fetchForecastData = async (latitude, longitude) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    hourly: "temperature_2m",
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const response = await fetchWeatherData(url, params);
  return response;
};

const fetchHistoricalData = async (latitude, longitude, startDate, endDate) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    start_date: startDate,
    end_date: endDate,
    hourly: "temperature_2m",
  };
  const url = "https://archive-api.open-meteo.com/v1/archive";

  return await fetchWeatherData(url, params);
};

export { fetchForecastData, fetchHistoricalData };
