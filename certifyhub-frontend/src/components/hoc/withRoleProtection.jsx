'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export default function withRoleProtection(Component, allowedWallets = []) {
  return function ProtectedComponent(props) {
    const { connected, publicKey } = useWallet();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
      if (connected && publicKey) {
        const userWallet = publicKey.toBase58();
        setIsAllowed(allowedWallets.includes(userWallet));
      } else {
        setIsAllowed(false);
      }
    }, [connected, publicKey, allowedWallets]);

    if (!connected) {
      return (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold mb-4">Connect your wallet</h1>
          <p>Please connect your wallet to access this page.</p>
        </div>
      );
    }

    if (!isAllowed) {
      return (
        <div className="text-center mt-20 text-red-600">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>Your wallet does not have permission to access this page.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
