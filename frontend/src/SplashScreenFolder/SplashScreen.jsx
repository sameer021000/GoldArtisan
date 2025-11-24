import './SplashScreenCSS.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/SignUpPath');
    }, 10000); // change timing if you like

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div id="divId1">
      <div id="divId2">
        <h1 id="h1Id1">Welcome COMer</h1>

        <div id="divId3" aria-hidden="true">
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <h4 id="h4Id1">C - Customized</h4>
            <h4 id="h4Id2">O - Ornament</h4>
            <h4 id="h4Id3">M - Maker</h4>
          </div>

          <h4 id="h4Id4">That’s what a true COMer is!</h4>
        </div>
      </div>

      {/* moved outside of the card so it can sit at the bottom of the screen */}
      <h3 id="h3Id1">A COMer isn’t who you are — it’s what you Create.</h3>
    </div>
  );
};

export default SplashScreen;
