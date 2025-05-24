'use client';

import { useState } from 'react';

export default function CertificateVerificationForm() {
  const [certificateId, setCertificateId] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert('Verification form submitted! (functionality not implemented yet)');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Verify Certificate</h2>

      <input
        type="text"
        name="certificateId"
        placeholder="Enter Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
        required
        className="input"
      />

      <button type="submit" className="btn-primary">Verify</button>
    </form>
  );
}
