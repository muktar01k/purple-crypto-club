
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PaymentMethodSelection from './PaymentMethodSelection';
import { Investment } from '@/services/UserService';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (investment: Investment) => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState<string>('50');
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (Number(value) >= 50) {
      setError('');
    }
  };
  
  const handleContinue = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 50) {
      setError('Minimum investment amount is $50');
      return;
    }
    setStep('payment');
  };
  
  const handleBack = () => {
    setStep('amount');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-crypto-purple/20 bg-crypto-navy/80 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient-purple text-2xl font-bold">
            {step === 'amount' ? 'Join the Investment Club' : 'Add Gift Card'}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {step === 'amount' 
              ? 'Start your crypto journey with a minimum of $50' 
              : 'Upload your gift card to start investing'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'amount' ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm text-gray-300">Investment Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400">$</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8 border-crypto-purple/30 bg-crypto-black/40 text-white"
                  min={50}
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <p className="text-xs text-gray-400 mt-1">Minimum investment: $50</p>
            </div>
            
            <div className="bg-crypto-purple/10 p-3 rounded-lg border border-crypto-purple/20">
              <h4 className="text-sm font-medium text-crypto-purple-light">Why invest with us?</h4>
              <ul className="text-xs text-gray-300 mt-2 space-y-1">
                <li>• Proprietary AI-driven trading algorithms</li>
                <li>• Up to 2.8% daily growth potential</li>
                <li>• 24/7 automated risk management</li>
              </ul>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleContinue}
                className="w-full bg-crypto-purple hover:bg-crypto-purple-light text-white"
              >
                Continue
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <PaymentMethodSelection onBack={handleBack} onSuccess={onSuccess} amount={Number(amount)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
