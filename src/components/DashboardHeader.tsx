
import React from 'react';
import OnlineInvestorsCounter from './OnlineInvestorsCounter';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  investmentDate: Date | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ investmentDate }) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gradient-purple glow-text animate-pulse-glow">Purple Crypto Club</h1>
      <div className="flex items-center space-x-3 mt-1">
        <OnlineInvestorsCounter />
        {investmentDate && (
          <p className="text-gray-400 text-sm flex items-center">
            <Calendar size={14} className="inline mr-1 text-crypto-purple-light" />
            Investor since: {investmentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
