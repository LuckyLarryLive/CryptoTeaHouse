import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type PullResult = {
  type: string;
  details: {
    message: string;
    prize?: string;
    pullType: string;
  };
};

interface LuckyCatProps {
  onPullComplete: () => void;
}

export default function LuckyCat({ onPullComplete }: LuckyCatProps) {
  const { user } = useWallet();
  const { toast } = useToast();
  const [isPulling, setIsPulling] = useState(false);
  const [currentPull, setCurrentPull] = useState<string | null>(null);
  const [pullResult, setPullResult] = useState<PullResult | null>(null);
  const catPawRef = useRef<HTMLDivElement>(null);

  const handlePull = async (pullType: string) => {
    if (isPulling || !user?.id) return;

    setIsPulling(true);
    setCurrentPull(pullType);

    // Animate cat paw
    if (catPawRef.current) {
      catPawRef.current.style.animation = "none";
      setTimeout(() => {
        if (catPawRef.current) {
          catPawRef.current.style.animation = "catPaw 0.5s 3";
        }
      }, 10);
    }

    try {
      const response = await apiRequest("POST", "/api/pull", {
        userId: user.id,
        pullType
      });
      
      const result = await response.json();
      
      // Show result after animation
      setTimeout(() => {
        setPullResult(result);
        
        setTimeout(() => {
          setPullResult(null);
          setIsPulling(false);
          setCurrentPull(null);
          onPullComplete();
        }, 4000);
      }, 1500);
    } catch (error) {
      console.error("Pull error:", error);
      toast({
        title: "Error",
        description: "Failed to pull the cat's arm. Please try again.",
        variant: "destructive"
      });
      setIsPulling(false);
      setCurrentPull(null);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-dark-800 rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
      
      {/* Lucky Cat Animation */}
      <div className="flex flex-col items-center justify-center min-h-[400px] relative">
        <div className="relative h-80 w-80">
          <svg 
            width="320" 
            height="320" 
            viewBox="0 0 320 320" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Lucky Cat SVG */}
            <g>
              {/* Body */}
              <path d="M160 280C213.019 280 256 237.019 256 184C256 130.981 213.019 88 160 88C106.981 88 64 130.981 64 184C64 237.019 106.981 280 160 280Z" fill="#F6F2EC" />
              
              {/* Face */}
              <circle cx="160" cy="160" r="60" fill="#FFFFFF" />
              <path d="M140 150C143.866 150 147 146.866 147 143C147 139.134 143.866 136 140 136C136.134 136 133 139.134 133 143C133 146.866 136.134 150 140 150Z" fill="#333333" />
              <path d="M180 150C183.866 150 187 146.866 187 143C187 139.134 183.866 136 180 136C176.134 136 173 139.134 173 143C173 146.866 176.134 150 180 150Z" fill="#333333" />
              <path d="M160 180C171.046 180 180 171.046 180 160H140C140 171.046 148.954 180 160 180Z" fill="#FF9E9E" />
              
              {/* Ears */}
              <path d="M110 100C110 88.954 118.954 80 130 80H140C140 91.046 131.046 100 120 100H110Z" fill="#F6F2EC" />
              <path d="M210 100C210 88.954 201.046 80 190 80H180C180 91.046 188.954 100 200 100H210Z" fill="#F6F2EC" />
              
              {/* Collar */}
              <path d="M120 200H200V210C200 221.046 191.046 230 180 230H140C128.954 230 120 221.046 120 210V200Z" fill="#F5A623" />
              <circle cx="160" cy="215" r="10" fill="#F6F2EC" />
            </g>
            
            {/* Left Arm (static) */}
            <path d="M120 170C109.954 170 100 160.046 100 150V130C100 124.477 104.477 120 110 120C115.523 120 120 124.477 120 130V150C120 155.523 115.523 160 110 160" fill="#F6F2EC" />
            
            {/* Right Arm (animated) */}
            <motion.g 
              ref={catPawRef} 
              className="cat-paw"
              animate={isPulling ? { rotate: [0, 20, 0, 20, 0] } : {}}
              transition={{ duration: 1.5, repeat: isPulling ? 2 : 0 }}
            >
              <path d="M200 170C210.046 170 220 160.046 220 150V130C220 124.477 215.523 120 210 120C204.477 120 200 124.477 200 130V150C200 155.523 204.477 160 210 160" fill="#F6F2EC" />
              <circle cx="210" cy="160" r="10" fill="#F6F2EC" />
            </motion.g>
            
            {/* Fortune coin */}
            <motion.g
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "center" }}
            >
              <circle cx="240" cy="150" r="20" fill="#F5A623" />
              <text x="240" y="155" fontSize="16" fill="#333" textAnchor="middle">SOL</text>
            </motion.g>
          </svg>
          
          {/* Steam from teacup */}
          <div className="absolute bottom-12 right-5">
            <div className="relative w-16 h-16">
              <div className="absolute bottom-0 w-full h-8 bg-dark-700 rounded-b-full rounded-t-xl border-t border-accent"></div>
              <div className="absolute bottom-8 left-3 w-10 flex justify-around">
                <div className="steam w-2 h-2 bg-light-300/40 rounded-full animate-steam" style={{ "--delay": "0" } as any}></div>
                <div className="steam w-2 h-2 bg-light-300/40 rounded-full animate-steam" style={{ "--delay": "0.5" } as any}></div>
                <div className="steam w-2 h-2 bg-light-300/40 rounded-full animate-steam" style={{ "--delay": "1" } as any}></div>
              </div>
            </div>
          </div>
          
          {/* Floating Crypto Coins */}
          <div className="absolute top-1/3 left-0 animate-float" style={{ animationDelay: "0.3s" }}>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-bold">SOL</span>
            </div>
          </div>
          <div className="absolute top-1/4 right-0 animate-float" style={{ animationDelay: "0.7s" }}>
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-sm font-bold">$</span>
            </div>
          </div>
          <div className="absolute bottom-1/3 left-4 animate-float" style={{ animationDelay: "1.1s" }}>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-bold">◎</span>
            </div>
          </div>
        </div>
        
        {/* Pull Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            className="bg-primary hover:bg-primary/90 text-dark-900 font-medium px-6 py-6 rounded-lg shadow-lg transition-all hover:shadow-primary/30 hover:-translate-y-1"
            onClick={() => handlePull("daily")}
            disabled={isPulling}
            variant="default"
            size="lg"
          >
            Daily Pull
          </Button>
          <Button
            className="bg-secondary hover:bg-secondary/90 text-dark-900 font-medium px-6 py-6 rounded-lg shadow-lg transition-all hover:shadow-secondary/30 hover:-translate-y-1"
            onClick={() => handlePull("weekly")}
            disabled={isPulling}
            variant="default"
            size="lg"
          >
            Weekly Pull
          </Button>
          <Button
            className="bg-accent hover:bg-accent/90 text-dark-900 font-medium px-6 py-6 rounded-lg shadow-lg transition-all hover:shadow-accent/30 hover:-translate-y-1"
            onClick={() => handlePull("monthly")}
            disabled={isPulling}
            variant="default"
            size="lg"
          >
            Monthly Pull
          </Button>
        </div>
      </div>
      
      {/* Fortune Result Modal */}
      <AnimatePresence>
        {pullResult && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-dark-800/90 backdrop-blur-sm absolute inset-0"></div>
            <motion.div 
              className="bg-dark-700 p-6 rounded-xl border border-primary relative z-50 transform max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${pullResult.type === 'reward' ? 'bg-primary/20' : 'bg-secondary/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {pullResult.type === 'reward' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                {pullResult.type === 'reward' ? (
                  <p className="text-xl mb-4">You won <span className="text-primary font-bold">{pullResult.details.prize} SOL</span></p>
                ) : (
                  <p className="text-xl mb-4">You earned a <span className="text-secondary font-bold">{pullResult.details.pullType}</span> ticket!</p>
                )}
                <p className="text-light-300 mb-6">
                  Your fortune: "Great opportunities come to those who seek financial wisdom."
                </p>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary text-dark-900 font-semibold px-6 py-6 rounded-lg"
                  onClick={() => setPullResult(null)}
                >
                  {pullResult.type === 'reward' ? 'Claim Reward' : 'Continue'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
