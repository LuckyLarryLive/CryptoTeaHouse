import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "./WalletModal";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const [location] = useLocation();
  const { user, walletProvider } = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const navItems = [
    { name: "Tea House", path: "/" },
    { name: "Winners", path: "/winners" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Tokenomics", path: "/tokenomics" },
    { name: "Roadmap", path: "/roadmap" },
    { name: "Legal", path: "/legal" },
  ];
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleAuthClick = (isSignUpFlow: boolean) => {
    setIsSignUp(isSignUpFlow);
    setWalletModalOpen(true);
  };

  const isConnected = !!user && !!walletProvider;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Crypto Tea House
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-light-300 hover:text-light-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex lg:hidden items-center space-x-4">
              {navItems.slice(0, 3).map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-xs font-medium transition-colors whitespace-nowrap ${
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
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-light-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-dark-900 border-l border-dark-800">
                  <nav className="flex flex-col space-y-4 mt-8">
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
                    {!isConnected && (
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold"
                          onClick={() => handleAuthClick(false)}
                        >
                          Connect Wallet
                        </Button>
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Connect Wallet Button (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {isConnected ? (
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
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-dark-900 font-semibold px-5 py-2 rounded-lg shadow-lg wallet-button"
                  onClick={() => handleAuthClick(false)}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {walletModalOpen && (
        <WalletModal 
          isOpen={walletModalOpen} 
          onClose={() => setWalletModalOpen(false)}
          isSignUp={isSignUp}
        />
      )}
    </>
  );
}
