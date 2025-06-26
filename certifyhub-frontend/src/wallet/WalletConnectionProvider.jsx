'use client'; // If using Next.js App Router

import { FC, useMemo } from 'react';
import {
    ConnectionProvider,
    WalletProvider
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const WalletConnectionProvider = ({ children }) => {
    const network = 'devnet'; // or 'mainnet-beta'

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [
        new PhantomWalletAdapter()
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletConnectionProvider;
