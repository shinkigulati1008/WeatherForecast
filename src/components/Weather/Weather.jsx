import { useContext, useState, useEffect, useMemo  } from 'react';
import { WeatherContext } from '../../contexts/WeatherContext';
import './Weather.css';
import CloudImage from '../../assets/cloud.png';
import SunImage from '../../assets/sun.png';
import MoonImage from '../../assets/moon.png';
import RainImage from '../../assets/rain.png';
import HazeImage from '../../assets/haze.jpeg';

const Weather = () => {
  const { weatherData } = useContext(WeatherContext);
  const [localTime, setLocalTime] = useState('');

   useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const offsetMilliseconds = weatherData && weatherData.timezone * 1000; // Convert seconds to milliseconds
      const localOffsetMilliseconds = now.getTimezoneOffset() * 60 * 1000; // Convert local offset to milliseconds
      const totalOffsetMilliseconds = offsetMilliseconds + localOffsetMilliseconds;
      const targetTime = new Date(now.getTime() + totalOffsetMilliseconds);
      const formattedTime = targetTime.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      });
      setLocalTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [weatherData]);


  const getCurrentTime = ()=> {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const period = hours >= 12 ? 'pm' : 'am';

    // Convert 24-hour time to 12-hour time
    hours = hours % 12 || 12;

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}${period}`;
}
  // Memoize the weather icon
  const weatherIcon = useMemo(() => {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
      return null;
    }

    const weather = weatherData.weather[0].main.toLowerCase();
    const weatherCode = weatherData.weather[0].icon;
    const isDaytime = weatherCode.includes('d');

    if (weather.includes('clouds')) {
      return (
        <div className={`icon ${isDaytime ? 'cloudy-day' : 'cloudy-night'}`}>
          <img src={CloudImage} alt="Clouds" />
        </div>
      );
    } else if (weather.includes('clear')) {
      return (
        <div className={`icon ${isDaytime ? 'sun' : 'moon'}`}>
          <img src={isDaytime ? SunImage : MoonImage} alt={isDaytime ? 'Sun' : 'Moon'} />
        </div>
      );
    } else if (weather.includes('rain')) {
      return (
        <div className="icon rainy">
          <img src={RainImage} alt="Rain" />
        </div>
      );
    } else if (weather.includes('haze')) {
      return (
        <div className="icon hazy">
          <img src={HazeImage} alt="Haze" />
        </div>
      );
    } else {
      return null;
    }
  }, [weatherData]);


  return (
    <div className='weather'>
      <div className="weather-container">
        <div className='weather-header'>
            <h1>Current Weather</h1>
            <p className='sub'>{localTime ? localTime : getCurrentTime()}</p></div>     
          <div className='weather-content'>
            <div className='current-weather'>
                <div className='current-weather-info'>
                    <div className='weather-icon'>
                    {weatherIcon}
                    </div>
                </div>
                <div className='temp'>
                  <div className='display-temp'>
                      {weatherData && weatherData.main.temp}
                      <span className="unit">°C</span>
                  </div>
                </div>
                <div className='current-weather-info'>
                    {weatherData && weatherData.weather[0].description}
                </div>
            </div>
            {weatherData && weatherData.sys && <div className='current-weather-extra'>
                <div className='sunrise-sunset'>
                  <h3>Sunset</h3>
                  <p>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
                </div>
                <div className='sunrise-sunset'>
                  <h3>Sunrise</h3>
                  <p>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
                </div>
            </div> }
          </div>
          <div className='current-weather-details'>
            {weatherData && weatherData.main && (
              <>
                {Object.keys(weatherData.main).map((key) => {
                 const formattedKey = key.replace(/_./g, (match) => ' ' + match[1].toUpperCase());

                  const value = weatherData.main[key];
                  return (
                    <div className='detail-item' key={key}>
                      <h3>{formattedKey.toUpperCase()}</h3>
                      <p>{value}</p>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

      
    </div>
  );
};

export default Weather;