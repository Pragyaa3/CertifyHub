'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { ISSUER_WALLETS } from "@/constants/roles";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import Footer from '@/components/Footer';


export default function HomePage() {
  const { publicKey } = useWallet();
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <motion.div
          className="max-w-3xl space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to CertifyHub
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Your decentralized Digilocker on Solana for issuing, verifying, and storing certificates.
          </p>
          <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 transition" />
          {publicKey && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              {ISSUER_WALLETS.includes(publicKey.toBase58()) && (
                <button
                  onClick={() => router.push("/dashboard/issuer")}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-500 transition"
                >
                  Go to Issuer Dashboard
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard/recipient")}
                className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-500 transition"
              >
                Go to Recipient Dashboard
              </button>
            </div>
          )}

        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-black text-white">
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl font-bold mb-4">📄 What is CertifyHub?</h2>
            <p className="text-gray-300 text-lg">
              CertifyHub is a blockchain-powered platform where institutions can issue tamper-proof certificates and users can securely store, view, and verify them — forever.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-xl">
            <img src="/assets/Certificate.svg" alt="Certificate illustration" className="rounded-md" />
          </div>
        </motion.div>
      </section>

      {/* Become an Issuer Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold">🛡 Become an Issuer</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Are you an educational institution or organization? Apply to become an authorized issuer and start minting certificates for your students or employees.
          </p>
          <button
            onClick={() => router.push('/issuer/onboarding')}
            className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition"
          >
            Apply as Issuer
          </button>
        </motion.div>
      </section>

      {/* Recipient Use Section */}
      <section className="py-20 px-6 bg-black">
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-xl">
            <img src="/assets/Verify.svg" alt="Verify illustration" className="rounded-md" />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4">🔍 Verify & View</h2>
            <p className="text-gray-300 text-lg">
              As a recipient, view all your certificates in one place, verify them instantly, and share verifiable links with institutions or employers.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
