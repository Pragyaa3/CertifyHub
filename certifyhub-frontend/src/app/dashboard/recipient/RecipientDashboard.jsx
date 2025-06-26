'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';
import { db } from '@/utils/firebaseConfig';
import { motion } from 'framer-motion';

export default function RecipientDashboard() {
  const [certificates, setCertificates] = useState([]);
  const wallet = useWallet();

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!wallet.connected) return;
      const q = query(collection(db, 'certificates'), where('recipientPubkey', '==', wallet.publicKey.toBase58()));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCertificates(results);
    };

    fetchCertificates();
  }, [wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-8 text-center"
        >
          🎓 Recipient Dashboard
        </motion.h1>

        {certificates.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No certificates received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg"
            >
              <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-4">Title</th>
                  <th scope="col" className="px-6 py-4">Issuer</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Issued</th>
                  <th scope="col" className="px-6 py-4">Expires</th>
                  <th scope="col" className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, idx) => (
                  <motion.tr
                    key={cert.id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <td className="px-6 py-4 font-medium text-white">{cert.title}</td>
                    <td className="px-6 py-4 text-sm">{cert.issuerWallet.slice(0, 6)}...{cert.issuerWallet.slice(-4)}</td>
                    <td className="px-6 py-4 font-bold">
                      {cert.status === 'Revoked' ? (
                        <span className="text-red-400">Revoked</span>
                      ) : (
                        <span className="text-green-400">Valid</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{cert.issueDate}</td>
                    <td className="px-6 py-4">{cert.expiryDate}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://explorer.solana.com/address/${cert.issuerWallet}?cluster=devnet`}
                        target="_blank"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        View
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}
      </div>
    </div>
  );
}
