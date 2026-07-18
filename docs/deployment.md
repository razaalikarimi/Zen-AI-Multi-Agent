# Deployment Guide

## Frontend - Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard:
   - VITE_FIREBASE_API_KEY
   - VITE_SERVER_URL (your production gateway URL)
   - VITE_RAZORPAY_KEY
4. Deploy

## Backend - Docker + Cloud

### Build all service images:
`bash
docker build -t zen-gateway ./backend/gateway
docker build -t zen-auth ./backend/services/auth
docker build -t zen-chat ./backend/services/chat
docker build -t zen-agent ./backend/services/agent
docker build -t zen-billing ./backend/services/billing
`

### AWS ECS / Railway / Render
- Deploy each service as a separate container
- Use a managed Redis service (Redis Cloud, AWS ElastiCache)
- Use MongoDB Atlas for databases

## Environment Tips
- Use AWS Secrets Manager for production secrets
- Enable CORS only for your frontend domain in production
- Set NODE_ENV=production in all services
