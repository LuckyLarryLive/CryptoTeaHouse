import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "@/components/WalletModal";

export default function Home() {
  const [, navigate] = useLocation();
  const { connected } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  
  const handleConnectWallet = () => {
    if (connected) {
      navigate("/dashboard");
    } else {
      setWalletModalOpen(true);
    }
  };
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Fresh Tea Daily.<br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sip, Pull, Prosper
                </span>
                — Try Your Luck at the Crypto Tea House
              </h1>
              <p className="text-xl text-light-300 leading-relaxed">
                Use your wallet to pull lucky fortunes, win crypto, and discover alpha.
              </p>
              <div className="pt-4">
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-8 py-4 rounded-xl shadow-lg text-lg wallet-button"
                  onClick={handleConnectWallet}
                >
                  {connected ? "Enter Tea House" : "Connect Wallet"}
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center relative">
              {/* Tea House Environment Background */}
              <div className="relative w-full max-w-lg h-96 bg-dark-800 rounded-2xl overflow-hidden shadow-2xl glow">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/70">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    {/* Lucky Cat Animation */}
                    <div className="relative h-72 w-64">
                      <svg 
                        width="256" 
                        height="300" 
                        viewBox="0 0 256 300" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                      >
                        {/* Lucky Cat SVG */}
                        <g>
                          {/* Body */}
                          <path d="M128 240C171.019 240 206 205.019 206 162C206 118.981 171.019 84 128 84C84.981 84 50 118.981 50 162C50 205.019 84.981 240 128 240Z" fill="#F6F2EC" />
                          
                          {/* Face */}
                          <circle cx="128" cy="150" r="50" fill="#FFFFFF" />
                          <circle cx="108" cy="140" r="7" fill="#333333" />
                          <circle cx="148" cy="140" r="7" fill="#333333" />
                          <path d="M128 170C137.941 170 146 161.941 146 152H110C110 161.941 118.059 170 128 170Z" fill="#FF9E9E" />
                          
                          {/* Ears */}
                          <path d="M90 100C90 88.954 98.954 80 110 80H120C120 91.046 111.046 100 100 100H90Z" fill="#F6F2EC" />
                          <path d="M166 100C166 88.954 157.046 80 146 80H136C136 91.046 144.954 100 156 100H166Z" fill="#F6F2EC" />
                          
                          {/* Collar */}
                          <path d="M98 190H158V200C158 211.046 149.046 220 138 220H118C106.954 220 98 211.046 98 200V190Z" fill="#F5A623" />
                          <circle cx="128" cy="205" r="8" fill="#F6F2EC" />
                        </g>
                        
                        {/* Left Arm (static) */}
                        <path d="M100 160C89.954 160 80 150.046 80 140V120C80 114.477 84.477 110 90 110C95.523 110 100 114.477 100 120V140C100 145.523 95.523 150 90 150" fill="#F6F2EC" />
                        
                        {/* Right Arm (animated) */}
                        <g className="cat-paw animate-cat-paw">
                          <path d="M156 160C166.046 160 176 150.046 176 140V120C176 114.477 171.523 110 166 110C160.477 110 156 114.477 156 120V140C156 145.523 160.477 150 166 150" fill="#F6F2EC" />
                          <circle cx="166" cy="150" r="10" fill="#F6F2EC" />
                        </g>
                      </svg>
                      
                      {/* Cat's Paw Animation */}
                      <div className="absolute top-1/4 right-1/4 w-20 h-16 cat-paw animate-cat-paw">
                        {/* Cat's paw that moves up and down */}
                        <div className="h-full w-full rounded-full bg-accent/0"></div>
                      </div>
                      
                      {/* Tea Cup with Steam */}
                      <div className="absolute bottom-5 right-5">
                        <div className="relative w-16 h-16">
                          {/* Crypto-branded tea cup */}
                          <div className="absolute bottom-0 w-full h-8 bg-dark-700 rounded-b-full rounded-t-xl border-t border-accent"></div>
                          
                          {/* Steam Particles */}
                          <div className="absolute bottom-8 left-3 w-10 flex justify-around">
                            <div className="steam w-2 h-2 bg-light-300/40 rounded-full animate-steam" style={{ "--delay": "0" } as any}></div>
                            <div className="steam w-2 h-2 bg-light-300/40 rounded-full animate-steam" style={{ "--delay": "0.5" } as any}></div>
                            <div className="steam w-2 h-2 bg-light-300/40 rounded-full animate-steam" style={{ "--delay": "1" } as any}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating Crypto Coins */}
                      <div className="absolute top-1/3 left-4 animate-float" style={{ animationDelay: "0.3s" }}>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold">SOL</span>
                        </div>
                      </div>
                      <div className="absolute top-1/4 right-8 animate-float" style={{ animationDelay: "0.7s" }}>
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-xs font-bold">$</span>
                        </div>
                      </div>
                      <div className="absolute bottom-1/3 left-8 animate-float" style={{ animationDelay: "1.1s" }}>
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-xs font-bold">◎</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              Discover fortune and prosperity in the world of crypto with our unique luck-based experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-dark-700 p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center text-dark-900 font-bold text-2xl">1</div>
              <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
              <p className="text-light-300">
                Link your Solana wallet to authenticate and begin your journey at the Crypto Tea House.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-dark-700 p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-secondary to-secondary/50 rounded-full flex items-center justify-center text-dark-900 font-bold text-2xl">2</div>
              <h3 className="text-2xl font-bold mb-4">Pull on Lucky Cat</h3>
              <p className="text-light-300">
                Interact with our Lucky Cat by pulling its arm to receive fortune tickets and potential crypto rewards.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-dark-700 p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mb-6 bg-gradient-to-br from-accent to-accent/50 rounded-full flex items-center justify-center text-dark-900 font-bold text-2xl">3</div>
              <h3 className="text-2xl font-bold mb-4">Collect & Win</h3>
              <p className="text-light-300">
                Accumulate tickets for daily, weekly, monthly, and yearly drawings to win exclusive rewards and SOL prizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Winners Section (Shortened) */}
      <section id="winners" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recent Winners</h2>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              Fortune favors the brave. These lucky tea drinkers pulled their way to prosperity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Winner Card 1 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-light-300 mb-1">Wallet</div>
                  <div className="font-mono text-primary truncate w-36">9XrJ...S4Pc</div>
                </div>
                <div className="bg-accent/20 text-accent rounded-lg px-3 py-1 text-sm font-medium">
                  Daily Draw
                </div>
              </div>
            </div>
            
            {/* Winner Card 2 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-light-300 mb-1">Wallet</div>
                  <div className="font-mono text-secondary truncate w-36">HLt3...9jUs</div>
                </div>
                <div className="bg-secondary/20 text-secondary rounded-lg px-3 py-1 text-sm font-medium">
                  Weekly Draw
                </div>
              </div>
            </div>
            
            {/* Winner Card 3 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-light-300 mb-1">Wallet</div>
                  <div className="font-mono text-primary truncate w-36">6Kj2...rTy5</div>
                </div>
                <div className="bg-accent/20 text-accent rounded-lg px-3 py-1 text-sm font-medium">
                  Daily Draw
                </div>
              </div>
            </div>
            
            {/* Winner Card 4 */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-light-300 mb-1">Wallet</div>
                  <div className="font-mono text-primary truncate w-36">Lr56...8Hj2</div>
                </div>
                <div className="bg-primary/20 text-primary rounded-lg px-3 py-1 text-sm font-medium">
                  Monthly Draw
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/winners" className="inline-block border border-primary/50 text-primary hover:bg-primary/10 font-medium px-6 py-3 rounded-lg">
              View All Winners
            </Link>
          </div>
        </div>
      </section>

      {/* Wallet Modal */}
      {walletModalOpen && (
        <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      )}
    </div>
  );
}
