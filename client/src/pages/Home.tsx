import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "@/components/WalletModal";
import LuckyCatVideo from "@/components/LuckyCatVideo";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, walletProvider } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  
  const isConnected = !!user && !!walletProvider;

  useEffect(() => {
    if (isConnected) {
      setLocation("/dashboard");
    }
  }, [isConnected, setLocation]);

  const handleConnectWallet = () => {
    if (isConnected) {
      setLocation("/dashboard");
    } else {
      setWalletModalOpen(true);
    }
  };

  const handlePullComplete = () => {
    // No-op for home page
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
                — Unveil Your Fortunes at the Crypto Tea House
              </h1>
              <p className="text-xl text-light-300 leading-relaxed">
                Use your wallet to pull lucky fortunes, win crypto, and discover alpha.
              </p>
              <div className="pt-4">
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-8 py-4 rounded-xl shadow-lg text-lg wallet-button"
                  onClick={handleConnectWallet}
                >
                  {isConnected ? "Enter Tea House" : "Connect Wallet"}
                </Button>
                <p className="text-sm text-light-300 mt-2">
                  No purchase necessary. See{" "}
                  <Link href="/legal#terms" className="text-primary hover:underline">
                    Terms and Agreements
                  </Link>{" "}
                  for details.
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center relative">
              {/* Tea House Environment Background */}
              <div className="relative w-full max-w-lg h-[600px] bg-dark-800 rounded-2xl overflow-hidden shadow-2xl glow">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/70">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Lucky Cat Video */}
                    <div className="w-full h-full">
                      <LuckyCatVideo />
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
              Discover favor and prosperity in the world of crypto and support the community in the same unique experience.
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
