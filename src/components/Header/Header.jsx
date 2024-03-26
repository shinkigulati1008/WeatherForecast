import {useContext, useState,useEffect } from 'react';
import LogoImg from '../../assets/logo.png';
import './Header.css';
import { WeatherContext } from '../../contexts/WeatherContext';
import { useDebounce } from '../../hooks/useDebounce';
import SearchSVG from '../../assets/search.svg';

const Header = () => {
    const { weatherData, setCity, city, fetchSuggestedLocations, suggestedLocations } = useContext(WeatherContext);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const debouncedSearchTerm = useDebounce(inputValue, 500);

    
    useEffect(() => {
        if (debouncedSearchTerm) {
          fetchSuggestedLocations(debouncedSearchTerm);
        } else {
          setShowSuggestions(false);
        }
     }, [debouncedSearchTerm]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setCity(e.target.value);
        if (e.target.value.trim() !== '') {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const fullCityDetails = `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`;
        setCity(fullCityDetails); 
        setShowSuggestions(false); 
    };

  return (
    <div className="header-outer">
        <div className='header-inner'>
            <a className='header-logo' href='/'>
                <img width={134} src={LogoImg} alt="Weather Logo" />
            </a>
            <a className='header-city-link'>
                <h1 className='header-loc'>{city && city.split(',').map((part, index) => (
                    <span key={index}>{part.trim()+' '}</span>
                ))}</h1>
                <span className="header-temp">{weatherData && weatherData.main.temp} 
                    <span className='unit'>°C</span>
                </span>
                <span className='header-weather-icon'> 
                {weatherData && <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="Weather Icon"/>}
                </span>
            </a>
            <div className='pull-right'>
                <div className="header-search-bar search-bar">
                    <div className="searchbar-inner">
                        <img className="icon-search" src={SearchSVG} alt="Search Icon" />
                        <div className='search-form'>
                            <input name="query" 
                            className="search-input" 
                            type="text" 
                            placeholder="Address, City or Zip Code"
                            value = {city} 
                            autoComplete='off'
                            onChange={handleInputChange}></input>
                            {showSuggestions && (
                                    <ul className="suggested-locations">
                                    {suggestedLocations && suggestedLocations.map((location, index) => (
                                        <li key={`${location.name}-${index}`} onClick={() => handleSuggestionClick(location)}>
                                            {location.name}, {location.state}, {location.country}
                                        </li>
                                    ))}
                                    </ul>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>      
    </div>
  )
}

export default Header
