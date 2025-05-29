'use client';

import CertificateRevocationForm from './CertificateRevocationForm';
import withRoleProtection from '@/components/hoc/withRoleProtection';
import { ISSUER_WALLETS } from '@/constants/roles';

function RevokePage() {
  return (
    <div>
      <CertificateRevocationForm />
    </div>
  );
}

export default withRoleProtection(RevokePage, ISSUER_WALLETS);
