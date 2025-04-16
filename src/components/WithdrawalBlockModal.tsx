
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Clock, Calendar } from "lucide-react";

interface WithdrawalBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockDate: Date;
}

const WithdrawalBlockModal: React.FC<WithdrawalBlockModalProps> = ({
  isOpen,
  onClose,
  unlockDate
}) => {
  const daysRemaining = Math.ceil((unlockDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-crypto-purple/20 bg-crypto-navy/80 text-white max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Lock className="h-16 w-16 text-crypto-purple" />
          </div>
          <DialogTitle className="text-gradient-purple text-2xl font-bold text-center">
            Hold Up!
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center">
            Your investment is still in the growth phase
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-center text-white">
            You can only withdraw when your investment completes a 1-month cycle. Stay patient, big wins take time.
          </p>
          
          <div className="bg-crypto-purple/10 p-4 rounded-lg border border-crypto-purple/20">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-crypto-purple-light mr-2" />
                <span className="text-sm font-medium text-crypto-purple-light">Time Remaining</span>
              </div>
              <span className="text-white font-bold">{daysRemaining} days</span>
            </div>
            
            <div className="w-full bg-crypto-black/40 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-crypto-purple to-crypto-purple-light h-2 rounded-full" 
                style={{ width: `${(30 - daysRemaining) / 30 * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-crypto-purple-light mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-crypto-purple-light">
                Funds Unlock Date
              </h4>
              <p className="text-white font-medium">
                {unlockDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                This mandatory holding period helps our AI trading algorithms maximize returns and reduces market volatility.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full bg-crypto-purple hover:bg-crypto-purple-light text-white"
          >
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalBlockModal;
