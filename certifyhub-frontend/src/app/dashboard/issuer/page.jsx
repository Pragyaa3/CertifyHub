'use client';

import IssuerDashboard from './IssuerDashboard';
import withRoleProtection from '@/components/hoc/withRoleProtection';
import { ISSUER_WALLETS } from '@/constants/roles';

const ProtectedIssuerDashboard = withRoleProtection(IssuerDashboard, ISSUER_WALLETS);

export default function Page() {
  return <ProtectedIssuerDashboard />;
}
