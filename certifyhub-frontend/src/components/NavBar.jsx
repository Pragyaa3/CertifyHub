// src/components/NavBar.jsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function NavBar() {
  const { connected, publicKey } = useWallet();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        CertifyHub
      </Link>

      <div>
        {connected ? (
          <span className="text-sm text-gray-600 mr-4">
            {publicKey?.toBase58().slice(0, 4)}...
            {publicKey?.toBase58().slice(-4)}
          </span>
        ) : null}
        <WalletMultiButton />
      </div>
    </nav>
  );
}
