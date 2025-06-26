'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-20 bg-white/5 backdrop-blur-md border-t border-white/10 text-white px-6 py-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-cyan-400">Developed By</h3>
          <p className="text-gray-300">
            
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-cyan-400">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-cyan-300 transition">Home</Link></li>
            <li><Link href="/verify" className="hover:text-cyan-300 transition">Verify Certificate</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-300 transition">Issuer Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact / Socials Section */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-cyan-400">Connect</h3>
          <ul className="space-y-2">
            <li><a href="mailto:hello@certifyhub.xyz" className="hover:text-cyan-300 transition">hello@certifyhub.xyz</a></li>
            <li><a href="https://x.com/certifyhub" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">Twitter</a></li>
            <li><a href="https://github.com/your-github/certifyhub" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-400 mt-10 text-xs">
        © {new Date().getFullYear()} CertifyHub. All rights reserved.
      </div>
    </motion.footer>
  );
}
