
import React, { useState, useEffect } from 'react';
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
import { Loader2 } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [code, setCode] = useState<string>('');
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [verificationStep, setVerificationStep] = useState<'processing' | 'verify'>('processing');
  
  // Simulate verification code being sent
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
        setVerificationStep('verify');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCode(value);
    if (error) setError('');
  };
  
  const handleVerify = () => {
    if (code.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    
    // For demo purposes, any 6-digit code works
    if (code.length === 6) {
      onSuccess();
    } else {
      setError('Invalid verification code');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-crypto-purple/20 bg-crypto-navy/80 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient-purple text-2xl font-bold">
            {isWaiting ? 'Processing Payment' : 'Card Verification'}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {isWaiting 
              ? 'Waiting for verification code to be sent...' 
              : 'Please enter the verification code sent to your device'}
          </DialogDescription>
        </DialogHeader>
        
        {verificationStep === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-crypto-purple-light border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-300 mt-4">Contacting your bank...</p>
          </div>
        )}
        
        {verificationStep === 'verify' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="border-crypto-purple/30 bg-crypto-black/40 text-white text-center text-xl tracking-widest"
                />
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>
              
              <p className="text-xs text-gray-400 mt-2">
                Your bank has sent a verification code to your registered mobile device for security purposes.
              </p>
            </div>
          </div>
        )}
        
        {verificationStep === 'verify' && (
          <DialogFooter>
            <Button 
              onClick={handleVerify}
              className="w-full bg-crypto-purple hover:bg-crypto-purple-light text-white"
              disabled={code.length < 6}
            >
              Verify & Complete Payment
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
