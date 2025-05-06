import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AgeVerification() {
  const [isVisible, setIsVisible] = useState(true);

  const handleYes = () => {
    setIsVisible(false);
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-w-4xl bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Lucky Cat Image */}
          <div className="w-full md:w-1/3 bg-accent/10 p-8 flex items-center justify-center">
            <img 
              src="/lucky-cat-18.png" 
              alt="Lucky Cat" 
              className="w-[27rem] h-[27rem] object-contain animate-float"
              style={{ animationDelay: "0.3s" }}
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Are You 18 or Older?
            </h2>
            
            <p className="text-foreground/80 mb-8 text-lg">
              This site contains prize-based games and digital rewards. You must be at least 18 years old to continue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleYes}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Yes, I'm 18+
              </Button>
              
              <Button 
                onClick={handleNo}
                variant="outline"
                className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              >
                No, Take Me Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 