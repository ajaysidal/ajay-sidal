'use client';

import { useState, useCallback } from 'react';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CreateWalletButton - Generates an EOA (Externally Owned Account) using viem
 * Implements secure client-side private key generation with recovery phrase download
 */
export function CreateWalletButton() {
  const [isCreating, setIsCreating] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [walletData, setWalletData] = useState<{
    address: string;
    privateKey: string;
    mnemonic?: string;
  } | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const generateWallet = useCallback(async () => {
    setIsCreating(true);
    setDownloadComplete(false);

    try {
      // Generate a new private key (client-side only - never sent to server)
      const privateKey = generatePrivateKey();
      const account = privateKeyToAccount(privateKey);

      // Store wallet data temporarily for recovery phrase download
      setWalletData({
        address: account.address,
        privateKey,
      });

      // Show recovery phrase modal
      setShowRecovery(true);
    } catch (error) {
      console.error('Failed to generate wallet:', error);
    } finally {
      setIsCreating(false);
    }
  }, []);

  const downloadRecoveryPhrase = useCallback(() => {
    if (!walletData) return;

    // Create a secure recovery document
    const recoveryContent = `
=====================================
MARZ NETWORK - WALLET RECOVERY PHRASE
=====================================

⚠️  SECURITY WARNING ⚠️
This document contains your PRIVATE KEY.
NEVER share this with anyone.
Store this file in a secure, offline location.

=====================================
WALLET ADDRESS
=====================================
${walletData.address}

=====================================
PRIVATE KEY
=====================================
${walletData.privateKey}

=====================================
INSTRUCTIONS
=====================================
1. Import this private key into your preferred wallet
2. Delete this file from your device after securing backup
3. NEVER share your private key with anyone
4. MARZ Network team will NEVER ask for this information

Generated: ${new Date().toISOString()}
=====================================
    `.trim();

    // Create and download the file
    const blob = new Blob([recoveryContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MARZ-Wallet-Recovery-${walletData.address.slice(0, 6)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadComplete(true);
  }, [walletData]);

  const closeRecoveryModal = useCallback(() => {
    setShowRecovery(false);
    // Clear sensitive data after modal is closed
    setTimeout(() => {
      setWalletData(null);
      setDownloadComplete(false);
    }, 300);
  }, []);

  return (
    <>
      <button
        onClick={generateWallet}
        disabled={isCreating}
        className="
          bg-gradient-to-r from-[#00f2ff]/20 to-[#00f2ff]/10 
          border border-[#00f2ff]/50 
          hover:border-[#00f2ff] 
          text-[#00f2ff] 
          px-8 
          py-3 
          rounded-lg 
          font-black 
          text-sm 
          transition-all 
          shadow-[0_0_15px_rgba(0,242,255,0.3)]
          hover:shadow-[0_0_25px_rgba(0,242,255,0.6)]
          hover:scale-105
          backdrop-blur-sm
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          flex items-center gap-2
        "
      >
        {isCreating ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Wallet
          </>
        )}
      </button>

      <AnimatePresence>
        {showRecovery && walletData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeRecoveryModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="
                bg-neutral-900/95 
                border border-[#00f2ff]/50 
                rounded-2xl 
                p-8 
                max-w-lg 
                w-full 
                shadow-[0_0_50px_rgba(0,242,255,0.2)]
                relative
              "
            >
              {/* Close button */}
              <button
                onClick={closeRecoveryModal}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#00f2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Secure Your Wallet
                </h3>
                <p className="text-neutral-400 text-sm">
                  Download your recovery phrase before proceeding
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-red-400 font-bold text-xs mb-1">
                      ⚠️ CRITICAL SECURITY WARNING
                    </p>
                    <p className="text-red-300/80 text-xs leading-relaxed">
                      This file contains your <strong>PRIVATE KEY</strong>. Never share it with anyone. 
                      Store it offline in a secure location. MARZ Network team will NEVER ask for this.
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet Address Preview */}
              <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 mb-6">
                <p className="text-neutral-400 text-xs uppercase tracking-tight mb-2">Wallet Address</p>
                <p className="text-[#00f2ff] font-mono text-sm break-all">
                  {walletData.address}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={downloadRecoveryPhrase}
                  className="
                    w-full
                    bg-[#00f2ff] 
                    hover:bg-[#00e6f5] 
                    text-neutral-950 
                    px-6 
                    py-3 
                    rounded-lg 
                    font-black 
                    text-sm 
                    transition-all 
                    shadow-[0_0_20px_rgba(0,242,255,0.4)]
                    hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]
                    flex items-center justify-center gap-2
                  "
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {downloadComplete ? 'Downloaded!' : 'Download Recovery Phrase'}
                </button>

                <button
                  onClick={closeRecoveryModal}
                  disabled={!downloadComplete}
                  className="
                    w-full
                    bg-neutral-800 
                    hover:bg-neutral-700 
                    text-white 
                    px-6 
                    py-3 
                    rounded-lg 
                    font-bold 
                    text-sm 
                    transition-all
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {downloadComplete ? 'I\'ve Secured My Backup - Close' : 'Download First to Continue'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
