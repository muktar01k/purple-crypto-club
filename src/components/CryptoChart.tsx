
import React, { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

// Generate fake data that shows an upward trend with some volatility
const generateFakeData = () => {
  const data = [];
  let value = 19000 + Math.random() * 1000;
  
  for (let i = 0; i < 30; i++) {
    // Mostly up but some downs to simulate volatility
    const change = (Math.random() > 0.3 ? 1 : -1) * Math.random() * 200;
    value += change;
    data.push({ value });
  }
  
  return data;
};

const CryptoChart: React.FC = () => {
  const [data, setData] = useState(generateFakeData());
  
  // Regenerate data every 30 seconds to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateFakeData());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full h-24 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#9b87f5" 
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>30 days ago</span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default CryptoChart;
