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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWallet } from "@/contexts/WalletContext";

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
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
