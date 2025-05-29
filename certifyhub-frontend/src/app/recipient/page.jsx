"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import CertificateList from "@/components/CertificateList";

export default function RecipientDashboard() {
  const { connected, publicKey } = useWallet();

  if (!connected) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Welcome to CertifyHub</h1>
        <p className="text-gray-600 mb-6">
          A decentralized platform for issuing and verifying certificates securely.
        </p>
        <p className="text-md text-blue-600">
          Please connect your wallet to access your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4">
        Hello, {publicKey.toBase58().slice(0, 4)}...
        {publicKey.toBase58().slice(-4)}
      </h1>
      <p className="text-gray-700 mb-6">
        Here are your issued certificates. (This will soon fetch from Arweave or Solana!)
      </p>

      <div className="border border-dashed border-gray-300 p-10 text-center text-gray-400">
        Your certificates will appear here.
        <CertificateList />
      </div>
    </div>
  );
}
