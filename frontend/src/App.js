import './App.css'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './SplashScreenFolder/SplashScreen';
import SignUpScreen from './SignUpFolder/SignUpScreen';
import HomeScreen from './HomeScreenFolder/HomeScreen';
import SignInScreen from './SignInFolder/SignInScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/SignUpPath" element={<SignUpScreen />} />
        <Route path="/SignInScreen" element={<SignInScreen/>}/>
        <Route path="/HomeScreen" element={<HomeScreen/>}/>
      </Routes>
    </Router>
  );
}
export default App;