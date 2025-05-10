import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import LuckyCatVideo from "@/components/LuckyCatVideo";
import { useToast } from "@/hooks/use-toast";

export default function TeaHouse() {
  const { user, walletProvider } = useWallet();
  const { toast } = useToast();
  const [isPulling, setIsPulling] = useState(false);

  const handlePull = async () => {
    if (!user || !walletProvider) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsPulling(true);
    try {
      const response = await fetch('/api/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          pullType: 'daily'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to pull');
      }

      const result = await response.json();
      toast({
        title: "Success!",
        description: result.details.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pull the lucky cat's arm",
        variant: "destructive"
      });
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to the Tea House, {user?.username || 'Tea Enthusiast'}!
            </h1>
            <p className="text-xl text-light-300">
              Pull the lucky cat's arm to receive your daily fortune and prizes.
            </p>
          </div>

          {/* Lucky Cat Section */}
          <div className="relative bg-dark-800 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div className="aspect-video relative">
              <LuckyCatVideo />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900 to-transparent">
              <Button
                onClick={handlePull}
                disabled={isPulling}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold py-6 text-lg"
              >
                {isPulling ? "Pulling..." : "Pull Lucky Cat's Arm"}
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-dark-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Daily Pulls</h3>
              <p className="text-3xl font-bold text-primary">1/1</p>
            </div>
            <div className="bg-dark-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Tickets</h3>
              <p className="text-3xl font-bold text-secondary">0</p>
            </div>
            <div className="bg-dark-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Winnings</h3>
              <p className="text-3xl font-bold text-accent">0 SOL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 