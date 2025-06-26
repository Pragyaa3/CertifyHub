// src/app/layout.js
import './globals.css'
import '@solana/wallet-adapter-react-ui/styles.css';
import WalletConnectionProvider from '../wallet/WalletConnectionProvider';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'CertifyHub',
  description: 'Decentralized Certificate Issuance & Verification',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletConnectionProvider>
           <NavBar />
          <main className="p-4">{children}</main>
        </WalletConnectionProvider>
      </body>
    </html>
  )
}
