import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "./WalletModal";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const [location] = useLocation();
  const { connected } = useWallet();
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
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <a className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Crypto Tea House
              </a>
            </Link>
            
            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-light-300 hover:text-light-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-light-100"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="bg-dark-900 border-l border-dark-700">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`text-lg font-medium transition-colors ${
                        isActive(item.path)
                          ? "text-primary"
                          : "text-light-300 hover:text-light-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {connected ? (
                    <>
                      <Link 
                        href="/dashboard"
                        className="py-2 px-4 rounded-lg bg-dark-700/50 text-light-100 hover:bg-dark-700"
                      >
                        Dashboard
                      </Link>
                      <Button 
                        variant="outline" 
                        className="border-primary/30 text-primary mt-4"
                        onClick={() => setWalletModalOpen(true)}
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
            <div className="hidden md:flex items-center gap-4">
              {connected ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-light-300 hover:text-light-100 transition font-medium"
                  >
                    Dashboard
                  </Link>
                  <ProfileMenu />
                </>
              ) : (
                <Button
                  className="hidden md:block bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-5 py-2 rounded-lg shadow-lg wallet-button"
                  onClick={() => setWalletModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {walletModalOpen && (
        <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      )}
    </>
  );
}
