"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { ISSUER_WALLETS } from "@/constants/roles";

export default function HomePage() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();
      if (ISSUER_WALLETS.includes(walletAddress)) {
        router.push("/dashboard"); // Issuer
      } else {
        router.push("/recipient"); // Recipient
      }
    }
  }, [publicKey, router]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to CertifyHub</h1>
      <p className="text-lg text-gray-600">
        A decentralized platform for issuing and verifying certificates.
      </p>
      <p className="text-md mt-4 text-blue-600">
        Connect your wallet to get started.
      </p>
    </div>
  );
}
