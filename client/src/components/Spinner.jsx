import React from 'react';

const Spinner = () => {
  const divStyle = {
    backgroundColor: 'rgba(0,104,74,0.2)',
    height: '100%',
    position: 'absolute',
    width: '100%',
    border: '2.2px solid #00684a',
  };

  const containerStyle = {
    width: '44.8px',
    height: '44.8px',
    animation: 'spinner-y0fdc1 2s infinite ease',
    transformStyle: 'preserve-3d',
  };

  return (
    <div style={containerStyle} className="relative">
      <div style={{ ...divStyle, transform: 'translateZ(-22.4px) rotateY(180deg)' }}></div>
      <div style={{ ...divStyle, transform: 'rotateY(-270deg) translateX(50%)', transformOrigin: 'top right' }}></div>
      <div style={{ ...divStyle, transform: 'rotateY(270deg) translateX(-50%)', transformOrigin: 'center left' }}></div>
      <div style={{ ...divStyle, transform: 'rotateX(90deg) translateY(-50%)', transformOrigin: 'top center' }}></div>
      <div style={{ ...divStyle, transform: 'rotateX(-90deg) translateY(50%)', transformOrigin: 'bottom center' }}></div>
      <div style={{ ...divStyle, transform: 'translateZ(22.4px)' }}></div>
    </div>
  );
};

export default Spinner;
