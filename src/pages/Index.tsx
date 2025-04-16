
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Shield, 
  TrendingUp, 
  Users, 
  Bitcoin,
  Calendar,
  Lock,
  Settings,
  Share2,
  Edit
} from "lucide-react";
import CryptoChart from "@/components/CryptoChart";
import ActivityFeed from "@/components/ActivityFeed";
import InvestmentModal from "@/components/InvestmentModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import WithdrawalBlockModal from "@/components/WithdrawalBlockModal";
import OnlineInvestorsCounter from "@/components/OnlineInvestorsCounter";
import DashboardHeader from "@/components/DashboardHeader";
import FloatingActionButton from "@/components/FloatingActionButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import TrendingCoins from "@/components/TrendingCoins";
import CryptoPriceList from "@/components/CryptoPriceList";
import SignupButton from "@/components/SignupButton";

const Index: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showWithdrawalBlock, setShowWithdrawalBlock] = useState(false);
  const [investmentDate, setInvestmentDate] = useState<Date | null>(null);
  const [unlockDate, setUnlockDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  const handleInvestmentSuccess = () => {
    setShowInvestModal(false);
    setShowConfirmation(true);
    setInvestmentDate(new Date());
    setUnlockDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    // Simulate investment credited to balance
    setInvestedAmount(prev => prev + 50); // Minimum investment amount
  };

  const handleWithdrawalClick = () => {
    // Check if withdrawal is allowed (1 month passed)
    if (!investmentDate || (Date.now() - investmentDate.getTime()) < 30 * 24 * 60 * 60 * 1000) {
      setShowWithdrawalBlock(true);
    } else {
      // Allow withdrawal (not implemented in this demo)
      alert("Withdrawal functionality would go here");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto">
          {/* Header with Signup Button */}
          <div className="flex justify-between items-center mb-8">
            <DashboardHeader investmentDate={investmentDate} />
            <SignupButton />
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Balance Card */}
              <Card className="glass-card p-6 mb-6">
                <h2 className="text-gray-400 text-sm mb-1">Available Balance</h2>
                <p className="text-3xl font-bold text-white mb-2">${balance.toFixed(2)}</p>
                
                {!investmentDate ? (
                  <p className="text-sm text-gray-300 mb-4">
                    Ready to grow your crypto future? Start investing from just $50.
                  </p>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Invested Amount</span>
                      <span className="text-white font-medium">${investedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-400">Lock Period</span>
                      <span className="text-white font-medium">30 days</span>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setShowInvestModal(true)} 
                    className="flex-1 bg-crypto-purple hover:bg-crypto-purple-light glow-border animate-pulse-glow"
                  >
                    <ArrowUpRight size={16} className="mr-2" />
                    Invest
                  </Button>
                  
                  <Button 
                    onClick={handleWithdrawalClick} 
                    variant="outline" 
                    className="flex-1 border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
                    disabled={!investmentDate}
                  >
                    <ArrowDownRight size={16} className="mr-2" />
                    Withdraw
                  </Button>
                </div>
              </Card>
              
              {/* Activity Feed */}
              <div className="mb-6">
                <ActivityFeed />
              </div>
              
              {/* Bitcoin Chart */}
              <Card className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center font-medium text-white">
                    <Bitcoin size={18} className="text-crypto-purple mr-2" />
                    Bitcoin Performance
                  </h3>
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp size={16} className="mr-1" />
                    +12.4%
                  </div>
                </div>
                <CryptoChart />
              </Card>
              
              {/* Trending Coins */}
              <TrendingCoins />
              
              {/* Security and Lock Period Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-card p-6 animate-fade-in">
                  <div className="flex items-start space-x-4">
                    <Shield className="text-crypto-purple flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Security Guarantee</h3>
                      <p className="text-sm text-gray-300">
                        Your funds are secured by 256-bit encryption and trusted crypto APIs
                      </p>
                    </div>
                  </div>
                </Card>
                
                {investmentDate && (
                  <Card className="glass-card p-6 animate-fade-in">
                    <div className="flex items-start space-x-4">
                      <Lock className="text-crypto-purple flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-white mb-1">Growth Protection</h3>
                        <p className="text-sm text-gray-300">
                          Your 30-day lock period ensures maximum returns by avoiding market volatility
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Funds unlock on:</p>
                          <p className="text-sm text-white font-medium">
                            {unlockDate.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Cryptocurrency Price List */}
              <CryptoPriceList />
            </div>
          </div>
          
          {/* Floating Action Button */}
          <FloatingActionButton />
        </div>
      </div>
      
      {/* Modals */}
      <InvestmentModal 
        isOpen={showInvestModal}
        onClose={() => setShowInvestModal(false)}
        onSuccess={handleInvestmentSuccess}
      />
      
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      />
      
      <WithdrawalBlockModal 
        isOpen={showWithdrawalBlock}
        onClose={() => setShowWithdrawalBlock(false)}
        unlockDate={unlockDate}
      />
    </SidebarProvider>
  );
};

export default Index;
