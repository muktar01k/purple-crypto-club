
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { UserService, Investment } from '@/services/UserService';

const ProfitTracker: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  
  useEffect(() => {
    const loadUserData = () => {
      const userData = UserService.getUserData();
      if (userData) {
        setInvestments(userData.investments);
        setTotalProfit(userData.totalProfit);
      }
    };
    
    loadUserData();
    
    // Listen for storage changes (in case localStorage gets updated in another tab)
    const handleStorageChange = () => loadUserData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Listen for available investments and simulate profits
  useEffect(() => {
    const availableInvestments = investments.filter(inv => inv.status === 'available');
    if (availableInvestments.length === 0) return;
    
    // Simulate profit increase every 3 minutes for available investments
    const profitInterval = setInterval(() => {
      availableInvestments.forEach(investment => {
        // Calculate 10% of the investment amount
        const profitAmount = investment.amount * 0.1;
        UserService.recordProfit(investment.id, profitAmount);
        
        // Reload the data
        const userData = UserService.getUserData();
        if (userData) {
          setInvestments(userData.investments);
          setTotalProfit(userData.totalProfit);
        }
      });
    }, 3 * 60 * 1000); // 3 minutes
    
    return () => clearInterval(profitInterval);
  }, [investments]);
  
  if (investments.length === 0) {
    return null;
  }
  
  return (
    <Card className="glass-card p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Investment Growth</h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Total Profit</span>
          <span className="text-green-400 font-medium">
            +${totalProfit.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Total Invested</span>
          <span className="text-white font-medium">
            ${investments.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>
      
      <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Profits</h4>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {investments.flatMap(inv => 
          inv.profits.map((profit, i) => ({
            profit,
            investmentId: inv.id,
            source: inv.source
          }))
        )
        .sort((a, b) => b.profit.timestamp.getTime() - a.profit.timestamp.getTime())
        .slice(0, 7)
        .map((item, index) => (
          <div key={`${item.investmentId}-${index}`} className="flex items-center justify-between bg-crypto-black/30 p-2 rounded-md">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <ArrowUpRight size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Profit Earned</p>
                <p className="text-xs text-gray-400">
                  {item.profit.timestamp.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="text-green-400 font-medium">
              +${item.profit.amount.toFixed(2)}
            </div>
          </div>
        ))}
        
        {investments.flatMap(inv => inv.profits).length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No profits recorded yet. Profits accumulate over time.
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfitTracker;
