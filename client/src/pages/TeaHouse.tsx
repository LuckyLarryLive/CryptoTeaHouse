import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import LuckyCatVideo from "@/components/LuckyCatVideo";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeaHouse() {
  const { user, walletProvider } = useWallet();
  const { toast } = useToast();
  const [isPulling, setIsPulling] = useState(false);
  const [selectedPulls, setSelectedPulls] = useState("1");

  const pullOptions = [
    { value: "1", label: "1 Pull" },
    { value: "5", label: "5 Pulls" },
    { value: "10", label: "10 Pulls" },
    { value: "25", label: "25 Pulls" },
    { value: "50", label: "50 Pulls" },
    { value: "100", label: "100 Pulls" },
    { value: "250", label: "250 Pulls" },
    { value: "500", label: "500 Pulls" },
  ];

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

  const handlePurchasePulls = async () => {
    if (!user || !walletProvider) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement purchase logic
    toast({
      title: "Coming Soon",
      description: "Purchase functionality will be available soon!",
    });
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
          <div className="bg-dark-800 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div className="aspect-video relative">
              <LuckyCatVideo />
            </div>
          </div>

          {/* Pull Controls Section */}
          <div className="bg-dark-800 rounded-2xl p-6 mb-12">
            <div className="space-y-6">
              {/* Free Daily Pull */}
              <div>
                <Button
                  onClick={handlePull}
                  disabled={isPulling}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold py-6 text-lg"
                >
                  {isPulling ? "Pulling..." : "Free Daily Pull"}
                </Button>
              </div>

              {/* Purchase Additional Pulls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedPulls} onValueChange={setSelectedPulls}>
                    <SelectTrigger className="w-[200px] bg-dark-700 border-dark-600">
                      <SelectValue placeholder="Select number of pulls" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      {pullOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className={`${
                            parseInt(option.value) > 100 
                              ? 'text-accent hover:text-accent/80' 
                              : parseInt(option.value) > 25 
                                ? 'text-secondary hover:text-secondary/80'
                                : 'text-primary hover:text-primary/80'
                          }`}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handlePurchasePulls}
                    className="flex-1 bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-dark-900 font-semibold py-6 text-lg"
                  >
                    Purchase Pulls
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing Entries Section */}
          <div className="bg-dark-800 rounded-2xl p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Drawing Entries</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-dark-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Daily</h3>
                <p className="text-3xl font-bold text-primary">1/1</p>
              </div>
              <div className="bg-dark-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Weekly</h3>
                <p className="text-3xl font-bold text-secondary">0</p>
              </div>
              <div className="bg-dark-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Monthly</h3>
                <p className="text-3xl font-bold text-accent">0</p>
              </div>
              <div className="bg-dark-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Yearly</h3>
                <p className="text-3xl font-bold text-amber-400">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 