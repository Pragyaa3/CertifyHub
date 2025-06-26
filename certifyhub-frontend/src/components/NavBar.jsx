'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const { connected, publicKey } = useWallet();
  const [scrolling, setScrolling] = useState(false);

  // Scroll detection to hide on scroll
  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolling(currentScroll > lastScroll && currentScroll > 50);
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`transition-all duration-500 ${
        scrolling ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center w-full z-40`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Link href="/" className="text-2xl font-bold text-white hover:text-cyan-400 transition duration-200">
        CertifyHub
      </Link>

      <div className="flex items-center gap-6">
        {connected && (
          <>
            <Link href="/verify" className="text-white hover:text-cyan-300 font-medium transition">
              Verify
            </Link>
            <Link href="/dashboard" className="text-white hover:text-cyan-300 font-medium transition">
              Dashboard
            </Link>
            <span className="text-sm text-gray-300 hidden md:inline">
              {publicKey?.toBase58().slice(0, 4)}...
              {publicKey?.toBase58().slice(-4)}
            </span>
          </>
        )}

        <WalletMultiButton className="!bg-cyan-500 hover:!bg-cyan-600 !text-white !rounded-full !px-4 !py-2" />
      </div>
    </motion.nav>
  );
}
