import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const OnlineInvestorsCounter: React.FC = () => {
  const [count, setCount] = useState(2478);
  
  // Randomly fluctuate the number to simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Add or subtract a small random number (more likely to add)
      const change = Math.random() > 0.3 
        ? Math.floor(Math.random() * 7) + 1 
        : -Math.floor(Math.random() * 4) - 1;
        
      setCount(prevCount => {
        // Keep the count within reasonable bounds
        const newCount = prevCount + change;
        return newCount >= 2400 && newCount <= 2600 ? newCount : prevCount;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center text-sm text-gray-400">
      <Users size={14} className="inline mr-1 text-crypto-purple-light" />
      <span>Investors online: <span className="text-white">{count}</span></span>
    </div>
  );
};

export default OnlineInvestorsCounter;
