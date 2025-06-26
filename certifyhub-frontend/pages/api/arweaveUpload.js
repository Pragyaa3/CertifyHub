// File: pages/api/arweaveUploadPdf.js
import { WebBundlr } from "@bundlr-network/client";
import { IncomingForm } from "formidable";
import fs from "fs";
import os from "os";
import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import { Keypair } from "@solana/web3.js";

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse file
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false, keepExtensions: true, uploadDir: os.tmpdir() });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      if (!files.file) return reject(new Error("No file uploaded"));
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      resolve(file);
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const file = await parseForm(req);
    const fileBuffer = await readFile(file.filepath);

    const keypairRaw = JSON.parse(readFileSync("./arweave/solana-keypair.json", "utf-8"));
    const secretKey = Uint8Array.from(keypairRaw);
    const solanaKeypair = Keypair.fromSecretKey(secretKey);

    const bundlr = new WebBundlr("https://devnet.bundlr.network", "solana", solanaKeypair, {
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    });

    await bundlr.ready();

    const price = await bundlr.getPrice(fileBuffer.length);
    await bundlr.fund(price);

    const tx = bundlr.createTransaction(fileBuffer, {
      tags: [{ name: "Content-Type", value: "application/pdf" }],
    });

    await tx.sign();
    await tx.upload();

    const uri = `https://arweave.net/${tx.id}`;
    return res.status(200).json({ success: true, uri });
  } catch (error) {
    console.error("PDF Upload Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
