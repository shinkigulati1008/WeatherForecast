import { useContext } from 'react';
import { WeatherContext } from '../../contexts/WeatherContext';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon
const Map = () => {
    const { weatherData } = useContext(WeatherContext);
  return (
    <div>
        {weatherData && weatherData.coord.lat && weatherData.coord.lon &&
        <MapContainer
            key={`${weatherData.coord.lat}-${weatherData.coord.lon}`}
            center={[weatherData.coord.lat, weatherData.coord.lon]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
            <Popup>
                {weatherData && (
                    <>
                        <h3>{weatherData.name}</h3>
                        <p>{weatherData.weather[0].description}</p>
                    </>
                )}
            </Popup>
            </Marker>
        </MapContainer>
        }
    </div>
  )
}

export default Map
