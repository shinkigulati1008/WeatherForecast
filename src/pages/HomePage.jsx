import { useContext } from 'react';
import Header from '../components/Header/Header';
import Weather from '../components/Weather/Weather'
import Map from '../components/Map/Map'
import Footer from '../components/Footer/Footer';
import Raindrop from '../components/Raindrop/Raindrop';
import SunnyBackground from '../components/SunnyBackground/SunnyBackground';
import CloudsAnimation from '../components/CloudsAnimation/CloudsAnimation';
import { WeatherContext } from '../contexts/WeatherContext';

const HomePage = () => {
    const sampleWeatherData = {
      weather: [{ main: 'Clear', icon: '01d' }] 
    };
    const { weatherData } = useContext(WeatherContext) || sampleWeatherData;
    const weather = weatherData && weatherData?.weather[0]?.main.toLowerCase();
    const isDaytime = weatherData && weatherData.weather[0].icon.includes('d');
    console.log("weather", isDaytime)
    return (
      <>
          <Header />
          {weatherData && weather?.includes('clouds') && <CloudsAnimation day={isDaytime}/>}
          {weatherData && weather.includes('clear') && <SunnyBackground day={isDaytime}/>} 
          {weatherData && (weather.includes('haze') || weather.includes('drizzle') || weather.includes('rain') || weather.includes('snow')) && <Raindrop weather={weather} day={isDaytime}/>}
          <Weather/>
          <Map/>
          <Footer/>       
      </>
    )
}

export default HomePage
