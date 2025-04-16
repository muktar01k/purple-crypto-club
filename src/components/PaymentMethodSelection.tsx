
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Bitcoin, 
  CircleDollarSign, 
  ArrowLeft 
} from "lucide-react";
import VerificationModal from './VerificationModal';

interface PaymentMethodSelectionProps {
  onBack: () => void;
  onSuccess: () => void;
  amount: number;
}

type PaymentMethod = 'card' | 'paypal' | 'bitcoin' | 'ethereum' | 'usdt';

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onBack,
  onSuccess,
  amount
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [showVerification, setShowVerification] = useState(false);
  
  const handleMethodSelect = (value: string) => {
    setSelectedMethod(value as PaymentMethod);
  };
  
  const handleContinue = () => {
    if (selectedMethod === 'card') {
      setShowVerification(true);
    } else {
      // For demo purposes, just simulate success for other payment methods
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  };
  
  const handleVerificationSuccess = () => {
    setShowVerification(false);
    onSuccess();
  };
  
  return (
    <>
      <div className="space-y-4 py-2">
        <div className="pb-2">
          <p className="text-center text-lg font-medium text-crypto-purple-light">${amount.toLocaleString()}</p>
        </div>
        
        <RadioGroup 
          defaultValue={selectedMethod} 
          onValueChange={handleMethodSelect}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 rounded-lg border border-crypto-purple/20 p-3 cursor-pointer hover:bg-crypto-purple/10 transition-colors">
            <RadioGroupItem value="card" id="card" className="border-crypto-purple-light text-crypto-purple" />
            <Label htmlFor="card" className="flex items-center cursor-pointer">
              <CreditCard className="h-4 w-4 mr-2 text-crypto-purple-light" />
              <span>Credit/Debit Card</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-lg border border-crypto-purple/20 p-3 cursor-pointer hover:bg-crypto-purple/10 transition-colors">
            <RadioGroupItem value="paypal" id="paypal" className="border-crypto-purple-light text-crypto-purple" />
            <Label htmlFor="paypal" className="flex items-center cursor-pointer">
              <CircleDollarSign className="h-4 w-4 mr-2 text-crypto-purple-light" />
              <span>PayPal</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-lg border border-crypto-purple/20 p-3 cursor-pointer hover:bg-crypto-purple/10 transition-colors">
            <RadioGroupItem value="bitcoin" id="bitcoin" className="border-crypto-purple-light text-crypto-purple" />
            <Label htmlFor="bitcoin" className="flex items-center cursor-pointer">
              <Bitcoin className="h-4 w-4 mr-2 text-crypto-purple-light" />
              <span>Bitcoin</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-lg border border-crypto-purple/20 p-3 cursor-pointer hover:bg-crypto-purple/10 transition-colors">
            <RadioGroupItem value="ethereum" id="ethereum" className="border-crypto-purple-light text-crypto-purple" />
            <Label htmlFor="ethereum" className="flex items-center cursor-pointer">
              <svg className="h-4 w-4 mr-2 text-crypto-purple-light" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              <span>Ethereum</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 rounded-lg border border-crypto-purple/20 p-3 cursor-pointer hover:bg-crypto-purple/10 transition-colors">
            <RadioGroupItem value="usdt" id="usdt" className="border-crypto-purple-light text-crypto-purple" />
            <Label htmlFor="usdt" className="flex items-center cursor-pointer">
              <span className="h-4 w-4 mr-2 text-crypto-purple-light font-bold text-xs">₮</span>
              <span>USDT (Tether)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10 hover:text-crypto-purple"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          className="bg-crypto-purple hover:bg-crypto-purple-light text-white"
        >
          Continue
        </Button>
      </div>
      
      <VerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default PaymentMethodSelection;
