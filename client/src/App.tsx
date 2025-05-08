import { Switch, Route } from "wouter";
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
import AuthCallback from "@/pages/AuthCallback";
import CompleteProfile from '@/pages/CompleteProfile';
import Preferences from '@/pages/Preferences';

function Router() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          {connected ? <Dashboard /> : <Home />}
        </Route>
        <Route path="/winners" component={Winners} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/tokenomics" component={Tokenomics} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/legal" component={Legal} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/complete-profile" component={CompleteProfile} />
        <Route path="/preferences">
          {connected ? <Preferences /> : <Home />}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <AgeVerification />
        <Router />
      </TooltipProvider>
    </WalletProvider>
  );
}

export default App;
