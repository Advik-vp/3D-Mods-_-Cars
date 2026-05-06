# 3D Car Modification Platform

A full-stack web application built with Next.js, React Three Fiber, and Firebase for designing and customizing 3D car models with AI-powered features.

## ✅ Zero Issues Configuration

This project is configured with:
- ✅ **ESLint & TypeScript**: Full type-safety and code quality checks
- ✅ **GitHub Actions**: Automated CI/CD pipeline with security scanning
- ✅ **Vercel Deployment**: Optimized production builds and preview deployments
- ✅ **CodeQL**: Security analysis integrated into workflows
- ✅ **Environment Validation**: Proper configuration and secrets management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Firebase project credentials

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd 3D-car
   npm ci
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Run Code Quality Checks**
   ```bash
   npm run lint
   npm run build  # Full production build test
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   └── styles/           # Global styles
├── public/               # Static assets
├── .github/workflows/    # GitHub Actions CI/CD
├── vercel.json          # Vercel deployment config
└── eslint.config.mjs    # Code quality rules
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

## 🌐 Deployment

### GitHub Setup
1. Create repository on GitHub
2. Push code: `git push -u origin main`
3. GitHub Actions workflows run automatically

### Vercel Deployment

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Framework: **Next.js** (auto-detected)

2. **Configure Secrets**
   ```
   Environment Variables:
   - MONGODB_URI (MongoDB Atlas connection string)
   - JWT_SECRET (secure random string, min 32 characters)
   - FIREBASE_API_KEY
   - FIREBASE_AUTH_DOMAIN
   - FIREBASE_PROJECT_ID
   - FIREBASE_STORAGE_BUCKET
   - FIREBASE_MESSAGING_SENDER_ID
   - FIREBASE_APP_ID
   - NEXT_PUBLIC_* versions for client-side vars
   ```

3. **Deploy**
   - Click "Deploy" - automatic builds from `main` branch
   - Preview deployments from pull requests

### GitHub Actions Secrets
Add these secrets to your GitHub repository settings:
- `VERCEL_TOKEN` (from [Vercel settings](https://vercel.com/account/tokens))
- `VERCEL_ORG_ID` (from Vercel project settings)
- `VERCEL_PROJECT_ID` (from Vercel project settings)
- All environment variables listed above

## ✨ CI/CD Workflows

### `.github/workflows/ci-cd.yml`
- Runs on every push and pull request
- Tests: ESLint, TypeScript, Build, Npm Audit
- Node versions: 18.x, 20.x
- Status: Must pass for merge

### `.github/workflows/vercel-deploy.yml`
- Auto-deploys to Vercel from main branch
- Requires Vercel secrets configured
- Production build quality gates

### `.github/workflows/codeql.yml`
- Weekly security analysis
- Automatic on push/PR to main
- Zero-tolerance for critical issues

## 🔍 Code Quality

### ESLint Configuration
- **Base**: `eslint-config-next/core-web-vitals`
- **TypeScript**: Full type checking enabled
- **Ignored**: AI-Car-Modification-Studio, cyberpunk-ui, public

Run checks:
```bash
npm run lint              # Check all files
npm run lint -- --fix    # Auto-fix issues
```

### TypeScript
- Strict mode enabled
- Generated: `next-env.d.ts`
- Check: `npx tsc --noEmit`

## 📚 Environment Variables

### Required for Production
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=very-secure-32-character-minimum-secret
FIREBASE_* credentials from Firebase Console
```

### See `.env.example` for complete list

## 🆘 Troubleshooting

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm ci
npm run build
```

### Lint Errors
```bash
npm run lint -- --fix  # Auto-fix
```

### Local MongoDB Issues
- Use MongoDB Atlas connection string instead of localhost
- Vercel doesn't support localhost connections

## 📖 Documentation

- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Setup Details**: See [SETUP.md](./SETUP.md)
- **Next.js Docs**: [nextjs.org](https://nextjs.org/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test: `npm run lint && npm run build`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Create Pull Request - CI/CD checks run automatically

## 📝 License

This project is licensed under the MIT License.

---

**Status**: ✅ Zero Issues | ✅ GitHub Actions Passing | ✅ Vercel Ready
