import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "./WalletModal";

export default function Header() {
  const [location] = useLocation();
  const { connected, publicKey, disconnect } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  
  const navItems = [
    { name: "Tea House", path: "/" },
    { name: "Winners", path: "/winners" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Tokenomics", path: "/tokenomics" },
    { name: "Roadmap", path: "/roadmap" },
  ];
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  const formatPublicKey = (key: string | null) => {
    if (!key) return "";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Crypto Tea House
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={`text-lg font-medium ${isActive(item.path) ? 'tab-active' : 'text-light-300 hover:text-light-100 transition'}`}>
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-light-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-dark-800 border-l border-dark-700 w-full max-w-xs pt-12">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a className={`py-2 px-4 rounded-lg ${isActive(item.path) 
                    ? 'bg-dark-700 font-semibold text-primary' 
                    : 'text-light-300 hover:text-light-100 hover:bg-dark-700/50'}`}>
                    {item.name}
                  </a>
                </Link>
              ))}
              
              {connected ? (
                <>
                  <Link href="/dashboard">
                    <a className="py-2 px-4 rounded-lg bg-dark-700/50 text-light-100 hover:bg-dark-700">
                      Dashboard
                    </a>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-primary/30 text-primary mt-4"
                    onClick={disconnect}
                  >
                    Disconnect Wallet
                  </Button>
                </>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold mt-4"
                  onClick={() => setWalletModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Connect Wallet Button (Desktop) */}
        {connected ? (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <a className="text-light-300 hover:text-light-100 transition font-medium">
                Dashboard
              </a>
            </Link>
            <Button
              variant="outline"
              className="bg-dark-700 border border-primary/30 text-light-100"
              onClick={disconnect}
            >
              {formatPublicKey(publicKey)} <span className="w-2 h-2 bg-primary rounded-full inline-block ml-2"></span>
            </Button>
          </div>
        ) : (
          <Button
            className="hidden md:block bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-5 py-2 rounded-lg shadow-lg wallet-button"
            onClick={() => setWalletModalOpen(true)}
          >
            Connect Wallet
          </Button>
        )}
      </div>
      
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </header>
  );
}
