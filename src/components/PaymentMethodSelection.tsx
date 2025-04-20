import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CameraIcon, Check, Loader2, CircleCheck, CircleX, Bitcoin, CreditCard, Paypal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserService, Investment } from "@/services/UserService";

const CARD_TYPES = [
  { value: 'amazon', label: 'Amazon Gift Card' },
  { value: 'steam', label: 'Steam Wallet Code' },
  { value: 'apple', label: 'Apple App Store' },
  { value: 'google', label: 'Google Play' },
  { value: 'visa', label: 'Visa Gift Card' },
  { value: 'mastercard', label: 'Mastercard Gift Card' },
  { value: 'walmart', label: 'Walmart Gift Card' },
  { value: 'target', label: 'Target Gift Card' },
  { value: 'ebay', label: 'eBay Gift Card' },
];

interface PaymentMethodSelectionProps {
  onBack: () => void;
  onSuccess: (investment: Investment) => void;
  amount: number;
  paymentMethod: 'gift-card' | 'go-cash' | 'bitcoin' | 'paypal';
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onBack,
  onSuccess,
  amount,
  paymentMethod
}) => {
  const [cardType, setCardType] = useState<string>('');
  const [cardCode, setCardCode] = useState<string>('');
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [bitcoinAddress, setBitcoinAddress] = useState<string>('bc1q8z7g5s72xzvdxqy2ythm8vk9j6wy4pjlfm3yye');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);

  const resetForm = () => {
    setCardType('');
    setCardCode('');
    setCardImage(null);
    setError('');
    setProcessingProgress(0);
    setIsProcessing(false);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setCardImage(reader.result as string);
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: 'Camera Error',
        description: 'Could not access your camera. Please check permissions.',
        variant: 'destructive'
      });
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCardImage(canvas.toDataURL('image/jpeg'));
        
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
        }
        setIsCameraOpen(false);
      }
    }
  };

  const validateGiftCardForm = (): boolean => {
    if (!cardType) {
      setError('Please select a gift card type');
      return false;
    }
    
    if (!cardCode || cardCode.length < 5) {
      setError('Please enter a valid gift card code');
      return false;
    }
    
    if (!cardImage) {
      setError('Please upload or take a photo of your gift card');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (paymentMethod === 'gift-card' && !validateGiftCardForm()) return;
    
    setIsProcessing(true);
    setError('');
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          processPayment();
          return 100;
        }
        return prev + 2;
      });
    }, 600);
  };

  const processPayment = () => {
    try {
      const investment = UserService.addInvestment({
        amount,
        date: new Date(),
        status: 'pending',
        source: paymentMethod,
        cardDetails: paymentMethod === 'gift-card' ? {
          type: cardType,
          code: cardCode,
          imageUrl: cardImage || undefined
        } : undefined
      });
      
      onSuccess(investment);
      resetForm();
      
    } catch (error) {
      toast({
        title: 'Processing Error',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="py-8 px-4">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-crypto-purple animate-pulse">
            <Loader2 size={48} className="animate-spin" />
          </div>
          
          <h3 className="text-xl font-medium text-white">
            {paymentMethod === 'gift-card' ? 'Processing your gift card' : 
             paymentMethod === 'bitcoin' ? 'Processing your Bitcoin payment' :
             paymentMethod === 'paypal' ? 'Processing your PayPal payment' :
             'Processing your GoCash payment'}
          </h3>
          
          <p className="text-gray-300 text-sm">
            Please wait while our AI assistant verifies your payment...
          </p>
          
          <div className="w-full">
            <div className="h-2 bg-crypto-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-crypto-purple transition-all duration-500 ease-out"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{processingProgress}%</p>
          </div>
        </div>
      </div>
    );
  }

  const renderGiftCardForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Gift Card Type</Label>
        <select 
          value={cardType} 
          onChange={(e) => setCardType(e.target.value)}
          className="w-full border-crypto-purple/30 bg-crypto-black/40 text-white rounded-md p-2"
        >
          <option value="">Select gift card type</option>
          {CARD_TYPES.map(card => (
            <option key={card.value} value={card.value}>{card.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Gift Card Code</Label>
        <Input
          value={cardCode}
          onChange={(e) => setCardCode(e.target.value)}
          placeholder="Enter the gift card code"
          className="border-crypto-purple/30 bg-crypto-black/40 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Gift Card Image</Label>
        
        {!cardImage && !isCameraOpen ? (
          <div className="flex gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1 border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
            >
              Upload Image
            </Button>
            
            <Button
              onClick={startCamera}
              variant="outline"
              className="flex-1 border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
            >
              <CameraIcon size={16} className="mr-2" />
              Take Photo
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : null}
        
        {isCameraOpen && (
          <div className="relative rounded-md overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center bg-black/50">
              <Button
                onClick={capturePhoto}
                className="bg-crypto-purple hover:bg-crypto-purple-light"
              >
                Capture
              </Button>
            </div>
          </div>
        )}
        
        {cardImage && (
          <div className="relative">
            <img
              src={cardImage}
              alt="Gift Card"
              className="w-full h-48 object-contain rounded-md border border-crypto-purple/30"
            />
            <Button
              onClick={() => setCardImage(null)}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 border-crypto-purple/30 bg-black/50 text-white hover:bg-black/70"
            >
              Change
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderBitcoinForm = () => (
    <div className="space-y-4">
      <div className="p-4 bg-crypto-purple/10 rounded-lg border border-crypto-purple/20 flex flex-col items-center">
        <p className="text-sm text-gray-300 mb-3">Send exactly <span className="font-bold text-white">${amount}</span> worth of BTC to:</p>
        <div className="p-3 bg-white rounded-lg w-full text-center mb-2">
          <p className="text-xs text-crypto-black font-mono break-all">{bitcoinAddress}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
          onClick={() => {
            navigator.clipboard.writeText(bitcoinAddress);
            toast({
              title: "Address Copied",
              description: "Bitcoin address copied to clipboard"
            });
          }}
        >
          Copy Address
        </Button>
      </div>
      
      <div className="rounded-lg border border-crypto-purple/20 p-4">
        <h4 className="text-sm font-medium text-white mb-2">Payment Instructions:</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li className="flex items-start">
            <span className="mr-2 text-crypto-purple mt-0.5">1.</span>
            <span>Send the exact amount using your wallet of choice</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-crypto-purple mt-0.5">2.</span>
            <span>Wait for blockchain confirmation (usually 10-30 minutes)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-crypto-purple mt-0.5">3.</span>
            <span>Click "I've Sent Bitcoin" below once payment is complete</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderPayPalForm = () => (
    <div className="space-y-4">
      <div className="p-6 border border-crypto-purple/20 rounded-lg bg-crypto-purple/10 flex flex-col items-center justify-center">
        <Paypal className="h-12 w-12 text-crypto-purple mb-3" />
        <p className="text-sm text-gray-300 text-center">
          You'll be redirected to PayPal to complete your payment of <span className="font-bold text-white">${amount}</span>
        </p>
      </div>
      
      <div className="text-xs text-gray-400">
        <p>• Secure payment processing via PayPal</p>
        <p>• Investment will be credited immediately after payment</p>
        <p>• No additional fees for PayPal transactions</p>
      </div>
    </div>
  );

  const renderGoCashForm = () => (
    <div className="space-y-4">
      <div className="p-6 border border-crypto-purple/20 rounded-lg bg-crypto-purple/10 flex flex-col items-center justify-center">
        <CircleDollarSign className="h-12 w-12 text-crypto-purple mb-3" />
        <p className="text-lg font-bold text-white">${amount}</p>
        <p className="text-sm text-gray-300 text-center">
          Use your GoCash balance to complete this payment
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">GoCash Balance:</span>
        <span className="text-white font-medium">${(amount * 1.5).toFixed(2)}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">After Payment:</span>
        <span className="text-white font-medium">${(amount * 0.5).toFixed(2)}</span>
      </div>
      
      <div className="text-xs text-gray-400 flex items-center mt-3">
        <CircleCheck className="text-green-400 h-4 w-4 mr-1" />
        Sufficient balance for this payment
      </div>
    </div>
  );

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        {paymentMethod === 'gift-card' && renderGiftCardForm()}
        {paymentMethod === 'bitcoin' && renderBitcoinForm()}
        {paymentMethod === 'paypal' && renderPayPalForm()}
        {paymentMethod === 'go-cash' && renderGoCashForm()}

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleSubmit}
          className="bg-crypto-purple hover:bg-crypto-purple-light text-white"
        >
          {paymentMethod === 'gift-card' ? 'Submit Gift Card' : 
           paymentMethod === 'bitcoin' ? 'I\'ve Sent Bitcoin' :
           paymentMethod === 'paypal' ? 'Continue to PayPal' :
           'Pay with GoCash'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
