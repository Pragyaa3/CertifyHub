'use client';

import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function ConnectWalletButton() {
  return (
    <div className="p-6 flex justify-center">
      <WalletMultiButtonDynamic className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded" />
    </div>
  );
}
