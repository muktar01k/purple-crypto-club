
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';

const SignupButton = () => {
  return (
    <Button 
      className="bg-crypto-purple hover:bg-crypto-purple-light text-white glow-border animate-pulse-glow"
    >
      <UserPlus size={16} className="mr-2" />
      Sign Up
    </Button>
  );
};

export default SignupButton;
