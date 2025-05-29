'use client';

import CertificateIssuanceForm from './CertificateIssuanceForm';
import withRoleProtection from '@/components/hoc/withRoleProtection';
import { ISSUER_WALLETS } from '@/constants/roles';

function IssuePage() {
  return (
    <div>
      <CertificateIssuanceForm />
    </div>
  );
}

export default withRoleProtection(IssuePage, ISSUER_WALLETS);
