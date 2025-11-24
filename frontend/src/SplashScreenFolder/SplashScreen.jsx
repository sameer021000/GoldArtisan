import './SplashScreenCSS.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/SignUpPath');
    }, 10000); // 3000 ms = 3 seconds; change as you like

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div id="divId1">
      <div id="divId2">
        <h1 id="h1Id1">Welcome to COMer</h1>
        <div id="divId3">
          <h4 id="h4Id1">C-Customized</h4>
          <h4 id="h4Id2">O-Ornament</h4>
          <h4 id="h4Id3">M-Maker</h4>
          <h4 id="h4Id4">That’s what a true COMer is!</h4>
        </div>
        <h3 id="h3Id1">A COMer isn’t who you are — it’s what you Create</h3>
      </div>
    </div>
  );
};

export default SplashScreen;
