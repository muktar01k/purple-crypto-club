
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Share2, X } from 'lucide-react';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="flex flex-col gap-2 mb-4 animate-fade-in">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-crypto-navy border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
            onClick={() => {
              alert("Help requested");
              setIsOpen(false);
            }}
          >
            <Edit className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-full bg-crypto-navy border-crypto-purple/30 text-crypto-purple-light hover:bg-crypto-purple/10"
            onClick={() => {
              alert("Refer a friend");
              setIsOpen(false);
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <Button 
        size="icon" 
        className={`w-14 h-14 rounded-full bg-crypto-purple hover:bg-crypto-purple-light shadow-lg transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Edit className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
