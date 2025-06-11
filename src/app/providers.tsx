'use client';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const config = useMemo(
    () =>
      getDefaultConfig({
        appName: 'Decentralized Social Media',
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
        chains: [mainnet, sepolia],
      }),
    []
  );

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 