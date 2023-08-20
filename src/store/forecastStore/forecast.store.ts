import { create } from 'zustand';
import ky from 'ky';

type FetchForecastParams = {
  latitude: number;
  longitude: number;
};

const BASIC_API_URL = 'https://api.open-meteo.com/v1/forecast';

type Current_weather = {
  is_day: number;
  temperature: number;
  time: string;
  weathercode: number;
  winddirection: number;
  windspeed: number;
};

type Weather = {
  current_weather: Current_weather;
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
};

type ForecastStore = {
  fetchForecast: (params: FetchForecastParams) => Promise<void>;
  weather: Weather | null;
};

export const useForecast = create<ForecastStore>((set) => ({
  async fetchForecast(params) {
    const result: Weather = await (
      await ky.get(BASIC_API_URL, {
        searchParams: { ...params, current_weather: true },
      })
    ).json();

    set({ weather: result });
  },
  weather: null,
}));
