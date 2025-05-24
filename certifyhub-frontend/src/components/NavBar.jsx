'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex space-x-6">
      <Link href="/dashboard" className="hover:underline">Dashboard</Link>
      <Link href="/issue" className="hover:underline">Issue</Link>
      <Link href="/revoke" className="hover:underline">Revoke</Link>
      <Link href="/verify" className="hover:underline">Verify</Link>
    </nav>
  );
}
