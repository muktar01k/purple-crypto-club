
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [step, setStep] = useState<'amount' | 'payment-method' | 'payment-form'>('amount');
  const [paymentMethod, setPaymentMethod] = useState<'gift-card' | 'go-cash' | 'bitcoin' | 'paypal'>('gift-card');
  
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
    setStep('payment-method');
  };
  
  const handleBack = () => {
    if (step === 'payment-method') {
      setStep('amount');
    } else if (step === 'payment-form') {
      setStep('payment-method');
    }
  };

  const handleSelectPaymentMethod = (method: 'gift-card' | 'go-cash' | 'bitcoin' | 'paypal') => {
    setPaymentMethod(method);
    setStep('payment-form');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-crypto-purple/20 bg-crypto-navy/80 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient-purple text-2xl font-bold">
            {step === 'amount' ? 'Join the Investment Club' : 
             step === 'payment-method' ? 'Select Payment Method' : 
             paymentMethod === 'gift-card' ? 'Add Gift Card' :
             paymentMethod === 'go-cash' ? 'Pay with GoCash' :
             paymentMethod === 'bitcoin' ? 'Pay with Bitcoin' : 'Pay with PayPal'}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {step === 'amount' 
              ? 'Start your crypto journey with a minimum of $50' 
              : step === 'payment-method'
              ? 'Choose your preferred payment method'
              : 'Complete your investment to start earning'}
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
        ) : step === 'payment-method' ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="flex justify-start items-center border-crypto-purple/30 bg-crypto-black/40 text-white hover:bg-crypto-purple/10 p-4 h-auto"
                onClick={() => handleSelectPaymentMethod('gift-card')}
              >
                <span className="mr-3 p-2 bg-crypto-purple/20 rounded-full">
                  <Gift className="text-crypto-purple h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="font-medium">Gift Card</p>
                  <p className="text-gray-300 text-xs">Pay with Amazon, Steam, Apple Gift Cards</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex justify-start items-center border-crypto-purple/30 bg-crypto-black/40 text-white hover:bg-crypto-purple/10 p-4 h-auto"
                onClick={() => handleSelectPaymentMethod('bitcoin')}
              >
                <span className="mr-3 p-2 bg-crypto-purple/20 rounded-full">
                  <Bitcoin className="text-crypto-purple h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="font-medium">Bitcoin</p>
                  <p className="text-gray-300 text-xs">Pay with BTC or other cryptocurrencies</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex justify-start items-center border-crypto-purple/30 bg-crypto-black/40 text-white hover:bg-crypto-purple/10 p-4 h-auto"
                onClick={() => handleSelectPaymentMethod('paypal')}
              >
                <span className="mr-3 p-2 bg-crypto-purple/20 rounded-full">
                  <CreditCard className="text-crypto-purple h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="font-medium">PayPal</p>
                  <p className="text-gray-300 text-xs">Quick and secure payment via PayPal</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex justify-start items-center border-crypto-purple/30 bg-crypto-black/40 text-white hover:bg-crypto-purple/10 p-4 h-auto"
                onClick={() => handleSelectPaymentMethod('go-cash')}
              >
                <span className="mr-3 p-2 bg-crypto-purple/20 rounded-full">
                  <CircleDollarSign className="text-crypto-purple h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="font-medium">GoCash</p>
                  <p className="text-gray-300 text-xs">Our native payment solution</p>
                </div>
              </Button>
            </div>

            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
              >
                Back
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <PaymentMethodSelection 
            onBack={handleBack} 
            onSuccess={onSuccess} 
            amount={Number(amount)} 
            paymentMethod={paymentMethod}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;
