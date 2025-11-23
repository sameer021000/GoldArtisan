import './SplashScreenCSS.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/SignUpPath');
    }, 3000); // 3000 ms = 3 seconds; change as you like

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div id="divId1">
      <div id="divId2">
        <h1 id="h1Id1">Welcome to Customized Ornaments World</h1>
        <p id="pId1">Crafting unique pieces — join as an artisan</p>
      </div>
    </div>
  );
};

export default SplashScreen;
