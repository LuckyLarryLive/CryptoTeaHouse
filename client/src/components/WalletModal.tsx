import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Link } from "wouter";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting } = useWallet();
  console.log("[WalletModal] RECEIVED context. Connect function reference:", connect);

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletName: string) => {
    console.log(`[WalletModal] handleConnect called with: ${walletName}`);
    setSelectedWallet(walletName);
    try {
      console.log(`[WalletModal] Attempting to call context.connect for ${walletName}...`);
      await connect(walletName);
      console.log(`[WalletModal] context.connect for ${walletName} completed.`);
      onClose();
    } catch (error) {
      console.error(`[WalletModal] Error calling context.connect for ${walletName}:`, error);
      if (error instanceof Error && 
          (error.message.includes("User rejected") || 
           error.message.includes("timeout") ||
           error.message.includes("Internal server error"))) {
        setSelectedWallet(null);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="bg-dark-800/95 backdrop-blur-md border border-dark-700 text-white w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Connect Wallet</DialogTitle>
            <DialogDescription className="text-light-300">
              Select a wallet to connect to Crypto Tea House
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Phantom */}
            <Button
              variant="ghost"
              className="w-full bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex items-center justify-start h-auto"
              onClick={() => {
                console.log("[WalletModal] Phantom button clicked.");
                handleConnect("phantom");
              }}
              disabled={isConnecting}
            >
              <div className="bg-[#AB9FF2] w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M64 0C28.7 0 0 28.7 0 64C0 99.3 28.7 128 64 128C99.3 128 128 99.3 128 64C128 28.7 99.3 0 64 0ZM64 96.9C46.8 96.9 32.8 82.9 32.8 65.7C32.8 48.4 46.8 34.5 64 34.5C81.2 34.5 95.2 48.5 95.2 65.7C95.2 82.9 81.2 96.9 64 96.9Z" fill="white"/>
                  <path d="M84.2 44.8H59.1C57.3 44.8 55.9 46.2 55.9 48C55.9 49.8 57.3 51.2 59.1 51.2H59.5C60.9 51.2 62.1 52.1 62.6 53.4L65.1 60.3C65.7 61.9 67.1 63 68.8 63H80.2C82.7 63 85 60.9 85.2 58.4L85.9 47.6C85.9 47.4 85.9 47.3 85.9 47.1C85.9 45.8 85.2 44.8 84.2 44.8Z" fill="white"/>
                  <path d="M80.8 67.4H69.7C68.2 67.4 66.9 66.4 66.3 65.1L63.3 57.4C62.7 56 61.3 55.1 59.8 55.1H57.1C55.3 55.1 53.9 56.5 53.9 58.3C53.9 60.1 55.3 61.5 57.1 61.5H57.6C58.9 61.5 60.1 62.4 60.6 63.7L63.1 70.6C63.7 72.2 65.1 73.3 66.8 73.3H78.2C80.7 73.3 83 71.2 83.2 68.7L83.4 67.3C83.5 67.3 82.3 67.4 80.8 67.4Z" fill="white"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Phantom</div>
                <div className="text-sm text-light-300">Connect with Phantom Wallet</div>
              </div>
              {selectedWallet === "phantom" && isConnecting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
            
            {/* Solflare */}
            <Button
              variant="ghost"
              className="w-full bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex items-center justify-start h-auto"
              onClick={() => handleConnect("solflare")}
              disabled={isConnecting}
            >
              <div className="bg-[#FE9D32] w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 7.163 32 16 32C24.837 32 32 24.837 32 16C32 7.163 24.837 0 16 0ZM16 26.5C9.649 26.5 4.5 21.351 4.5 15C4.5 8.649 9.649 3.5 16 3.5C22.351 3.5 27.5 8.649 27.5 15C27.5 21.351 22.351 26.5 16 26.5Z" fill="white"/>
                  <path d="M16 7C13.386 7 11.277 8.985 11.277 11.444C11.277 13.904 13.386 15.889 16 15.889C18.614 15.889 20.723 13.904 20.723 11.444C20.723 8.985 18.614 7 16 7Z" fill="white"/>
                  <path d="M16 20.25C11.029 20.25 7 18.25 7 15.75V19.25C7 21.75 11.029 23.75 16 23.75C20.971 23.75 25 21.75 25 19.25V15.75C25 18.25 20.971 20.25 16 20.25Z" fill="white"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Solflare</div>
                <div className="text-sm text-light-300">Connect with Solflare Wallet</div>
              </div>
              {selectedWallet === "solflare" && isConnecting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
            
            {/* Other Wallets */}
            <Button
              variant="ghost"
              className="w-full bg-dark-700 hover:bg-dark-700/70 rounded-xl p-4 flex items-center justify-start h-auto"
              onClick={() => handleConnect("other")}
              disabled={isConnecting}
            >
              <div className="bg-primary/20 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Other Wallets</div>
                <div className="text-sm text-light-300">View more wallet options</div>
              </div>
              {selectedWallet === "other" && isConnecting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-dark-700">
            <div className="text-sm text-light-300 text-center">
              By connecting your wallet, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
