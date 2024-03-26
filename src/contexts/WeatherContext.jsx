import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiBase = import.meta.env.VITE_API_BASE;
  const [city, setCity] = useState('Auckland');
  const [weatherData, setWeatherData] = useState(null);
  const [suggestedLocations, setSuggestedLocations] = useState([]); 
  let timeoutId;

  const fetchWeather = async (cityName) => {
    try {
      const response = await axios.get(`${apiBase}/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchSuggestedLocations = async (inputValue) => {
    try {
      const response = await axios.get(`${apiBase}/geo/1.0/direct?q=${inputValue}&limit=5&appid=${apiKey}&units=metric`)
      setSuggestedLocations(response.data);
    } catch (error) {
      console.error('Error fetching suggested locations:', error);
      setSuggestedLocations([]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await axios.get(`${apiBase}/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`);
          const cityName = response.data.name;
          setCity(cityName);
          setWeatherData(response.data);
        } catch (error) {
          console.error('Error getting current location:', error);
          fetchWeather('Auckland');
        }
      }, (error) => {
        console.error('Error accessing geolocation:', error);
        fetchWeather('Auckland');
      });
    } else {
      fetchWeather('Auckland');
    }
  };

  const convertToLowerCase = (inputString) => {
     return inputString.toLowerCase();
    };

  useEffect(() => {
    getCurrentLocation();
 }, []); 

  useEffect(() => {
    if((weatherData && convertToLowerCase(weatherData.name) !== convertToLowerCase(city))  && city !== 'Auckland') {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fetchWeather(city);
          }, 1000);
          return () => clearTimeout(timeoutId); 
      }
 }, [city]);

  return (
    <WeatherContext.Provider value={{ weatherData, setCity, city, suggestedLocations, fetchSuggestedLocations  }}>
      {children}
    </WeatherContext.Provider>
  );
};
