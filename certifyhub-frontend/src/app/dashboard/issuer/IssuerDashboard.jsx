'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from '@/utils/firebaseConfig';
import { motion } from 'framer-motion';

export default function IssuerDashboard() {
  const [certificates, setCertificates] = useState([]);
  const wallet = useWallet();

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!wallet.connected) return;
      const q = query(
        collection(db, 'certificates'),
        where('issuerWallet', '==', wallet.publicKey.toBase58())
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCertificates(results);
    };

    fetchCertificates();
  }, [wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1d1f40] via-[#202255] to-[#2c2e70] text-white px-6 py-10">
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🧾 Issuer Dashboard
      </motion.h1>

      {certificates.length === 0 ? (
        <motion.p
          className="text-center text-gray-300 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No certificates issued yet.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              className="bg-[#2f3165] border border-indigo-500 rounded-2xl p-5 shadow-xl hover:scale-[1.03] hover:shadow-2xl transition duration-300"
              whileHover={{ scale: 1.03 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h2 className="text-xl font-semibold text-indigo-200 mb-1">{cert.title}</h2>
              <p className="text-sm text-indigo-400 mb-3">{cert.description}</p>

              <p className="text-sm">
                <span className="font-medium text-indigo-300">📄 Certificate ID:</span>{' '}
                <span className="text-white">{cert.id}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-indigo-300">🎓 Recipient:</span>{' '}
                <span className="text-white">{cert.recipientPubkey}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-indigo-300">📌 Status:</span>{' '}
                <span
                  className={`font-bold ${
                    cert.status === 'Revoked' ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {cert.status}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-indigo-300">📅 Issued:</span>{' '}
                <span className="text-white">{cert.issueDate}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-indigo-300">⌛ Expires:</span>{' '}
                <span className="text-white">{cert.expiryDate}</span>
              </p>

              <a
                href={`https://explorer.solana.com/address/${cert.recipientPubkey}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-indigo-300 underline hover:text-indigo-100 text-sm"
              >
                🔗 View on Solana Explorer
              </a>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
