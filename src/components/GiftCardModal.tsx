
import React, { useState, useRef } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Gift, CameraIcon, Check, Loader } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { UserService, Investment } from "@/services/UserService";

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (investment: Investment) => void;
}

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

const GiftCardModal: React.FC<GiftCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'confirmation'>('form');
  const [cardType, setCardType] = useState<string>('');
  const [cardCode, setCardCode] = useState<string>('');
  const [cardImage, setCardImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const resetForm = () => {
    setCardType('');
    setCardCode('');
    setCardImage(null);
    setError('');
    setStep('form');
    setProcessingProgress(0);
    
    // Stop camera if open
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
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
        
        // Stop the camera stream
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
    
    setStep('processing');
    
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
        amount: Math.floor(Math.random() * 200) + 50, // Random amount between $50 and $250
        date: new Date(),
        status: 'pending',
        source: 'gift-card',
        cardDetails: {
          type: cardType,
          code: cardCode,
          imageUrl: cardImage || undefined
        }
      });
      
      // Show confirmation step
      setStep('confirmation');
      
      // After 2 seconds, close and call success
      setTimeout(() => {
        onSuccess(investment);
        handleClose();
      }, 2000);
      
    } catch (error) {
      toast({
        title: 'Processing Error',
        description: 'There was an error processing your gift card. Please try again.',
        variant: 'destructive'
      });
      setStep('form');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-crypto-purple/20 bg-crypto-navy/80 text-white max-w-md sm:max-w-lg">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-gradient-purple text-2xl font-bold flex items-center">
                <Gift size={20} className="mr-2" />
                Add Gift Card
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Enter your gift card details to add funds to your account
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              {/* Card Type */}
              <div className="space-y-2">
                <Label htmlFor="card-type" className="text-sm text-gray-300">Gift Card Type</Label>
                <Select value={cardType} onValueChange={setCardType}>
                  <SelectTrigger id="card-type" className="border-crypto-purple/30 bg-crypto-black/40 text-white">
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
              
              {/* Card Code */}
              <div className="space-y-2">
                <Label htmlFor="card-code" className="text-sm text-gray-300">Gift Card Code</Label>
                <Input
                  id="card-code"
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                  placeholder="Enter the gift card code"
                  className="border-crypto-purple/30 bg-crypto-black/40 text-white"
                />
              </div>
              
              {/* Card Image */}
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
            
            <DialogFooter>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-crypto-purple hover:bg-crypto-purple-light text-white"
              >
                Submit Gift Card
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === 'processing' && (
          <div className="py-8 px-4">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="text-crypto-purple animate-pulse">
                <Loader size={48} className="animate-spin" />
              </div>
              
              <h3 className="text-xl font-medium text-white">Processing your gift card</h3>
              
              <p className="text-gray-300 text-sm">
                Please wait while our AI assistant verifies your gift card...
              </p>
              
              <div className="w-full">
                <Progress value={processingProgress} className="h-2 bg-crypto-black/40" />
                <p className="text-right text-xs text-gray-400 mt-1">{processingProgress}%</p>
              </div>
            </div>
          </div>
        )}
        
        {step === 'confirmation' && (
          <div className="py-8 px-4">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check size={32} className="text-green-500" />
              </div>
              
              <h3 className="text-xl font-medium text-white">Gift Card Accepted!</h3>
              
              <p className="text-gray-300 text-sm">
                Your gift card has been processed successfully. Your funds are now in a pending state and will be available soon.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GiftCardModal;
