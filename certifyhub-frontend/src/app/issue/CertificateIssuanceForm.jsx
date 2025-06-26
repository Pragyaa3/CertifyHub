import React, { useState, useEffect } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getProvider, getProgram, issueCertificate, checkProgramDeployment } from '@/utils/anchorClient';
import { saveCertificateToFirestore } from "@/utils/firestore";
import { motion } from "framer-motion";


const CertificateIssuanceForm = ({ connection }) => {
  // Use the wallet hook directly in the component
  const wallet = useWallet();

  const { connected } = wallet;

  useEffect(() => {
    if (!connected) {
      router.push("/"); // redirect to home or login page
    }
  }, [connected]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issueDate: '',
    expiryDate: '',
    recipientAddress: '',
    skills: [],
    issuerName: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Set default dates when component mounts
  useEffect(() => {
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);

    setFormData(prev => ({
      ...prev,
      issueDate: prev.issueDate || today.toISOString().split('T')[0],
      expiryDate: prev.expiryDate || oneYearLater.toISOString().split('T')[0],
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Comprehensive wallet validation
      console.log('Wallet validation:', {
        wallet: !!wallet,
        publicKey: !!wallet?.publicKey,
        connected: wallet?.connected,
        signTransaction: !!wallet?.signTransaction
      });

      if (!wallet) {
        throw new Error('Wallet adapter not available');
      }

      if (!wallet.connected) {
        throw new Error('Please connect your wallet first');
      }

      if (!wallet.publicKey) {
        throw new Error('Wallet public key not available');
      }

      if (!wallet.signTransaction) {
        throw new Error('Wallet does not support transaction signing');
      }

      // Validate form data
      if (!formData.title.trim() || !formData.description.trim() || !formData.recipientAddress.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.issueDate || !formData.expiryDate) {
        throw new Error('Please select issue and expiry dates');
      }

      console.log('Starting certificate issuance...');

      // Refresh provider and program to avoid blockhash errors
      const freshProvider = getProvider(wallet);
      const freshProgram = getProgram(freshProvider);

      // Check if program exists before proceeding
      const programExists = await checkProgramDeployment(
        freshProvider.connection,
        freshProgram.programId.toString()
      );

      if (!programExists) {
        throw new Error('Certificate program is not deployed on devnet');
      }

      const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Validate recipient address
      let recipientPubkey;
      try {
        recipientPubkey = new PublicKey(formData.recipientAddress);
      } catch (err) {
        throw new Error('Invalid recipient wallet address format');
      }

      // Prepare certificate data
      const issueDate = new anchor.BN(Math.floor(new Date(formData.issueDate).getTime() / 1000));
      const expiryDate = new anchor.BN(Math.floor(new Date(formData.expiryDate).getTime() / 1000));

      console.log('Certificate data prepared:', {
        certificateId,
        title: formData.title,
        description: formData.description,
        issueDate: issueDate.toString(),
        expiryDate: expiryDate.toString(),
        recipientAddress: recipientPubkey.toString()
      });

      // Call issueCertificate with fresh program
      const issuanceResult = await issueCertificate(
        freshProgram,
        certificateId,
        recipientPubkey,
        formData.title,
        formData.description,
        issueDate,
        expiryDate,
        '' // metadataUri
      );
      const { tx, certificatePDA } = issuanceResult;


      console.log('Certificate issued successfully:', issuanceResult);

      setSuccess(`Certificate issued successfully! 
      Transaction: ${issuanceResult.tx}
      Certificate PDA: ${issuanceResult.certificatePDA?.toString()}`);

      await saveCertificateToFirestore({
        certificateId,
        title: formData.title,
        description: formData.description,
        issueDate: issueDate.toNumber(),     // ✅ convert BN to number
        expiryDate: expiryDate.toNumber(),   // ✅ convert BN to number
        issuerWallet: freshProgram.provider.wallet.publicKey.toString(),
        recipientPubkey: recipientPubkey.toString(),
        certificatePDA: certificatePDA.toString(),
        txSignature: tx,
        timestamp: Date.now()
      });



      // Reset form
      setFormData({
        title: '',
        description: '',
        issueDate: '',
        expiryDate: '',
        recipientAddress: '',
        skills: [],
        issuerName: ''
      });

    } catch (err) {
      console.error('Certificate issuance failed:', err);

      // Provide more specific error messages
      let errorMessage = 'Failed to issue certificate';

      if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient SOL balance to pay for transaction fees';
      } else if (err.message.includes('Invalid public key')) {
        errorMessage = 'Invalid recipient wallet address';
      } else if (err.message.includes('blockhash')) {
        errorMessage = 'Transaction expired. Please try again';
      } else if (err.message.includes('User rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (err.message.includes('signature verification failed')) {
        errorMessage = 'Transaction signature failed. Please try again';
      } else if (err.message.includes('does not exist') || err.message.includes('not deployed')) {
        errorMessage = 'Certificate program is not deployed on devnet. Please deploy your Solana program first.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative method using direct program.methods call
  const handleSubmitAlternative = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!wallet || !wallet.connected || !wallet.publicKey) {
        throw new Error('Please connect your wallet first');
      }

      // Validate form data
      if (!formData.title.trim() || !formData.description.trim() || !formData.recipientAddress.trim()) {
        throw new Error('Please fill in all required fields');
      }

      const provider = getProvider(wallet);
      const program = getProgram(provider);

      const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const recipientPubkey = new PublicKey(formData.recipientAddress);

      // Derive the certificate PDA
      const [certificatePDA] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("certificate"),
          Buffer.from(certificateId)
        ],
        program.programId
      );

      console.log('Certificate PDA:', certificatePDA.toString());

      // Prepare dates as BN
      const issueDate = new anchor.BN(Math.floor(new Date(formData.issueDate).getTime() / 1000));
      const expiryDate = new anchor.BN(Math.floor(new Date(formData.expiryDate).getTime() / 1000));

      // Call the program method directly
      const tx = await program.methods
        .issueCertificate(
          certificateId,
          formData.title,
          formData.description,
          issueDate,
          expiryDate,
          '' // metadataUri
        )
        .accounts({
          certificate: certificatePDA,
          issuer: wallet.publicKey,
          recipient: recipientPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log('Transaction successful:', tx);
      setSuccess(`Certificate issued successfully! 
        Transaction: ${tx}
        Certificate PDA: ${certificatePDA.toString()}`);

      // Reset form
      setFormData({
        title: '',
        description: '',
        issueDate: '',
        expiryDate: '',
        recipientAddress: '',
        skills: [],
        issuerName: ''
      });

    } catch (err) {
      console.error('Alternative method failed:', err);

      let errorMessage = 'Failed to issue certificate';
      if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient SOL balance to pay for transaction fees';
      } else if (err.message.includes('Invalid public key')) {
        errorMessage = 'Invalid recipient wallet address';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show wallet connection UI if not connected
  if (!wallet.connected) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Issue Certificate</h2>
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-500 mb-6">
            Please connect your Solana wallet to issue certificates
          </p>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1147] via-[#120c32] to-[#000000] py-10 px-4">
      <motion.div
        className="max-w-3xl mx-auto p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          🪪 Issue Certificate
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-800/30 border border-red-500 text-red-300 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-800/20 border border-green-500 text-green-300 rounded whitespace-pre-line">
            <strong>Success:</strong> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Certificate Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={100}
              placeholder="e.g. Blockchain Developer"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              maxLength={500}
              rows={4}
              placeholder="Describe the certificate purpose..."
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Issue Date *</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Expiry Date *</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
            </div>
          </div>

          {/* Recipient Wallet */}
          <div>
            <label className="block text-sm font-semibold mb-1">Recipient Wallet Address *</label>
            <input
              type="text"
              name="recipientAddress"
              value={formData.recipientAddress}
              onChange={handleInputChange}
              required
              placeholder="Solana wallet address"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50"
            >
              {isLoading ? "Issuing..." : "Issue Certificate"}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleSubmitAlternative}
              disabled={isLoading}
              whileHover={{ scale: 1.03 }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 transition-colors px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50"
            >
              {isLoading ? "Issuing..." : "Alternative Method"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CertificateIssuanceForm;