
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  CreditCard, 
  Bitcoin, 
  CircleDollarSign, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const [showCardForm, setShowCardForm] = useState(false);
  const [showCryptoAddress, setShowCryptoAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const cardFormSchema = z.object({
    cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(19),
    expiryDate: z.string().min(5, { message: "Please enter a valid expiry date (MM/YY)" }),
    cvc: z.string().min(3, { message: "CVC must be at least 3 digits" }).max(4),
    name: z.string().min(2, { message: "Cardholder name required" })
  });
  
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      name: ""
    }
  });
  
  const handleMethodSelect = (value: string) => {
    setShowCardForm(false);
    setShowCryptoAddress(false);
    setSelectedMethod(value as PaymentMethod);
  };
  
  const handleContinue = () => {
    if (selectedMethod === 'card') {
      setShowCardForm(true);
    } else if (['bitcoin', 'ethereum', 'usdt'].includes(selectedMethod)) {
      setIsLoading(true);
      // Simulate loading a crypto address
      setTimeout(() => {
        setIsLoading(false);
        setShowCryptoAddress(true);
      }, 2000);
    } else if (selectedMethod === 'paypal') {
      // Show PayPal account information
      setShowCryptoAddress(true);
    }
  };
  
  const handleCardSubmit = (values: z.infer<typeof cardFormSchema>) => {
    console.log("Card details:", values);
    setShowVerification(true);
  };
  
  const handleVerificationSuccess = () => {
    setShowVerification(false);
    onSuccess();
  };
  
  const getCryptoAddress = () => {
    switch (selectedMethod) {
      case 'bitcoin':
        return "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
      case 'ethereum':
        return "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      case 'usdt':
        return "TPxmRpRw8qMRKoFZY1aQWmYmQmTEPdWcmh";
      case 'paypal':
        return "payments@divo.com";
      default:
        return "";
    }
  };
  
  return (
    <>
      <div className="space-y-4 py-2">
        <div className="pb-2">
          <p className="text-center text-lg font-medium text-crypto-purple-light">${amount.toLocaleString()}</p>
        </div>
        
        {!showCardForm && !showCryptoAddress && (
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
        )}
        
        {showCardForm && (
          <Form {...cardForm}>
            <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-4">
              <FormField
                control={cardForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        className="bg-gray-800 border-crypto-purple/30" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={cardForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="MM/YY" 
                          className="bg-gray-800 border-crypto-purple/30" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={cardForm.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123" 
                          className="bg-gray-800 border-crypto-purple/30" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={cardForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Smith" 
                        className="bg-gray-800 border-crypto-purple/30" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between mt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowCardForm(false)}
                  className="border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-crypto-purple hover:bg-crypto-purple-light text-white"
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {isLoading && (
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10 text-crypto-purple-light mb-4" />
            <p className="text-sm text-gray-300">Generating {selectedMethod} address...</p>
          </div>
        )}
        
        {showCryptoAddress && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-2">
                {selectedMethod === 'paypal' 
                  ? 'Send payment to the following PayPal account:' 
                  : `Send ${amount.toFixed(2)} USD worth of ${selectedMethod.toUpperCase()} to:`}
              </p>
              <div className="bg-gray-800 p-3 rounded-lg border border-crypto-purple/30 break-all font-mono text-white">
                {getCryptoAddress()}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {selectedMethod === 'paypal'
                  ? 'After sending, click Continue to confirm your payment'
                  : 'Only send the exact amount. Transaction may take 10-30 minutes to confirm.'}
              </p>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCryptoAddress(false)}
                className="border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={onSuccess}
                className="bg-crypto-purple hover:bg-crypto-purple-light text-white"
              >
                {selectedMethod === 'paypal' ? 'I\'ve Sent the Payment' : 'I\'ve Made the Transfer'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {!showCardForm && !showCryptoAddress && !isLoading && (
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
      )}
      
      <VerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default PaymentMethodSelection;
