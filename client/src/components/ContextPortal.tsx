import { createPortal } from 'react-dom';
import { WalletContextProvider } from '@/contexts/WalletContext';
import { ReactNode } from 'react';

interface ContextPortalProps {
  children: ReactNode;
}

export function ContextPortal({ children }: ContextPortalProps) {
  // Get the portal container (create it if it doesn't exist)
  const getPortalContainer = () => {
    let container = document.getElementById('portal-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'portal-root';
      document.body.appendChild(container);
    }
    return container;
  };

  // Wrap the children with all necessary context providers
  const content = (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );

  return createPortal(content, getPortalContainer());
} 