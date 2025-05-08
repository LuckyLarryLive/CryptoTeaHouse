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
  const catPawRef = useRef<SVGGElement>(null);

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
    <div className="w-full max-w-2xl bg-dark-800/80 rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden border border-amber-800/20">
      {/* Tea House Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMjRjLTEuMiAwLTIuMS0uOS0yLjEtMi4xVjIwLjFjMC0xLjIuOS0yLjEgMi4xLTIuMWgxMnptMCAyLjFIMjR2MTkuOGgxMlYyMC4xeiIgZmlsbD0icmdiYSgxNzAsIDEyMCwgNjAsIDAuMikiLz48Y2lyY2xlIHN0cm9rZT0icmdiYSgxNzAsIDEyMCwgNjAsIDAuMikiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjMwIiBjeT0iMzAiIHI9IjE1Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-700/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-700/5 rounded-full blur-3xl"></div>
      
      {/* Wooden Sign for Tea House */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-72 h-14 bg-[#8B4513] rounded-lg border-2 border-[#5D2906] shadow-lg z-10 flex items-center justify-center">
        <span className="text-amber-100 text-xl font-bold tracking-wider">Crypto Tea House</span>
        <div className="absolute -left-3 top-5 w-6 h-6 bg-[#5D2906] rounded-full"></div>
        <div className="absolute -right-3 top-5 w-6 h-6 bg-[#5D2906] rounded-full"></div>
      </div>
      
      {/* Lucky Cat Animation with Traditional Style */}
      <div className="flex flex-col items-center justify-center min-h-[400px] relative mt-8">
        <div className="relative h-80 w-80">
          <svg 
            width="320" 
            height="320" 
            viewBox="0 0 320 320" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Lucky Cat SVG - Updated with more traditional style */}
            <g>
              {/* Body - More rounded and traditional shape */}
              <path d="M160 280C213.019 280 256 237.019 256 184C256 130.981 213.019 88 160 88C106.981 88 64 130.981 64 184C64 237.019 106.981 280 160 280Z" fill="#F0E4D8" />
              
              {/* Face - More traditional proportions */}
              <circle cx="160" cy="160" r="70" fill="#FFFFFF" />
              
              {/* Eyes - More traditional style */}
              <path d="M130 140C135.523 140 140 135.523 140 130C140 124.477 135.523 120 130 120C124.477 120 120 124.477 120 130C120 135.523 124.477 140 130 140Z" fill="#333333" />
              <path d="M190 140C195.523 140 200 135.523 200 130C200 124.477 195.523 120 190 120C184.477 120 180 124.477 180 130C180 135.523 184.477 140 190 140Z" fill="#333333" />
              
              {/* Nose and Mouth - More traditional style */}
              <path d="M160 150C165.523 150 170 145.523 170 140C170 134.477 165.523 130 160 130C154.477 130 150 134.477 150 140C150 145.523 154.477 150 160 150Z" fill="#FF9E9E" />
              <path d="M160 160C171.046 160 180 151.046 180 140H140C140 151.046 148.954 160 160 160Z" fill="#FF9E9E" />
              
              {/* Whiskers - More pronounced */}
              <path d="M110 150L85 145" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M110 160L80 165" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M210 150L235 145" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M210 160L240 165" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Traditional patterns on body */}
              <path d="M160 260C170 260 178 252 178 242C178 232 170 224 160 224C150 224 142 232 142 242C142 252 150 260 160 260Z" fill="#D6001C" />
              <path d="M160 250C164.418 250 168 246.418 168 242C168 237.582 164.418 234 160 234C155.582 234 152 237.582 152 242C152 246.418 155.582 250 160 250Z" fill="#D6001C" />
              
              {/* Ears - More traditional style */}
              <path d="M110 100C110 88.954 118.954 80 130 80H140C140 91.046 131.046 100 120 100H110Z" fill="#F0E4D8" />
              <path d="M210 100C210 88.954 201.046 80 190 80H180C180 91.046 188.954 100 200 100H210Z" fill="#F0E4D8" />
              <path d="M115 95C115 90 120 85 125 85" stroke="#D6001C" strokeWidth="2.5" />
              <path d="M205 95C205 90 200 85 195 85" stroke="#D6001C" strokeWidth="2.5" />
              
              {/* Traditional Collar with Bell */}
              <path d="M120 200H200V210C200 221.046 191.046 230 180 230H140C128.954 230 120 221.046 120 210V200Z" fill="#D6001C" />
              <circle cx="160" cy="215" r="12" fill="#F8D56F" stroke="#AA8133" strokeWidth="1.5" />
              <circle cx="160" cy="215" r="5" fill="#AA8133" />
              <path d="M156 211L164 219" stroke="#AA8133" strokeWidth="1.5" />
              <path d="M164 211L156 219" stroke="#AA8133" strokeWidth="1.5" />
            </g>
            
            {/* Left Arm (static) */}
            <path d="M120 170C109.954 170 100 160.046 100 150V130C100 124.477 104.477 120 110 120C115.523 120 120 124.477 120 130V150C120 155.523 115.523 160 110 160" fill="#F0E4D8" />
            
            {/* Right Arm (animated) with improved animation */}
            <motion.g 
              ref={catPawRef} 
              className="cat-paw"
              animate={isPulling ? 
                { rotate: [0, 30, -10, 25, -15, 20, 0], x: [0, 3, -2, 3, -3, 2, 0] } : 
                { rotate: 0 }
              }
              transition={{ 
                duration: isPulling ? 1.5 : 0.5,
                ease: isPulling ? "easeInOut" : "easeOut",
                times: isPulling ? [0, 0.2, 0.35, 0.5, 0.7, 0.85, 1] : [0, 1]
              }}
              style={{ originX: 0.6, originY: 0.9 }}
            >
              <path d="M200 170C210.046 170 220 160.046 220 150V130C220 124.477 215.523 120 210 120C204.477 120 200 124.477 200 130V150C200 155.523 204.477 160 210 160" fill="#F0E4D8" />
              <circle cx="210" cy="160" r="12" fill="#F0E4D8" />
            </motion.g>
            
            {/* Fortune coin with improved styling */}
            <motion.g
              animate={{ y: [0, -15, 0], rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "center" }}
            >
              <circle cx="240" cy="150" r="22" fill="#F8D56F" stroke="#AA8133" strokeWidth="2.5" />
              <text x="240" y="155" fontSize="18" fontWeight="bold" fill="#5D4037" textAnchor="middle">福</text>
            </motion.g>
          </svg>
          
          {/* Traditional Tea Pot and Cup */}
          <div className="absolute bottom-2 right-2">
            <div className="relative w-24 h-20">
              {/* Teapot */}
              <div className="absolute bottom-0 right-0 w-16 h-10 bg-gradient-to-r from-amber-900 to-amber-700 rounded-b-full rounded-t-xl border-t border-amber-500"></div>
              <div className="absolute bottom-10 right-4 w-8 h-6 bg-gradient-to-r from-amber-900 to-amber-700 rounded-t-lg"></div>
              <div className="absolute bottom-4 right-16 w-8 h-6 bg-gradient-to-r from-amber-900 to-amber-700 rounded-full"></div>
              
              {/* Teacup */}
              <div className="absolute bottom-0 left-0 w-10 h-5 bg-amber-100/90 border border-amber-900/50 rounded-full"></div>
              <div className="absolute bottom-5 left-1 w-8 h-5 bg-amber-100/90 border border-amber-900/50 rounded-md rounded-b-none"></div>
              
              {/* Steam */}
              <div className="absolute bottom-10 left-1 w-8 flex justify-around">
                <div className="steam w-1.5 h-1.5 bg-white/60 rounded-full animate-steam" style={{ "--delay": "0" } as any}></div>
                <div className="steam w-1.5 h-1.5 bg-white/60 rounded-full animate-steam" style={{ "--delay": "0.4" } as any}></div>
                <div className="steam w-1.5 h-1.5 bg-white/60 rounded-full animate-steam" style={{ "--delay": "0.8" } as any}></div>
              </div>
            </div>
          </div>
          
          {/* Floating Lucky Coins and elements with traditional style */}
          <div className="absolute top-1/3 left-0 animate-float" style={{ animationDelay: "0.3s" }}>
            <div className="w-12 h-12 rounded-full bg-[#F8D56F] border-2 border-[#AA8133] flex items-center justify-center">
              <span className="text-amber-900 text-sm font-bold">福</span>
            </div>
          </div>
          <div className="absolute top-1/4 right-0 animate-float" style={{ animationDelay: "0.7s" }}>
            <div className="w-10 h-10 rounded-full bg-[#F8D56F] border-2 border-[#AA8133] flex items-center justify-center">
              <span className="text-amber-900 text-sm font-bold">运</span>
            </div>
          </div>
          <div className="absolute bottom-1/3 left-4 animate-float" style={{ animationDelay: "1.1s" }}>
            <div className="w-10 h-10 rounded-full bg-[#F8D56F] border-2 border-[#AA8133] flex items-center justify-center">
              <span className="text-amber-900 text-sm font-bold">财</span>
            </div>
          </div>
        </div>
        
        {/* Pull Buttons with more tea-house styling */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            className="bg-[#8B4513] hover:bg-[#6b3000] text-amber-100 font-medium px-6 py-5 rounded-lg border border-amber-900/30 shadow-lg transition-all hover:-translate-y-1"
            onClick={() => handlePull("daily")}
            disabled={isPulling}
            variant="default"
            size="lg"
          >
            🍵 Daily Pull
          </Button>
          <Button
            className="bg-[#D6001C] hover:bg-[#b10018] text-amber-100 font-medium px-6 py-5 rounded-lg border border-amber-900/30 shadow-lg transition-all hover:-translate-y-1"
            onClick={() => handlePull("weekly")}
            disabled={isPulling}
            variant="default"
            size="lg"
          >
            🏮 Weekly Pull
          </Button>
          <Button
            className="bg-[#F8D56F] hover:bg-[#e6c45c] text-amber-900 font-medium px-6 py-5 rounded-lg border border-amber-900/30 shadow-lg transition-all hover:-translate-y-1"
            onClick={() => handlePull("monthly")}
            disabled={isPulling}
            variant="default"
            size="lg"
          >
            💰 Monthly Pull
          </Button>
        </div>
      </div>
      
      {/* Fortune Result Modal with traditional styling */}
      <AnimatePresence>
        {pullResult && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-dark-800/90 backdrop-blur-md absolute inset-0"></div>
            <motion.div 
              className="bg-amber-100 p-6 rounded-xl border-4 border-[#8B4513] relative z-50 transform max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMjRjLTEuMiAwLTIuMS0uOS0yLjEtMi4xVjIwLjFjMC0xLjIuOS0yLjEgMi4xLTIuMWgxMnptMCAyLjFIMjR2MTkuOGgxMlYyMC4xeiIgZmlsbD0icmdiYSgxMDAsIDUwLCAwLCAwLjA1KSIvPjxjaXJjbGUgc3Ryb2tlPSJyZ2JhKDEwMCwgNTAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiIGN4PSIzMCIgY3k9IjMwIiByPSIxNSIvPjwvZz48L3N2Zz4=')] opacity-20 rounded-lg"></div>
              <div className="text-center relative z-10">
                <div className={`w-16 h-16 ${pullResult.type === 'reward' ? 'bg-[#D6001C]/20' : 'bg-[#8B4513]/20'} rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${pullResult.type === 'reward' ? 'border-[#D6001C]' : 'border-[#8B4513]'}`}>
                  {pullResult.type === 'reward' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D6001C]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8B4513]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-amber-900">Fortune Smiles Upon You!</h3>
                {pullResult.type === 'reward' ? (
                  <p className="text-xl mb-4 text-amber-900">You won <span className="text-[#D6001C] font-bold">{pullResult.details.prize} SOL</span></p>
                ) : (
                  <p className="text-xl mb-4 text-amber-900">You earned a <span className="text-[#8B4513] font-bold">{pullResult.details.pullType}</span> ticket!</p>
                )}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
                  <p className="text-amber-800 italic">
                    "The wise investor sees opportunity in every market. Patience and wisdom will lead to prosperity."
                  </p>
                </div>
                <Button 
                  className="bg-gradient-to-r from-[#8B4513] to-[#D6001C] text-amber-100 font-semibold px-6 py-4 rounded-lg border border-amber-900/30"
                  onClick={() => setPullResult(null)}
                >
                  {pullResult.type === 'reward' ? '🧧 Claim Reward' : '🍵 Continue'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
