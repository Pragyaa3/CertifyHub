"use client";

import certificates from "@/data/certificates";

export default function CertificateList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="bg-white rounded-2xl shadow-md p-4 border border-gray-200"
        >
          <h3 className="text-lg font-semibold">{cert.title}</h3>
          <p className="text-sm text-gray-600">Issued by: {cert.issuer}</p>
          <p className="text-sm text-gray-500">Date: {cert.issuedDate}</p>

          <div className="mt-4 flex gap-3">
            <a
              href={cert.arweaveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
            >
              View
            </a>
            <button
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
              onClick={() => alert(`Hash: ${cert.hash}`)}
            >
              Verify
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
