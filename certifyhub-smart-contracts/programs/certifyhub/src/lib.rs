use anchor_lang::prelude::*;

declare_id!("Fv7C5tPk2cf8a1qPPEdoSS6BQAvechwsQGcyUgBw7oHM");

#[program]
pub mod certifyhub {
    use super::*;

    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        certificate_id: String,
        title: String,
        description: String,
        issue_date: i64,
        expiry_date: i64,
        metadata_uri: String,
    ) -> Result<()> {
        let cert = &mut ctx.accounts.certificate;
        cert.certificate_id = certificate_id;
        cert.issuer = *ctx.accounts.issuer.key;
        cert.recipient = *ctx.accounts.recipient.key;
        cert.title = title;
        cert.description = description;
        cert.issue_date = issue_date;
        cert.expiry_date = expiry_date;
        cert.status = CertificateStatus::Valid;
        cert.metadata_uri = metadata_uri;

        emit!(CertificateIssued {
            certificate_id: cert.certificate_id.clone(),
            issuer: cert.issuer,
            recipient: cert.recipient,
        });

        Ok(())
    }

    pub fn revoke_certificate(ctx: Context<RevokeCertificate>) -> Result<()> {
        let cert = &mut ctx.accounts.certificate;
        require_keys_eq!(cert.issuer, *ctx.accounts.issuer.key, CertifyHubError::Unauthorized);
        cert.status = CertificateStatus::Revoked;

        emit!(CertificateRevoked {
            certificate_id: cert.certificate_id.clone(),
            issuer: cert.issuer,
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CertificateStatus {
    Valid,
    Revoked,
    Expired,
}

#[account]
pub struct Certificate {
    pub certificate_id: String,
    pub issuer: Pubkey,
    pub recipient: Pubkey,
    pub title: String,
    pub description: String,
    pub issue_date: i64,
    pub expiry_date: i64,
    pub status: CertificateStatus,
    pub metadata_uri: String,
}

#[event]
pub struct CertificateIssued {
    pub certificate_id: String,
    pub issuer: Pubkey,
    pub recipient: Pubkey,
}

#[event]
pub struct CertificateRevoked {
    pub certificate_id: String,
    pub issuer: Pubkey,
}

#[derive(Accounts)]
#[instruction(certificate_id: String)]
pub struct IssueCertificate<'info> {
    #[account(
        init,
        payer = issuer,
        space = 8 + 512,
        seeds = [b"certificate", certificate_id.as_bytes()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(mut)]
    pub issuer: Signer<'info>,

    /// CHECK: not validated
    pub recipient: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeCertificate<'info> {
    #[account(mut)]
    pub certificate: Account<'info, Certificate>,

    #[account(mut)]
    pub issuer: Signer<'info>,
}

#[error_code]
pub enum CertifyHubError {
    #[msg("You are not authorized to revoke this certificate.")]
    Unauthorized,
}
