'use client';

import RecipientDashboard from './RecipientDashboard';
import withRoleProtection from '@/components/hoc/withRoleProtection';
import { RECIPIENT_WALLETS } from '@/constants/roles';

const ProtectedRecipientDashboard = withRoleProtection(RecipientDashboard, RECIPIENT_WALLETS);

export default function Page() {
  return <ProtectedRecipientDashboard />;
}
