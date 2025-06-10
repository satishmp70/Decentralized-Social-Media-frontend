'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnect() {
  return (
    <div className="bg-white p-4 rounded shadow-md text-black">
      <ConnectButton />
    </div>
  );
}