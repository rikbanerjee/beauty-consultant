# Vercel Deployment Guide

This guide will help you deploy the Beauty Consultant application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: You'll need API keys for OpenAI and/or Gemini

## Environment Variables Setup

Before deploying, you need to set up the following environment variables in Vercel:

### Required Environment Variables

1. **OpenAI API Key** (if using OpenAI)
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. **Gemini API Key** (if using Gemini)
   - Name: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Optional Environment Variables

- `NODE_ENV`: Set to `production` for production deployment

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm run install-all`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the required API keys mentioned above

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add GEMINI_API_KEY
   ```

## Project Structure for Vercel

The application is configured with the following structure:

```
/
├── frontend/          # React application
├── backend/           # Node.js API
├── vercel.json        # Vercel configuration
├── package.json       # Root package.json
└── .vercelignore      # Files to exclude from deployment
```

## Configuration Files

### vercel.json
- Configures builds for both frontend and backend
- Routes API requests to the backend
- Routes all other requests to the frontend

### package.json
- Contains build scripts for Vercel
- Defines dependencies and scripts

## Post-Deployment

1. **Test the Application**:
   - Visit your deployed URL
   - Test image upload and analysis
   - Verify API endpoints are working

2. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain

3. **Environment Variables**:
   - Ensure all API keys are properly set
   - Test both OpenAI and Gemini providers

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are properly installed
   - Verify Node.js version (requires 18+)

2. **API Errors**:
   - Verify environment variables are set correctly
   - Check API key permissions and quotas

3. **CORS Issues**:
   - Ensure CORS is configured for your domain
   - Check that API routes are working

### Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first
4. Contact support if needed

## Security Notes

- Environment variables are encrypted in Vercel
- API keys are not exposed in client-side code
- The default prompt is stored securely in the backend
- File uploads use memory storage (no persistent files)

## Performance

- Frontend is statically generated
- Backend runs as serverless functions
- Images are processed in memory
- API responses are cached by Vercel

---

For more information, visit [vercel.com/docs](https://vercel.com/docs) 