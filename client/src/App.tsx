import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletProvider, useWallet } from "@/contexts/WalletContext";
import type { WalletUser } from "@/contexts/WalletContext";
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
import AgeVerification from "@/components/AgeVerification";
import CompleteProfile from '@/pages/CompleteProfile';
import Preferences from '@/pages/Preferences';

function AppRoutes() {
  const [location, setLocation] = useLocation();
  const { user, walletProvider } = useWallet();

  const isConnected = !!user && !!walletProvider;

  // Define protected routes that require wallet connection
  const protectedRoutes = ['/dashboard', '/preferences'];
  const isProtectedRoute = protectedRoutes.includes(location);

  useEffect(() => {
    console.log('[RouteGuard] State:', {
      isConnected: !!walletProvider,
      hasUser: !!user,
      isProfileComplete: user?.is_profile_complete,
      currentLocation: location,
      isProtectedRoute,
      userData: user,
      userStateString: JSON.stringify(user, null, 2),
      userStateDetails: user ? {
        id: user.id,
        isProfileComplete: user.is_profile_complete,
        provider: user.provider,
        hasUsername: !!user.username,
        hasEmail: !!user.email
      } : null
    });

    // Only check wallet provider for protected routes
    if (isProtectedRoute && !walletProvider) {
      console.log('[RouteGuard] Protected route accessed without wallet provider, redirecting to home');
      setLocation('/');
      return;
    }

    if (!user) {
      console.log('[RouteGuard] No user in context, redirecting to home');
      setLocation('/');
      return;
    }

    if (location === '/dashboard' && !user.is_profile_complete) {
      console.log('[RouteGuard] Profile incomplete, redirecting to complete-profile. User state:', {
        userId: user.id,
        isProfileComplete: user.is_profile_complete,
        userData: user,
        userStateString: JSON.stringify(user, null, 2),
        userStateDetails: {
          id: user.id,
          isProfileComplete: user.is_profile_complete,
          provider: user.provider,
          hasUsername: !!user.username,
          hasEmail: !!user.email
        }
      });
      setLocation('/complete-profile');
      return;
    }
  }, [walletProvider, user, location, isProtectedRoute]);

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

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useWallet();
  const [location, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [lastUserState, setLastUserState] = useState<WalletUser | null>(null);

  useEffect(() => {
    // Store the last known user state
    if (user) {
      setLastUserState(user);
    }

    console.log('[RouteGuard] Checking route access:', {
      currentLocation: location,
      hasUser: !!user,
      userId: user?.id,
      isProfileComplete: user?.is_profile_complete,
      lastKnownIsProfileComplete: lastUserState?.is_profile_complete,
      userData: user,
      userStateString: JSON.stringify(user, null, 2),
      timestamp: new Date().toISOString()
    });

    // Add a small delay to allow context updates to propagate
    const timer = setTimeout(() => {
      // Use the most recent state we have
      const currentUser = user || lastUserState;
      
      if (!currentUser) {
        console.log('[RouteGuard] No user, redirecting to login');
        setLocation('/login');
      } else if (!currentUser.is_profile_complete && location !== '/complete-profile') {
        console.log('[RouteGuard] Profile incomplete, redirecting to complete-profile:', {
          currentLocation: location,
          isProfileComplete: currentUser.is_profile_complete,
          userData: currentUser,
          userStateString: JSON.stringify(currentUser, null, 2),
          timestamp: new Date().toISOString()
        });
        setLocation('/complete-profile');
      } else if (currentUser.is_profile_complete && location === '/complete-profile') {
        console.log('[RouteGuard] Profile complete, redirecting to dashboard');
        setLocation('/dashboard');
      }
      setIsChecking(false);
    }, 100); // Increased delay to ensure state propagation

    return () => clearTimeout(timer);
  }, [user, location, setLocation, lastUserState]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

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
