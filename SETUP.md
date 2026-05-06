# Complete Setup Guide - 3D Car Modification Platform

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [GitHub Configuration](#github-configuration)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Variables](#environment-variables)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd 3D-car

# Install dependencies using npm ci (clean install)
npm ci
```

### Step 2: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your credentials
# See "Environment Variables" section below
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Step 4: Verify Everything Works

```bash
# Run linting checks
npm run lint

# Run type checking
npx tsc --noEmit

# Build for production
npm run build

# Start production build locally
npm run start
```

---

## GitHub Configuration

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository with the name `3D-car`
3. **Do NOT** initialize with README (we already have one)

### Step 2: Push Code to GitHub

```bash
cd path/to/your/local/3D-car

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: 3D Car Modification Platform with zero issues config"

# Set main as default branch
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/3D-car.git

# Push code
git push -u origin main
```

### Step 3: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Make sure "Actions permissions" is set to **Allow all actions and reusable workflows**
4. Save changes

### Step 4: Configure Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** and add:

| Secret Name | Value | Source |
|------------|-------|--------|
| `VERCEL_TOKEN` | [Get from Vercel](https://vercel.com/account/tokens) | Vercel Settings |
| `VERCEL_ORG_ID` | From project settings | Vercel Dashboard |
| `VERCEL_PROJECT_ID` | From project settings | Vercel Dashboard |
| `MONGODB_URI` | MongoDB Atlas connection string | MongoDB Atlas |
| `JWT_SECRET` | Secure random string (min 32 chars) | Generate yourself |
| `FIREBASE_API_KEY` | From Firebase Console | Firebase Settings |
| `FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Firebase Settings |
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID | Firebase Settings |
| `FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Firebase Settings |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Firebase Settings |
| `FIREBASE_APP_ID` | App ID | Firebase Settings |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Same as FIREBASE_API_KEY | Firebase Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same as FIREBASE_AUTH_DOMAIN | Firebase Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Same as FIREBASE_PROJECT_ID | Firebase Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same as FIREBASE_STORAGE_BUCKET | Firebase Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same as FIREBASE_MESSAGING_SENDER_ID | Firebase Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same as FIREBASE_APP_ID | Firebase Settings |

### Step 5: Monitor GitHub Actions

1. Go to **Actions** tab in your repository
2. You should see CI/CD workflows running automatically
3. All checks must pass ✅ (green checkmarks)

---

## Vercel Deployment

### Step 1: Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up or log in (GitHub recommended)

### Step 2: Create Vercel Project

1. Click **Add New** → **Project**
2. Select **Import Git Repository**
3. Find and select your GitHub repository `3D-car`
4. Click **Import**

### Step 3: Configure Environment Variables

**IMPORTANT**: Vercel auto-detects Next.js, but you must add environment variables:

1. In the import dialog, click **Environment Variables**
2. Add all the secrets from GitHub (copy the values)
3. For **Production** environment, add:
   - All 14 environment variables listed above
   - Use MongoDB Atlas (not localhost)
   - Use secure JWT_SECRET

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (usually 2-5 minutes)
3. Visit your live site URL
4. Check deployment logs for any errors

### Step 5: Configure Production Domain

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your custom domain (optional)

### Step 6: Monitor Deployments

- **Preview Deployments**: Auto-created for every pull request
- **Production Deployments**: Auto-deployed from `main` branch
- Check **Deployments** tab for status

---

## Environment Variables

### Required Variables

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car-modification-platform

# JWT Secret (use strong random string, min 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-must-be-32-chars-min

# Firebase Backend Variables
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=1234567890
FIREBASE_APP_ID=1:1234567890:web:abcdef1234567890

# Firebase Client-Side Variables (must be NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef1234567890
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click Settings (⚙️) → **Project Settings**
4. Go to **Service Accounts** tab
5. Copy the credentials

### Getting MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database
3. Click **Connect**
4. Choose **Connect your application**
5. Copy the connection string
6. Replace `<password>` with your database password

### Generating JWT_SECRET

```bash
# Run this command to generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## CI/CD Pipeline

### Workflows Included

#### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- Runs on every push and pull request
- Tests:
  - ESLint (code quality)
  - TypeScript (type checking)
  - npm audit (security)
  - Full build test
- Status: **Must pass** to merge PR

#### 2. **Vercel Deploy** (`.github/workflows/vercel-deploy.yml`)
- Auto-deploys to Vercel on push to `main`
- Requires Vercel secrets configured
- Production deployments

#### 3. **CodeQL Security** (`.github/workflows/codeql.yml`)
- Runs weekly and on push/PR
- Scans for security vulnerabilities
- Reports to GitHub Security tab

### View Workflow Results

1. Go to **Actions** tab in GitHub
2. Click on workflow run
3. View logs for details
4. Click on job to see specific errors

---

## Troubleshooting

### Issue: Build Fails Locally

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json

# Fresh install
npm ci

# Try building again
npm run build
```

### Issue: ESLint Errors

**Solution:**
```bash
# Auto-fix errors
npm run lint -- --fix

# Check remaining errors
npm run lint
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Check TypeScript
npx tsc --noEmit

# Fix common issues
npm install --save-dev @types/node @types/react
```

### Issue: Vercel Deploy Fails

**Check:**
1. All environment variables are set in Vercel
2. MongoDB URI uses Atlas (not localhost)
3. Build completes locally: `npm run build`
4. No missing dependencies

### Issue: GitHub Actions Not Running

**Solution:**
1. Push to `main` or `develop` branch
2. Create a pull request
3. Check **Actions** tab for workflow status
4. Enable Actions in repository settings if needed

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: Module Not Found Error

**Solution:**
```bash
# Update dependencies
npm update

# Check package.json for typos
# Reinstall
npm ci
```

---

## Development Workflow

### Creating a Feature Branch

```bash
# Create and checkout feature branch
git checkout -b feature/amazing-feature

# Make changes
# Test locally
npm run lint
npm run build

# Commit changes
git add .
git commit -m "Add amazing feature"

# Push to GitHub
git push origin feature/amazing-feature
```

### Creating a Pull Request

1. Go to GitHub repository
2. Click **New Pull Request**
3. Set base: `main`, compare: `feature/amazing-feature`
4. Add description
5. Click **Create Pull Request**
6. Wait for CI/CD checks to pass ✅
7. Request review from team members
8. Merge when approved

---

## Performance Tips

### Optimize Bundle Size

```bash
# Check bundle size
npm run build

# Analyze bundle
npx next-bundle-analyzer
```

### Enable Image Optimization

Already configured in `next.config.ts`. Images are optimized automatically.

### Database Query Optimization

- Use indexes in MongoDB
- Implement caching where appropriate
- Use pagination for large datasets

---

## Security Best Practices

✅ **Already Configured:**
- Environment variables secured in `.env.local`
- JWT authentication implemented
- CORS headers configured
- Content Security Policy enabled
- CodeQL security scanning

**Additional Tips:**
- Never commit `.env.local` (included in `.gitignore`)
- Rotate secrets periodically
- Use strong passwords (min 16 characters)
- Enable 2FA on GitHub and Vercel
- Review GitHub Dependabot alerts

---

## Support

If you encounter issues:

1. Check [Next.js Documentation](https://nextjs.org/docs)
2. Check [Vercel Documentation](https://vercel.com/docs)
3. Review GitHub Issues in the repository
4. Contact the development team

---

**Status**: ✅ All Zero Issues Configured and Ready for Production
