
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CameraIcon, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { UserService } from "@/services/UserService";

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
  onSuccess: () => void;
  amount: number;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onBack,
  onSuccess,
  amount
}) => {
  const [cardType, setCardType] = useState<string>('');
  const [cardCode, setCardCode] = useState<string>('');
  const [cardImage, setCardImage] = useState<string | null>(null);
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

  const validateForm = (): boolean => {
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
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setError('');
    
    // Simulate AI processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          processGiftCard();
          return 100;
        }
        return prev + 2;
      });
    }, 600);
  };

  const processGiftCard = () => {
    try {
      // Create a new investment from the gift card
      const investment = UserService.addInvestment({
        amount,
        date: new Date(),
        status: 'pending',
        source: 'gift-card',
        cardDetails: {
          type: cardType,
          code: cardCode,
          imageUrl: cardImage || undefined
        }
      });
      
      onSuccess();
      resetForm();
      
    } catch (error) {
      toast({
        title: 'Processing Error',
        description: 'There was an error processing your gift card. Please try again.',
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
          
          <h3 className="text-xl font-medium text-white">Processing your gift card</h3>
          
          <p className="text-gray-300 text-sm">
            Please wait while our AI assistant verifies your gift card...
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

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Gift Card Type</Label>
          <Select value={cardType} onValueChange={setCardType}>
            <SelectTrigger className="border-crypto-purple/30 bg-crypto-black/40 text-white">
              <SelectValue placeholder="Select gift card type" />
            </SelectTrigger>
            <SelectContent className="bg-crypto-navy border-crypto-purple/30">
              {CARD_TYPES.map(card => (
                <SelectItem key={card.value} value={card.value} className="text-white">
                  {card.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          Submit Gift Card
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
