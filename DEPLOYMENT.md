# Deployment Guide: 3D Car Modification Platform

This application is built tightly with **Next.js App Router** and native API routes, making it perfectly optimized for deployment on Vercel without needing a standalone Express repository or complex DevOps flows.

## 1. Local Testing
Before deploying, test the full production build locally:
1. Ensure your MongoDB instance is running.
2. Ensure you have copied the contents of this project into your workspace.
3. Configure your local `.env.local` file with:
   `MONGODB_URI="mongodb://localhost:27017/car-modification-platform"`
   `JWT_SECRET="your-secure-jwt-secret"`
4. Run: `npm run build`
5. Run: `npm run start` and visit `http://localhost:3000`

## 2. Pushing to GitHub
Vercel seamlessly deploys directly from your GitHub repository.
1. Initialize git in your project directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for 3D Car Mod Platform"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Link your local repo to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## 3. Deploying to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import the GitHub repository you just created.
4. **Environment Variables Configuration (Crucial):**
   In the Environment Variables section before deploying, you MUST add:
   - `MONGODB_URI` : A completely public/cloud MongoDB connection string (e.g., from MongoDB Atlas). Localhost URIs will not work on Vercel's Edge/Serverless platform.
   - `JWT_SECRET` : A secure, long random string for JSON Web Token encryption.
5. Click **Deploy**. Vercel will automatically detect Next.js and build it flawlessly.

Your premium 3D vehicle platform is now live!
