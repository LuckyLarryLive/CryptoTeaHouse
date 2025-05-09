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
    console.log('[RouteGuard] State:', {
      isConnected: !!walletProvider,
      hasUser: !!user,
      isProfileComplete: user?.is_profile_complete,
      currentLocation: location,
      userData: user
    });

    if (!walletProvider && location === '/') {
      console.log('[RouteGuard] Already on home page, no redirect needed');
      return;
    }
    if (!user && location === '/') {
      console.log('[RouteGuard] Already on home page, no redirect needed');
      return;
    }
    if (!user?.is_profile_complete && location === '/complete-profile') {
      console.log('[RouteGuard] Already on complete-profile page, no redirect needed');
      return;
    }
    if (user?.is_profile_complete && location === '/dashboard') {
      console.log('[RouteGuard] Already on dashboard page, no redirect needed');
      return;
    }

    if (!walletProvider) {
      console.log('[RouteGuard] No wallet provider, redirecting to home');
      setLocation('/');
      return;
    }

    if (!user) {
      console.log('[RouteGuard] No user data, redirecting to home');
      setLocation('/');
      return;
    }

    if (!user.is_profile_complete && location !== '/complete-profile') {
      console.log('[RouteGuard] Profile incomplete, redirecting to complete-profile. User state:', {
        isProfileComplete: user.is_profile_complete,
        currentLocation: location
      });
      setLocation('/complete-profile');
      return;
    }

    if (user.is_profile_complete && location === '/complete-profile') {
      console.log('[RouteGuard] Profile complete but on complete-profile, redirecting to dashboard. User state:', {
        isProfileComplete: user.is_profile_complete,
        currentLocation: location
      });
      setLocation('/dashboard');
      return;
    }
  }, [walletProvider, user, location]);

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
