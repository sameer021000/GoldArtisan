import './App.css'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './SplashScreenFolder/SplashScreen';
import SignUpScreen from './SignUpFolder/SignUpScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/SignUpPath" element={<SignUpScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
