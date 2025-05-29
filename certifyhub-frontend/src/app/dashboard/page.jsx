'use client';

import RecipientDashboard from './RecipientDashboard';
import withRoleProtection from '@/components/hoc/withRoleProtection';
import { RECIPIENT_WALLETS } from '@/constants/roles';

function DashboardPage() {
  return (
    <div>
      <RecipientDashboard />
    </div>
  );
}

export default withRoleProtection(DashboardPage, RECIPIENT_WALLETS);
