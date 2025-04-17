
import React from 'react';
import { Calendar } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Mobile Layout: App Name */}
      <div className="w-full flex justify-center md:hidden mb-2">
        <div className="text-xl font-bold text-gradient-purple glow-text">
          DIVO
        </div>
      </div>

      {/* Mobile Hamburger and Greeting */}
      <div className="w-full flex items-center justify-between md:hidden mb-2">
        <SidebarTrigger className="text-white">
          <Menu size={24} />
        </SidebarTrigger>
        
        {userName && (
          <div className="text-lg font-medium text-white">
            {getGreeting()} <span className="text-crypto-purple-light">{userName}</span>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
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
    </div>
  );
};

export default DashboardHeader;
