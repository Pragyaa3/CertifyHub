'use client';

import { useState } from 'react';
import { getProvider, getProgram, revokeCertificate } from '@/utils/anchorClient';
import { useWallet } from '@solana/wallet-adapter-react';
import { updateCertificateStatusInFirestore } from '@/utils/firebaseService';
import { motion } from 'framer-motion';

export default function CertificateRevocationForm() {
  const [form, setForm] = useState({
    certificateId: '',
    revocationReason: '',
    revocationDate: '',
  });

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setError('');

    try {
      if (!wallet.connected) throw new Error('Please connect your wallet');

      const provider = getProvider(wallet);
      const program = getProgram(provider);

      const { tx, certificatePDA } = await revokeCertificate(program, form.certificateId);

      await updateCertificateStatusInFirestore(form.certificateId, {
        status: 'Revoked',
        revocationReason: form.revocationReason,
        revocationDate: form.revocationDate,
      });

      setStatus(`✅ Certificate revoked!\nTransaction: ${tx}\nCertificate PDA: ${certificatePDA.toBase58()}`);
    } catch (err) {
      setError(err.message || 'Failed to revoke certificate');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ed] via-[#ffe0b2] to-[#ffccbc] py-12 px-4">
      <motion.div
        className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 text-gray-800 border border-orange-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-orange-600">⚠️ Revoke Certificate</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Certificate ID</label>
            <input
              type="text"
              name="certificateId"
              value={form.certificateId}
              onChange={handleChange}
              required
              placeholder="Enter certificate ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Revocation Reason</label>
            <textarea
              name="revocationReason"
              value={form.revocationReason}
              onChange={handleChange}
              required
              placeholder="Describe the reason..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Revocation Date</label>
            <input
              type="date"
              name="revocationDate"
              value={form.revocationDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-400 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Revoking...' : '🚫 Revoke Certificate'}
          </motion.button>

          {status && <p className="text-green-600 whitespace-pre-wrap mt-4">{status}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </motion.div>
    </div>
  );
}
