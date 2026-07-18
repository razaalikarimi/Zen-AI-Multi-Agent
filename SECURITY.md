# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in Zen AI, please do NOT open a public issue.

Instead, email: security@zenai.dev

We will respond within 48 hours and work with you to resolve the issue responsibly.

## Security Best Practices for Self-Hosting

- Never commit .env files to version control
- Rotate API keys regularly (Gemini, Groq, Razorpay)
- Use HTTPS in production
- Store secrets in AWS Secrets Manager or HashiCorp Vault
- Keep all dependencies updated
