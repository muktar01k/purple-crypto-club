
import React from 'react';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  investmentDate: Date | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ investmentDate }) => {
  return (
    <div>
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
