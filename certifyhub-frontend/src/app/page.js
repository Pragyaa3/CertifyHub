'use client';

import ConnectWalletButton from '@/components/ConnectWalletButton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to CertifyHub</h1>
      <ConnectWalletButton />
    </main>
  );
}
