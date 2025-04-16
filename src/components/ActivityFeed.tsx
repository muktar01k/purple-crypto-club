
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Fake activity data
const fakeActivities = [
  { user: 'user89**233', amount: 20000, type: 'withdrawal' },
  { user: 'anon_345', amount: 300, type: 'profit', initialAmount: 100 },
  { user: 'crypto_girl77', amount: 5600, type: 'profit' },
  { user: 'btc_whale42', amount: 18500, type: 'withdrawal' },
  { user: 'hodl_king', amount: 12750, type: 'profit', initialAmount: 2500 },
  { user: 'moon_investor', amount: 8300, type: 'withdrawal' },
  { user: 'satoshi_fan', amount: 4500, type: 'profit', initialAmount: 500 },
  { user: 'diamond_hands', amount: 15000, type: 'withdrawal' },
];

const ActivityFeed: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  
  useEffect(() => {
    // Rotate through activities every few seconds
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % fakeActivities.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const activity = fakeActivities[currentActivity];
  
  const getMessage = () => {
    if (activity.type === 'withdrawal') {
      return (
        <div className="flex items-center text-sm">
          <ArrowUpRight className="text-green-400 mr-2" size={16} />
          <span><span className="font-semibold">{activity.user}</span> just withdrew <span className="text-green-400 font-bold">${activity.amount.toLocaleString()}</span></span>
        </div>
      );
    } else if (activity.type === 'profit') {
      if (activity.initialAmount) {
        return (
          <div className="flex items-center text-sm">
            <ArrowUpRight className="text-green-400 mr-2" size={16} />
            <span><span className="font-semibold">{activity.user}</span> tripled their <span className="text-amber-400 font-bold">${activity.initialAmount.toLocaleString()}</span> investment in 30 days</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center text-sm">
            <ArrowUpRight className="text-green-400 mr-2" size={16} />
            <span><span className="font-semibold">{activity.user}</span> just pulled out <span className="text-green-400 font-bold">${activity.amount.toLocaleString()}</span> profit</span>
          </div>
        );
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center h-10 overflow-hidden glass-card px-4 rounded-lg animate-fade-in">
      {getMessage()}
    </div>
  );
};

export default ActivityFeed;
