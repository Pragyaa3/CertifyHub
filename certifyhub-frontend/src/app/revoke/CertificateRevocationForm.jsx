'use client';

import { useState } from 'react';

export default function CertificateRevocationForm() {
  const [form, setForm] = useState({
    certificateId: '',
    revocationReason: '',
    revocationDate: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Revocation form submitted! (functionality not implemented yet)');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Revoke Certificate</h2>

      <input
        type="text"
        name="certificateId"
        placeholder="Certificate ID"
        value={form.certificateId}
        onChange={handleChange}
        required
        className="input"
      />

      <textarea
        name="revocationReason"
        placeholder="Reason for Revocation"
        value={form.revocationReason}
        onChange={handleChange}
        required
        className="input h-24"
      />

      <input
        type="date"
        name="revocationDate"
        placeholder="Revocation Date"
        value={form.revocationDate}
        onChange={handleChange}
        required
        className="input"
      />

      <button type="submit" className="btn-primary">Revoke Certificate</button>
    </form>
  );
}
