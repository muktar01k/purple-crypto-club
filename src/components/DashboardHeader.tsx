
import React from 'react';
import { Calendar } from 'lucide-react';
import { UserService } from '@/services/UserService';

interface DashboardHeaderProps {
  investmentDate?: Date | null;
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  investmentDate,
  userName 
}) => {
  // Use greeting from UserService if available
  const greeting = UserService.isUserLoggedIn() 
    ? UserService.getGreeting()
    : userName 
      ? `Welcome, ${userName}!`
      : "Welcome to DIVO";
  
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {greeting}
      </h1>
      
      {investmentDate && (
        <div className="flex items-center text-sm text-gray-400">
          <Calendar size={14} className="mr-1.5" />
          <span>
            Invested on {investmentDate.toLocaleDateString('en-US', { 
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
