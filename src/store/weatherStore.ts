// src/store/weatherStore.ts
import { create } from 'zustand';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  conditionDescription: string;
  icon: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
}

export interface ForecastItem {
  day: string;
  temp: number;
  icon: string;
}

interface WeatherState {
  data: WeatherData | null;
  forecast: ForecastItem[];
  loading: boolean;
  error: string | null;
  fetchWeatherData: (coords?: { lat: number; lon: number }) => Promise<void>;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const getDayOfWeek = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', { weekday: 'short' });
};

export const useWeatherStore = create<WeatherState>((set) => ({
  data: null,
  forecast: [],
  loading: true,
  error: null,
  fetchWeatherData: async (coords) => {
    set({ loading: true, error: null });
    try {
      let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Manaus&appid=${API_KEY}&lang=pt_br&units=metric`;
      let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Manaus&appid=${API_KEY}&lang=pt_br&units=metric`;

      if (coords) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&lang=pt_br&units=metric`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&lang=pt_br&units=metric`;
      }
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Não foi possível obter os dados do clima.');
      }
      
      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      const formattedData: WeatherData = {
        location: weatherData.name,
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        conditionDescription: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        tempMin: Math.round(weatherData.main.temp_min),
        tempMax: Math.round(weatherData.main.temp_max),
        humidity: weatherData.main.humidity,
      };

      const formattedForecast: ForecastItem[] = forecastData.list
        .filter((_: any, index: number) => index % 8 === 0)
        .slice(0, 5)
        .map((item: any) => ({
          day: getDayOfWeek(item.dt),
          temp: Math.round(item.main.temp),
          icon: item.weather[0].icon,
        }));

      set({ data: formattedData, forecast: formattedForecast, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      }
    }
  },
}));