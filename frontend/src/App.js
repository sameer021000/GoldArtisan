import './App.css'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './SplashScreenFolder/SplashScreen';
import SignUpScreen from './SignUpFolder/SignUpScreen';
import HomeScreen from './HomeScreenFolder/HomeScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/SignUpPath" element={<SignUpScreen />} />
        <Route path="/HomeScreen" element={<HomeScreen/>}/>
      </Routes>
    </Router>
  );
}

export default App;
