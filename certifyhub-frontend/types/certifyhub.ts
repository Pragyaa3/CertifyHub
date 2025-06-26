/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/certifyhub.json`.
 */
export type Certifyhub = {
  "address": "GFTKd92Uvq25Ne9jw7UaiPZPVWJ8Arpfx5H3suYfEnVA",
  "metadata": {
    "name": "certifyhub",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "issueCertificate",
      "discriminator": [
        61,
        197,
        55,
        28,
        159,
        18,
        132,
        128
      ],
      "accounts": [
        {
          "name": "certificate",
          "writable": true,
          "signer": true
        },
        {
          "name": "issuer",
          "writable": true,
          "signer": true
        },
        {
          "name": "recipient"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "certificateId",
          "type": "string"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "issueDate",
          "type": "i64"
        },
        {
          "name": "expiryDate",
          "type": "i64"
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "revokeCertificate",
      "discriminator": [
        236,
        5,
        130,
        119,
        9,
        164,
        130,
        122
      ],
      "accounts": [
        {
          "name": "certificate",
          "writable": true
        },
        {
          "name": "issuer",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "certificate",
      "discriminator": [
        202,
        229,
        222,
        220,
        116,
        20,
        74,
        67
      ]
    }
  ],
  "events": [
    {
      "name": "certificateIssued",
      "discriminator": [
        62,
        59,
        26,
        207,
        181,
        234,
        201,
        52
      ]
    },
    {
      "name": "certificateRevoked",
      "discriminator": [
        99,
        180,
        224,
        20,
        200,
        221,
        133,
        47
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to revoke this certificate."
    }
  ],
  "types": [
    {
      "name": "certificate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "certificateId",
            "type": "string"
          },
          {
            "name": "issuer",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "issueDate",
            "type": "i64"
          },
          {
            "name": "expiryDate",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "certificateStatus"
              }
            }
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "certificateIssued",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "certificateId",
            "type": "string"
          },
          {
            "name": "issuer",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "certificateRevoked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "certificateId",
            "type": "string"
          },
          {
            "name": "issuer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "certificateStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "valid"
          },
          {
            "name": "revoked"
          },
          {
            "name": "expired"
          }
        ]
      }
    }
  ]
};
