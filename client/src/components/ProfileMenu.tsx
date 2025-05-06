import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/contexts/WalletContext";

export default function ProfileMenu() {
  const { publicKey, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const formatPublicKey = (key: string | null) => {
    if (!key) return "";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-dark-700 border border-primary/30 text-light-100"
        >
          {formatPublicKey(publicKey)} <span className="w-2 h-2 bg-primary rounded-full inline-block ml-2"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-dark-800 border border-dark-700">
        <DropdownMenuItem asChild>
          <Link href="/stats" className="cursor-pointer text-light-100 hover:text-primary">
            Stats
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/preferences" className="cursor-pointer text-light-100 hover:text-primary">
            Preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-light-100 hover:text-destructive focus:text-destructive"
          onClick={disconnect}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 