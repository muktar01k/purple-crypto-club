
import React from 'react';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  investmentDate: Date | null;
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  investmentDate, 
  userName 
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      {userName && (
        <div className="text-lg font-medium text-white mb-2">
          {getGreeting()} <span className="text-crypto-purple-light">{userName}</span>
        </div>
      )}
      
      {investmentDate && (
        <div className="flex items-center text-sm text-gray-400">
          <Calendar size={14} className="mr-1" />
          <span>
            Investor since: {investmentDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
