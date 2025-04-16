
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

interface SignupButtonProps {
  onSignupSuccess?: (name: string) => void;
  isSignedUp?: boolean;
}

const SignupButton: React.FC<SignupButtonProps> = ({ 
  onSignupSuccess, 
  isSignedUp = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters."
    }),
    email: z.string().email({
      message: "Please enter a valid email address."
    })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Handle signup logic here
    console.log(values);
    
    // Show welcome message
    setShowWelcome(true);
    
    // Show toast notification
    toast({
      title: "Account created!",
      description: `Welcome to DIVO, ${values.name}!`
    });
    
    // Close dialog after 2 seconds and call the callback with the user's name
    setTimeout(() => {
      setIsOpen(false);
      
      // Call the onSignupSuccess callback with the user's name
      if (onSignupSuccess) {
        onSignupSuccess(values.name);
      }
      
      // Reset welcome state after closing
      setTimeout(() => setShowWelcome(false), 500);
    }, 2000);
  };

  // If user is already signed up, don't show the button
  if (isSignedUp) {
    return null;
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-crypto-purple hover:bg-crypto-purple-light text-white glow-border animate-pulse-glow"
      >
        <UserPlus size={16} className="mr-2" />
        Sign Up
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-crypto-purple/30">
          {!showWelcome ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">Join DIVO</DialogTitle>
                <DialogDescription>
                  Enter your details to create your account and start investing.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} className="bg-gray-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} className="bg-gray-800" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-crypto-purple hover:bg-crypto-purple-light"
                    >
                      Create Account
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome, {form.getValues().name}!</h2>
              <p className="text-gray-400">Your crypto journey begins now</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignupButton;
