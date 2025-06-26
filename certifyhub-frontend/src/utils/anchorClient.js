import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, clusterApiUrl, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('Fv7C5tPk2cf8a1qPPEdoSS6BQAvechwsQGcyUgBw7oHM');
const network = clusterApiUrl('devnet');

const opts = {
  preflightCommitment: 'processed',
};

export function getProvider(wallet) {
  const connection = new Connection(network, opts.preflightCommitment);
  return new anchor.AnchorProvider(connection, wallet, opts);
}

// Add this function to check if your program exists
export async function checkProgramDeployment(connection, programId) {
  try {
    console.log('Checking program deployment for:', programId);
    const programAccount = await connection.getAccountInfo(new PublicKey(programId));
    
    if (!programAccount) {
      console.error('❌ Program not found on devnet');
      return false;
    }
    
    if (!programAccount.executable) {
      console.error('❌ Program account exists but is not executable');
      return false;
    }
    
    console.log('✅ Program found and executable');
    console.log('Program account:', {
      owner: programAccount.owner.toString(),
      lamports: programAccount.lamports,
      dataLength: programAccount.data.length,
      executable: programAccount.executable
    });
    
    return true;
  } catch (error) {
    console.error('Error checking program:', error);
    return false;
  }
}

// Simplified IDL without account definitions that cause issues
const SIMPLIFIED_IDL = {
  address: PROGRAM_ID.toString(),
  metadata: {
    name: "certifyhub",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Certificate management program"
  },
  instructions: [
    {
      name: "issueCertificate",
      discriminator: [61, 197, 55, 28, 159, 18, 132, 128],
      accounts: [
        {
          name: "certificate",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [99, 101, 114, 116, 105, 102, 105, 99, 97, 116, 101] // "certificate"
              },
              {
                kind: "arg",
                path: "certificateId"
              }
            ]
          }
        },
        {
          name: "issuer",
          writable: true,
          signer: true
        },
        {
          name: "recipient",
          writable: false
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111112"
        }
      ],
      args: [
        {
          name: "certificateId",
          type: "string"
        },
        {
          name: "title",
          type: "string"
        },
        {
          name: "description",
          type: "string"
        },
        {
          name: "issueDate",
          type: "i64"
        },
        {
          name: "expiryDate",
          type: "i64"
        },
        {
          name: "metadataUri",
          type: "string"
        }
      ]
    },
    {
      name: "revokeCertificate",
      discriminator: [236, 5, 130, 119, 9, 164, 130, 122],
      accounts: [
        {
          name: "certificate",
          writable: true
        },
        {
          name: "issuer",
          writable: true,
          signer: true
        }
      ],
      args: []
    }
  ],
  // Remove the accounts and types sections that cause validation issues
  types: [
    {
      name: "CertificateStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Valid"
          },
          {
            name: "Revoked"
          }
        ]
      }
    }
  ]
};

export function getProgram(provider) {
  try {
    console.log('Creating program with simplified IDL...');
    const program = new anchor.Program(SIMPLIFIED_IDL, provider);
    console.log('Program created successfully with simplified IDL');
    return program;
  } catch (error) {
    console.error("Error creating program with IDL:", error);
    console.log('Falling back to manual program implementation...');
    return createManualProgram(provider);
  }
}

// Enhanced manual program implementation
function createManualProgram(provider) {
  console.log('Using manual program implementation');
  
  return {
    methods: {
      issueCertificate: (certificateId, title, description, issueDate, expiryDate, metadataUri) => {
        return {
          accounts: (accounts) => {
            return {
              rpc: async () => {
                try {
                  console.log('Creating issue certificate instruction...');
                  const instruction = await createIssueCertificateInstruction(
                    accounts,
                    certificateId,
                    title,
                    description,
                    issueDate,
                    expiryDate,
                    metadataUri
                  );
                  
                  console.log('Creating transaction...');
                  const transaction = new Transaction().add(instruction);
                  
                  console.log('Sending transaction...');
                  const signature = await provider.sendAndConfirm(transaction);
                  console.log('Transaction signature:', signature);
                  return signature;
                } catch (error) {
                  console.error('Manual transaction failed:', error);
                  throw error;
                }
              }
            };
          }
        };
      }
    },
    account: {
      certificate: {
        fetch: async (publicKey) => {
          try {
            const accountInfo = await provider.connection.getAccountInfo(publicKey);
            if (!accountInfo) {
              throw new Error("Certificate account not found");
            }
            return deserializeCertificateAccount(accountInfo.data);
          } catch (error) {
            console.error('Error fetching certificate account:', error);
            throw error;
          }
        }
      }
    },
    programId: PROGRAM_ID,
    provider: provider
  };
}

// Enhanced instruction creation with better error handling
async function createIssueCertificateInstruction(
  accounts,
  certificateId,
  title,
  description,
  issueDate,
  expiryDate,
  metadataUri
) {
  try {
    console.log('Serializing instruction data...');
    
    // Instruction discriminator for issue_certificate
    const discriminator = Buffer.from([61, 197, 55, 28, 159, 18, 132, 128]);
    
    // Serialize arguments
    const certificateIdBuffer = serializeString(certificateId);
    const titleBuffer = serializeString(title);
    const descriptionBuffer = serializeString(description);
    const issueDateBuffer = serializeI64(issueDate);
    const expiryDateBuffer = serializeI64(expiryDate);
    const metadataUriBuffer = serializeString(metadataUri || "");
    
    const data = Buffer.concat([
      discriminator,
      certificateIdBuffer,
      titleBuffer,
      descriptionBuffer,
      issueDateBuffer,
      expiryDateBuffer,
      metadataUriBuffer
    ]);

    console.log('Instruction data serialized, length:', data.length);

    return new TransactionInstruction({
      keys: [
        { pubkey: accounts.certificate, isSigner: false, isWritable: true },
        { pubkey: accounts.issuer, isSigner: true, isWritable: true },
        { pubkey: accounts.recipient, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
      ],
      programId: PROGRAM_ID,
      data: data,
    });
  } catch (error) {
    console.error('Error creating instruction:', error);
    throw error;
  }
}

// Improved serialization functions with validation
function serializeString(str) {
  if (typeof str !== 'string') {
    throw new Error(`Expected string, got ${typeof str}: ${str}`);
  }
  
  const encoded = Buffer.from(str, 'utf8');
  const length = Buffer.allocUnsafe(4);
  length.writeUInt32LE(encoded.length, 0);
  return Buffer.concat([length, encoded]);
}

function serializeI64(num) {
  try {
    // Convert to number first
    let numericValue;
    if (typeof num === 'number') {
      numericValue = num;
    } else if (num && typeof num.toNumber === 'function') {
      // Handle anchor.BN
      numericValue = num.toNumber();
    } else if (typeof num === 'bigint') {
      numericValue = Number(num);
    } else {
      numericValue = Number(num.toString());
    }
    
    if (isNaN(numericValue)) {
      throw new Error(`Invalid number: ${num}`);
    }
    
    // Create buffer for i64 (8 bytes)
    const buffer = Buffer.allocUnsafe(8);
    
    // Handle negative numbers properly
    if (numericValue >= 0) {
      // Positive number
      const low = Math.floor(numericValue % 0x100000000);
      const high = Math.floor(numericValue / 0x100000000);
      buffer.writeUInt32LE(low, 0);
      buffer.writeUInt32LE(high, 4);
    } else {
      // Negative number - use two's complement
      const positiveValue = Math.abs(numericValue);
      const low = Math.floor(positiveValue % 0x100000000);
      const high = Math.floor(positiveValue / 0x100000000);
      
      // Two's complement
      let complementLow = (~low + 1) >>> 0;
      let complementHigh = (~high + (complementLow === 0 ? 1 : 0)) >>> 0;
      
      buffer.writeUInt32LE(complementLow, 0);
      buffer.writeUInt32LE(complementHigh, 4);
    }
    
    return buffer;
  } catch (error) {
    console.error('Error serializing i64:', error);
    throw new Error(`Failed to serialize i64: ${error.message}`);
  }
}

// Simplified certificate account deserialization
function deserializeCertificateAccount(data) {
  try {
    // Basic validation
    if (!data || data.length < 8) {
      throw new Error('Invalid account data');
    }
    
    // For now, return mock data structure
    // In production, implement proper Borsh deserialization
    return {
      certificateId: "certificate-id",
      issuer: new PublicKey("11111111111111111111111111111111"),
      recipient: new PublicKey("11111111111111111111111111111111"),
      title: "Certificate Title",
      description: "Certificate Description",
      issueDate: new anchor.BN(Math.floor(Date.now() / 1000)),
      expiryDate: new anchor.BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60),
      status: { valid: {} },
      metadataUri: ""
    };
  } catch (error) {
    console.error('Deserialization error:', error);
    throw new Error(`Failed to deserialize certificate account: ${error.message}`);
  }
}

// Utility function to derive certificate PDA
export function getCertificatePDA(certificateId) {
  try {
    const [certificatePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("certificate"),
        Buffer.from(certificateId)
      ],
      PROGRAM_ID
    );
    return certificatePDA;
  } catch (error) {
    console.error('Error deriving PDA:', error);
    throw new Error(`Failed to derive certificate PDA: ${error.message}`);
  }
}

// Enhanced certificate issuance function with better error handling
export async function issueCertificate(
  program,
  certificateId,
  recipientPubkey,
  title,
  description,
  issueDate,
  expiryDate,
  metadataUri = ""
) {
  try {
    console.log('Starting certificate issuance...');
    
    // Validate inputs
    if (!certificateId || typeof certificateId !== 'string') {
      throw new Error('Invalid certificate ID');
    }
    
    if (!recipientPubkey || !recipientPubkey.toBase58) {
      throw new Error('Invalid recipient public key');
    }
    
    if (!title || typeof title !== 'string') {
      throw new Error('Invalid title');
    }
    
    if (!description || typeof description !== 'string') {
      throw new Error('Invalid description');
    }
    
    const certificatePDA = getCertificatePDA(certificateId);
    
    console.log('Certificate issuance parameters:', {
      certificateId,
      recipientPubkey: recipientPubkey.toString(),
      title: title.substring(0, 50) + (title.length > 50 ? '...' : ''),
      description: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
      issueDate: issueDate.toString(),
      expiryDate: expiryDate.toString(),
      certificatePDA: certificatePDA.toString(),
      metadataUri
    });
    
    // Check if program has the methods property (IDL-based)
    if (program.methods && program.methods.issueCertificate) {
      console.log('Using IDL-based program method...');
      const tx = await program.methods
        .issueCertificate(
          certificateId,
          title,
          description,
          issueDate,
          expiryDate,
          metadataUri
        )
        .accounts({
          certificate: certificatePDA,
          issuer: program.provider.wallet.publicKey,
          recipient: recipientPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log('Certificate issued successfully via IDL:', tx);
      return { tx, certificatePDA };
    } else {
      console.log('Using manual program method...');
      const tx = await program.methods.issueCertificate(
        certificateId,
        title,
        description,
        issueDate,
        expiryDate,
        metadataUri
      ).accounts({
        certificate: certificatePDA,
        issuer: program.provider.wallet.publicKey,
        recipient: recipientPubkey,
        systemProgram: SystemProgram.programId,
      }).rpc();
      
      console.log('Certificate issued successfully via manual method:', tx);
      return { tx, certificatePDA };
    }
  } catch (error) {
    console.error('Error in issueCertificate:', error);
    
    // Provide more specific error messages
    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient SOL balance to pay for transaction fees');
    } else if (error.message.includes('Invalid public key')) {
      throw new Error('Invalid recipient wallet address');
    } else if (error.message.includes('blockhash')) {
      throw new Error('Transaction expired due to blockhash timeout. Please try again.');
    } else if (error.message.includes('0x1')) {
      throw new Error('Program error: Invalid instruction data or account setup');
    } else if (error.message.includes('0x0')) {
      throw new Error('Program error: Account already exists or invalid state');
    }
    
    throw error;
  }
}

// Utility function to check if certificate exists
export async function certificateExists(provider, certificateId) {
  try {
    const certificatePDA = getCertificatePDA(certificateId);
    const accountInfo = await provider.connection.getAccountInfo(certificatePDA);
    return accountInfo !== null;
  } catch (error) {
    console.error('Error checking certificate existence:', error);
    return false;
  }
}

// Utility function to get certificate account info
export async function getCertificateInfo(provider, certificateId) {
  try {
    const certificatePDA = getCertificatePDA(certificateId);
    const accountInfo = await provider.connection.getAccountInfo(certificatePDA);
    
    if (!accountInfo) {
      throw new Error('Certificate not found');
    }
    
    return {
      address: certificatePDA,
      data: accountInfo.data,
      owner: accountInfo.owner,
      lamports: accountInfo.lamports
    };
  } catch (error) {
    console.error('Error getting certificate info:', error);
    throw error;
  }
}

// Enhanced certificate revocation function with support for IDL/manual mode
export async function revokeCertificate(program, certificateId) {
  try {
    console.log("Starting certificate revocation...");
    const certificatePDA = getCertificatePDA(certificateId);

    // Check if program uses IDL method
    if (program.methods && program.methods.revokeCertificate) {
      console.log("Using IDL-based revocation method...");
      const tx = await program.methods
        .revokeCertificate()
        .accounts({
          certificate: certificatePDA,
          issuer: program.provider.wallet.publicKey,
        })
        .rpc();

      console.log("✅ Certificate revoked via IDL:", tx);
      return { tx, certificatePDA };
    } else {
      console.log("Using manual revocation method...");

      const discriminator = Buffer.from([236, 5, 130, 119, 9, 164, 130, 122]); // from your IDL

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: certificatePDA, isSigner: false, isWritable: true },
          { pubkey: program.provider.wallet.publicKey, isSigner: true, isWritable: true }
        ],
        programId: PROGRAM_ID,
        data: discriminator
      });

      const transaction = new Transaction().add(instruction);
      const tx = await program.provider.sendAndConfirm(transaction);

      console.log("✅ Certificate revoked via manual method:", tx);
      return { tx, certificatePDA };
    }
  } catch (error) {
    console.error("❌ Error in revokeCertificate:", error);
    throw error;
  }
}
