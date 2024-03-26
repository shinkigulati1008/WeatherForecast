import { WeatherProvider } from './contexts/WeatherContext';
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
      <WeatherProvider>
        <HomePage/>      
      </WeatherProvider>      
  )
}

export default App
