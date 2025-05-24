'use client';

import { useState } from 'react';

export default function CertificateIssuanceForm() {
  const [form, setForm] = useState({
    recipientName: '',
    recipientEmail: '',
    certificateTitle: '',
    certificateDescription: '',
    issueDate: '',
    expiryDate: '',
    certificateId: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Form submitted! (functionality not implemented yet)');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Issue Certificate</h2>

      <input
        type="text"
        name="recipientName"
        placeholder="Recipient Name"
        value={form.recipientName}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="email"
        name="recipientEmail"
        placeholder="Recipient Email (optional)"
        value={form.recipientEmail}
        onChange={handleChange}
        className="input"
      />

      <input
        type="text"
        name="certificateTitle"
        placeholder="Certificate Title"
        value={form.certificateTitle}
        onChange={handleChange}
        required
        className="input"
      />

      <textarea
        name="certificateDescription"
        placeholder="Certificate Description"
        value={form.certificateDescription}
        onChange={handleChange}
        className="input h-24"
      />

      <input
        type="date"
        name="issueDate"
        placeholder="Issue Date"
        value={form.issueDate}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="date"
        name="expiryDate"
        placeholder="Expiry Date (optional)"
        value={form.expiryDate}
        onChange={handleChange}
        className="input"
      />

      <input
        type="text"
        name="certificateId"
        placeholder="Certificate ID"
        value={form.certificateId}
        onChange={handleChange}
        required
        className="input"
      />

      <button type="submit" className="btn-primary">Issue Certificate</button>
    </form>
  );
}
