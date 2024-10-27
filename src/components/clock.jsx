import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
      <span>
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </span>
    );
};

export default Clock;