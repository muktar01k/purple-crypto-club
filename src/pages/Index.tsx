
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
  Edit,
  Gift,
  CircleDollarSign
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
import GiftCardModal from "@/components/GiftCardModal";
import ProfitTracker from "@/components/ProfitTracker";
import { UserService, Investment } from "@/services/UserService";
import { useToast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showWithdrawalBlock, setShowWithdrawalBlock] = useState(false);
  const [investmentDate, setInvestmentDate] = useState<Date | null>(null);
  const [unlockDate, setUnlockDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (UserService.isUserLoggedIn()) {
      const userData = UserService.getUserData();
      
      if (userData) {
        setUserName(userData.name);
        setIsSignedUp(true);
        setBalance(UserService.getTotalBalance());
        setPendingBalance(UserService.getPendingBalance());
        
        if (userData.investments.length > 0) {
          setInvestmentDate(userData.investments[0].date);
          setInvestedAmount(userData.investments.reduce((sum, inv) => sum + inv.amount, 0));
        }
      }
    }
    
    const intervalId = setInterval(() => {
      setBalance(UserService.getTotalBalance());
      setPendingBalance(UserService.getPendingBalance());
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Effect for profit generation (2.8% daily growth rate)
  useEffect(() => {
    const userData = UserService.getUserData();
    if (!userData) return;
    
    // First handle pending investments
    const pendingInvestments = userData.investments.filter(inv => inv.status === 'pending');
    
    pendingInvestments.forEach(inv => {
      setTimeout(() => {
        UserService.updateInvestmentStatus(inv.id, 'available');
        setPendingBalance(prev => Math.max(0, prev - inv.amount));
        setBalance(UserService.getTotalBalance());
        
        toast({
          title: "Investment Available",
          description: `Your $${inv.amount.toFixed(2)} investment is now generating profits!`
        });
      }, 60 * 1000);
    });

    // Now set up profit generation for available investments
    const availableInvestments = userData.investments.filter(inv => inv.status === 'available');
    
    if (availableInvestments.length > 0) {
      // Calculate daily rate as 2.8%
      const dailyRate = 0.028;
      // Convert to per-minute rate for simulation
      const minuteRate = dailyRate / (24 * 60);
      
      const profitInterval = setInterval(() => {
        availableInvestments.forEach(investment => {
          // Calculate profit based on invested amount
          const profitAmount = investment.amount * minuteRate;
          
          if (profitAmount > 0) {
            UserService.recordProfit(investment.id, profitAmount);
            setBalance(prev => prev + profitAmount);
            
            toast({
              title: "Profit Generated",
              description: `+$${profitAmount.toFixed(2)} from your investment!`,
              variant: "default"
            });
          }
        });
      }, 3 * 60 * 1000); // Generate profit every 3 minutes for demo purposes
      
      return () => clearInterval(profitInterval);
    }
  }, [investedAmount, toast]);

  const handleInvestmentSuccess = (investment: Investment) => {
    if (investment) {
      setInvestedAmount(prev => prev + investment.amount);
      setPendingBalance(prev => prev + investment.amount);
      setShowInvestModal(false);
      
      toast({
        title: "Payment Successful",
        description: `Your $${investment.amount.toFixed(2)} investment will be available shortly!`
      });

      if (!investmentDate) {
        setInvestmentDate(new Date());
        setUnlockDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      }
    }
  };

  const handleWithdrawalClick = () => {
    if (!investmentDate || (Date.now() - investmentDate.getTime()) < 30 * 24 * 60 * 60 * 1000) {
      setShowWithdrawalBlock(true);
    } else {
      alert("Withdrawal functionality would go here");
    }
  };
  
  const handleSignupSuccess = (name: string) => {
    setUserName(name);
    setIsSignedUp(true);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        
        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <DashboardHeader 
              investmentDate={investmentDate} 
              userName={userName}
            />
            <SignupButton 
              onSignupSuccess={handleSignupSuccess}
              isSignedUp={isSignedUp}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card p-6 mb-6">
                <h2 className="text-gray-400 text-sm mb-1">Available Balance</h2>
                <p className="text-3xl font-bold text-white mb-2">${balance.toFixed(2)}</p>
                
                {pendingBalance > 0 && (
                  <div className="text-sm text-yellow-300 mb-4 animate-pulse flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-yellow-300 mr-2 animate-pulse"></span>
                    +${pendingBalance.toFixed(2)} pending
                  </div>
                )}
                
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
                      <span className="text-gray-400">Daily Growth Rate</span>
                      <span className="text-green-400 font-medium">+2.8%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-400">Lock Period</span>
                      <span className="text-white font-medium">30 days</span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
              
              {isSignedUp && <ProfitTracker />}
              
              <div className="mb-6">
                <ActivityFeed />
              </div>
              
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
              
              <TrendingCoins />
              
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
            
            <div>
              <CryptoPriceList />
            </div>
          </div>
          
          <FloatingActionButton />
        </div>
      </div>
      
      <InvestmentModal 
        isOpen={showInvestModal}
        onClose={() => setShowInvestModal(false)}
        onSuccess={handleInvestmentSuccess}
      />
      
      <GiftCardModal
        isOpen={showGiftCardModal}
        onClose={() => setShowGiftCardModal(false)}
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
