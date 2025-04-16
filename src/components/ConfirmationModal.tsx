
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
import { CheckCircle2, Lock, Calendar } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-crypto-purple/20 bg-crypto-navy/80 text-white max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-crypto-purple" />
          </div>
          <DialogTitle className="text-gradient-purple text-2xl font-bold text-center">
            Investment Complete
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-center text-white">
            Your investment has been processed successfully. Welcome to the club!
          </p>
          
          <div className="bg-crypto-purple/10 p-4 rounded-lg border border-crypto-purple/20 flex items-start space-x-3">
            <Lock className="h-5 w-5 text-crypto-purple-light mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-crypto-purple-light flex items-center">
                <span>1-Month Investment Lock Period</span>
                <Calendar className="h-4 w-4 ml-1" />
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                Withdrawals are available only after 1 month of investment to ensure sustainable growth and reduce volatility.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 border-t border-crypto-purple/10 pt-4">
            <div>
              <p>Next withdrawal available:</p>
              <p className="text-white font-medium">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <p>Current APR:</p>
              <p className="text-green-400 font-medium">32% - 45%</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full bg-crypto-purple hover:bg-crypto-purple-light text-white"
          >
            Back to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
