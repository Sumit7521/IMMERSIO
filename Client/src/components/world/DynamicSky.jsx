import React, { useState, useEffect } from 'react';
import { Environment } from '@react-three/drei';

// Sky presets based on time
const SKY_PRESETS = {
  dawn: "dawn", // 5-7 AM
  morning: "park", // 7-11 AM  
  noon: "city", // 11 AM-2 PM
  afternoon: "warehouse", // 2-6 PM
  evening: "sunset", // 6-8 PM
  night: "night", // 8 PM-5 AM
};

// HDRI files (if using custom HDRIs instead of presets)
const HDRI_FILES = {
  dawn: "/hdri/dawn.hdr",
  morning: "/hdri/morning.hdr", 
  noon: "/hdri/noon.hdr",
  afternoon: "/hdri/afternoon.hdr",
  evening: "/hdri/sunset.hdr",
  night: "/hdri/night.hdr",
};

// Get current time period
const getTimePeriod = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning'; 
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 20) return 'evening';
  return 'evening'; // 20-5
};

// Get light intensity based on time
const getLightIntensity = (timePeriod) => {
  const intensities = {
    dawn: 0.3,
    morning: 0.8,
    noon: 1.0,
    afternoon: 0.7,
    evening: 0.1,
    night: 0.1,
  };
  return intensities[timePeriod] || 0.5;
};

// Get ambient light intensity
const getAmbientIntensity = (timePeriod) => {
  const intensities = {
    dawn: 0.2,
    morning: 0.4,
    noon: 0.6,
    afternoon: 0.4,
    evening: 0.2,
    night: 0.1,
  };
  return intensities[timePeriod] || 0.3;
};

// Get directional light color
const getLightColor = (timePeriod) => {
  const colors = {
    dawn: "#FFB366", // Orange dawn light
    morning: "#FFFFFF", // White morning light
    noon: "#FFFFFF", // Pure white noon
    afternoon: "#FFF4E6", // Slightly warm afternoon
    evening: "#FF6B35", // Orange evening light
    night: "#4A90E2", // Cool blue night light
  };
  return colors[timePeriod] || "#FFFFFF";
};

export const DynamicSky = ({ useCustomHDRI = false }) => {
  const [currentTime, setCurrentTime] = useState(getTimePeriod());
  const [lightIntensity, setLightIntensity] = useState(getLightIntensity(getTimePeriod()));
  const [ambientIntensity, setAmbientIntensity] = useState(getAmbientIntensity(getTimePeriod()));
  const [lightColor, setLightColor] = useState(getLightColor(getTimePeriod()));

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const newTimePeriod = getTimePeriod();
      if (newTimePeriod !== currentTime) {
        setCurrentTime(newTimePeriod);
        setLightIntensity(getLightIntensity(newTimePeriod));
        setAmbientIntensity(getAmbientIntensity(newTimePeriod));
        setLightColor(getLightColor(newTimePeriod));
        
        console.log(`Sky changed to: ${newTimePeriod}`);
      }
    };

    // Update immediately
    updateTime();
    
    // Check every minute for time changes
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [currentTime]);

  return (
    <>
      {/* Dynamic Environment */}
      {useCustomHDRI ? (
        <Environment 
          files={HDRI_FILES[currentTime]} 
          background 
        />
      ) : (
        <Environment 
          preset={SKY_PRESETS[currentTime]} 
          background 
        />
      )}
      
      {/* Dynamic Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={lightIntensity}
        color={lightColor}
        castShadow 
      />
      
      {/* Optional: Fog for atmosphere */}
      <fog attach="fog" args={[
        currentTime === 'night' ? '#1a1a2e' : 
        currentTime === 'dawn' ? '#ffa366' :
        currentTime === 'evening' ? '#ff6b35' : '#87CEEB', 
        10, 
        1000
      ]} />
    </>
  );
};

// Debug component to show current time (optional)
export const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(getTimePeriod());
  const [realTime, setRealTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTimePeriod());
      setRealTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <div>Time: {realTime}</div>
      <div>Sky: {currentTime}</div>
    </div>
  );
};