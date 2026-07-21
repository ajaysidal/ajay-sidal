'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, Address } from 'viem';
import { USDC_CONTRACT, TREASURY_CONFIG } from '@/lib/monetization/treasury';
import { ClientWeb3Boundary } from '@/components/providers/ClientWeb3Boundary';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: (credits: number) => void;
}

type PaymentMethod = 'card' | 'crypto';
type CryptoCurrency = 'USDC' | 'MATIC';

const CREDIT_PACKAGES = [
  { amount: 1000, price: 10, bonus: 0, popular: false },
  { amount: 2500, price: 25, bonus: 250, popular: true },
  { amount: 5000, price: 50, bonus: 1000, popular: false },
  { amount: 10000, price: 100, bonus: 3000, popular: false },
];

/**
 * PaymentModal - Sovereign styled dual-rail payment component
 * Supports Stripe (Card) and MetaMask (USDC/MATIC) payments
 */
function PaymentModalInner({ isOpen, onClose, userId, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>('USDC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address: walletAddress } = useAccount();
  const { writeContract } = useWriteContract();
  const { data: txHash, isPending: isTxPending } = useWaitForTransactionReceipt();

  // Handle Stripe payment
  const handleCardPayment = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: selectedPackage.price * 100, // Convert to cents
          description: `MARZ Credits - ${selectedPackage.amount + selectedPackage.bonus} credits`,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsProcessing(false);
    }
  }, [userId, selectedPackage]);

  // Handle Crypto payment
  const handleCryptoPayment = useCallback(async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const amount = selectedPackage.price; // In USDC

      if (cryptoCurrency === 'USDC') {
        // USDC payment
        const treasuryAddress = TREASURY_CONFIG.HOT_WALLET_ADDRESS as Address;
        const usdcAmount = parseUnits(amount.toString(), USDC_CONTRACT.decimals);

        writeContract({
          address: USDC_CONTRACT.address as Address,
          abi: USDC_CONTRACT.abi,
          functionName: 'transfer',
          args: [treasuryAddress, usdcAmount],
        });
      } else {
        // MATIC payment (would need swap integration)
        // For now, just send MATIC to treasury
        const treasuryAddress = TREASURY_CONFIG.HOT_WALLET_ADDRESS as Address;
        // Implementation would use 0x/ParaSwap for auto-conversion
        throw new Error('MATIC payments coming soon. Please use USDC.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsProcessing(false);
    }
  }, [userId, selectedPackage, cryptoCurrency, walletAddress, writeContract]);

  // Verify crypto payment after transaction
  const verifyCryptoPayment = useCallback(async () => {
    if (!txHash) return;

    try {
      const response = await fetch('/api/payments/polygon/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: txHash,
          userId,
          expectedAmount: selectedPackage.price,
          currency: cryptoCurrency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      onSuccess?.(data.creditsAdded);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsProcessing(false);
    }
  }, [txHash, userId, selectedPackage, cryptoCurrency, onSuccess]);

  const handleClose = () => {
    setIsProcessing(false);
    setError(null);
    onClose();
  };

  const totalCredits = selectedPackage.amount + selectedPackage.bonus;
  const cryptoDiscount = method === 'crypto' ? selectedPackage.price * 0.98 : selectedPackage.price;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
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
              max-w-2xl 
              w-full 
              shadow-[0_0_50px_rgba(0,242,255,0.2)]
              relative
            "
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00f2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Sovereign Access</h3>
                  <p className="text-neutral-400 text-sm">Secure Transaction</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setMethod('card')}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${method === 'card'
                    ? 'border-[#00f2ff] bg-[#00f2ff]/10 shadow-[0_0_20px_rgba(0,242,255,0.3)]'
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-white font-bold text-sm">Credit Card</span>
                </div>
              </button>
              <button
                onClick={() => setMethod('crypto')}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${method === 'crypto'
                    ? 'border-[#00f2ff] bg-[#00f2ff]/10 shadow-[0_0_20px_rgba(0,242,255,0.3)]'
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-white font-bold text-sm">Crypto (USDC)</span>
                </div>
              </button>
            </div>

            {/* Credit Packages */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {CREDIT_PACKAGES.map((pkg) => (
                <button
                  key={pkg.amount}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all text-left
                    ${selectedPackage.amount === pkg.amount
                      ? 'border-[#00f2ff] bg-[#00f2ff]/10 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                      : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                    }
                  `}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 -right-2 bg-[#00f2ff] text-neutral-950 text-xs font-black px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <div className="text-[#00f2ff] font-black text-2xl">{pkg.amount.toLocaleString()}</div>
                  <div className="text-neutral-400 text-xs">credits</div>
                  {pkg.bonus > 0 && (
                    <div className="text-green-400 text-xs font-bold mt-1">+{pkg.bonus} BONUS</div>
                  )}
                  <div className="text-white font-bold mt-2">
                    ${method === 'crypto' ? pkg.price * 0.98 : pkg.price}
                    {method === 'crypto' && (
                      <span className="text-green-400 text-xs ml-1">(2% OFF)</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-400 text-sm">Credits</span>
                <span className="text-white font-bold">{totalCredits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-400 text-sm">Price</span>
                <span className="text-white font-bold">${cryptoDiscount}</span>
              </div>
              {method === 'crypto' && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-400 text-sm">Discount</span>
                  <span className="text-green-400 font-bold">-2%</span>
                </div>
              )}
              <div className="border-t border-neutral-700 mt-2 pt-2 flex justify-between items-center">
                <span className="text-white font-black">Total</span>
                <span className="text-[#00f2ff] font-black text-xl">${cryptoDiscount}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={method === 'card' ? handleCardPayment : handleCryptoPayment}
              disabled={isProcessing || isTxPending}
              className="
                w-full
                bg-[#00f2ff] 
                hover:bg-[#00e6f5] 
                text-neutral-950 
                px-6 
                py-4 
                rounded-xl 
                font-black 
                text-lg 
                transition-all 
                shadow-[0_0_20px_rgba(0,242,255,0.4)]
                hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isProcessing || isTxPending ? (
                <>
                  <span className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pay ${cryptoDiscount} - Get {totalCredits.toLocaleString()} Credits
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 mt-4 text-neutral-500 text-xs">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Protected
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PaymentModal(props: PaymentModalProps) {
  return (
    <ClientWeb3Boundary fallback={null}>
      <PaymentModalInner {...props} />
    </ClientWeb3Boundary>
  );
}
