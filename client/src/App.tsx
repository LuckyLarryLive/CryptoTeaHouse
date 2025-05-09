import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Winners from "@/pages/Winners";
import HowItWorks from "@/pages/HowItWorks";
import Tokenomics from "@/pages/Tokenomics";
import Roadmap from "@/pages/Roadmap";
import Legal from "@/pages/Legal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WalletProvider, useWallet } from "@/contexts/WalletContext";
import AgeVerification from "@/components/AgeVerification";
import CompleteProfile from '@/pages/CompleteProfile';
import Preferences from '@/pages/Preferences';

function AppRoutes() {
  const [location, setLocation] = useLocation();
  const { user, walletProvider } = useWallet();

  const isConnected = !!user && !!walletProvider;

  useEffect(() => {
    if (isConnected && !user?.username && location !== "/complete-profile") {
      setLocation("/complete-profile");
    }
  }, [isConnected, user, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/complete-profile" component={CompleteProfile} />
      <Route path="/preferences" component={Preferences} />
      <Route path="/winners" component={Winners} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/tokenomics" component={Tokenomics} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/legal" component={Legal} />
    </Switch>
  );
}

function App() {
  return (
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <AgeVerification />
        <div className="min-h-screen bg-dark-900 text-light-100">
          <Header />
          <main className="pt-16">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </WalletProvider>
  );
}

export default App;
