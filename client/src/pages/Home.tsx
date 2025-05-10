import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "@/components/WalletModal";
import LuckyCatVideo from "@/components/LuckyCatVideo";

export default function Home() {
  const { user } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const handleConnectWallet = () => {
    setWalletModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LuckyCatVideo />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Crypto Tea House
          </h1>
          <p className="text-xl md:text-2xl text-light-300 mb-8 max-w-2xl mx-auto">
            Pull the lucky cat's arm and win SOL prizes! Join our community of tea enthusiasts and crypto lovers.
          </p>
          <Button 
            onClick={handleConnectWallet}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-8 py-6 text-lg"
          >
            Connect Wallet to Start
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-dark-800/50">
            <h3 className="text-xl font-semibold mb-4 text-primary">Daily Pulls</h3>
            <p className="text-light-300">Pull the lucky cat's arm daily for a chance to win SOL prizes!</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-dark-800/50">
            <h3 className="text-xl font-semibold mb-4 text-primary">Weekly Draws</h3>
            <p className="text-light-300">Collect tickets for bigger weekly draws with larger prizes.</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-dark-800/50">
            <h3 className="text-xl font-semibold mb-4 text-primary">Community</h3>
            <p className="text-light-300">Join our growing community of tea and crypto enthusiasts.</p>
          </div>
        </div>
      </section>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={walletModalOpen} 
        onClose={() => setWalletModalOpen(false)} 
      />
    </div>
  );
}
