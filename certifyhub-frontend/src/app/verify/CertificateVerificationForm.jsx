'use client';

import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { motion } from 'framer-motion';

export default function CertificateVerificationForm() {
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCertificateData(null);

    try {
      const certRef = doc(db, 'certificates', certificateId);
      const certSnap = await getDoc(certRef);

      if (certSnap.exists()) {
        setCertificateData(certSnap.data());
      } else {
        setError('❌ Certificate not found. Please check the ID.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('🔥 An error occurred during verification.');
    }

    setLoading(false);
  };

  const isExpired = certificateData && (certificateData.expiryDate * 1000) < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen py-12 px-6 bg-gradient-to-br from-sky-900 via-slate-900 to-blue-800 text-white flex flex-col items-center"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-slate-800 bg-opacity-60 p-8 rounded-3xl shadow-xl space-y-6 backdrop-blur-lg border border-sky-700"
        whileHover={{ scale: 1.01 }}
      >
        <h2 className="text-3xl font-extrabold text-sky-300 text-center">
          🧾 Verify Certificate
        </h2>

        <input
          type="text"
          name="certificateId"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          required
          className="w-full px-4 py-2 bg-slate-700 border border-sky-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 transition-colors rounded-md font-semibold text-white shadow"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {error && <p className="text-red-400 text-center">{error}</p>}
      </motion.form>

      {certificateData && (
        <motion.div
          className="mt-8 w-full max-w-2xl bg-slate-900 bg-opacity-70 p-6 rounded-xl shadow-lg border border-cyan-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-cyan-300 mb-4">🎓 Certificate Details</h3>
          <div className="space-y-2 text-sm text-slate-200">
            <p><span className="text-cyan-400 font-semibold">Title:</span> {certificateData.title}</p>
            <p><span className="text-cyan-400 font-semibold">Description:</span> {certificateData.description}</p>
            <p><span className="text-cyan-400 font-semibold">Issued To:</span> {certificateData.recipientPubkey}</p>
            <p><span className="text-cyan-400 font-semibold">Issuer:</span> {certificateData.issuerWallet}</p>
            <p><span className="text-cyan-400 font-semibold">Issued At:</span> {new Date(certificateData.issueDate * 1000).toLocaleDateString()}</p>
            <p><span className="text-cyan-400 font-semibold">Expires On:</span> {new Date(certificateData.expiryDate * 1000).toLocaleDateString()}</p>
            <p>
              <span className="text-cyan-400 font-semibold">Status:</span>{' '}
              {isExpired ? (
                <span className="text-red-400 font-bold">❌ Expired</span>
              ) : (
                <span className="text-green-400 font-bold">✅ Valid</span>
              )}
            </p>
            <p>
              <span className="text-cyan-400 font-semibold">Transaction:</span>{' '}
              <a
                href={`https://explorer.solana.com/tx/${certificateData.txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400"
              >
                View on Explorer 🔗
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
