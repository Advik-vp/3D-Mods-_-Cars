<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-v9-blue?style=for-the-badge&logo=react" alt="React Three Fiber" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <br />
  <br />
  
  <h1>🏎️ 3D Car Modification Studio</h1>
  <p><strong>A Next-Generation Web Platform for Immersive 3D Vehicle Customization</strong></p>

  [![CI/CD Pipeline](https://github.com/Advik-vp/3D-Mods-_-Cars/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Advik-vp/3D-Mods-_-Cars/actions)
  [![Vercel Deploy](https://github.com/Advik-vp/3D-Mods-_-Cars/actions/workflows/vercel-deploy.yml/badge.svg)](https://github.com/Advik-vp/3D-Mods-_-Cars/actions)
  [![CodeQL](https://github.com/Advik-vp/3D-Mods-_-Cars/actions/workflows/codeql.yml/badge.svg)](https://github.com/Advik-vp/3D-Mods-_-Cars/actions)
</div>

---

## 🌟 Overview

The **3D Car Modification Studio** is a state-of-the-art web application built with **Next.js** and **React Three Fiber**. It allows users to seamlessly design, customize, and view high-fidelity 3D car models in real-time right from their browsers!

Whether you want to visualize a new carbon-fiber spoiler, preview aftermarket alloy wheels, or test a custom paint job on a Koenigsegg or Ferrari, this platform provides an unmatched immersive experience.

## ✨ Key Features

- 🏎️ **High-Fidelity 3D Models:** Native integration of premium models like the **Ferrari 458 Italia** and **Koenigsegg Agera**.
- 🎨 **Dynamic Material Painting:** Uses `MeshPhysicalMaterial` and real-time color syncing for photorealistic car paint finishes with custom clearcoats.
- 🏙️ **HDRI Lighting & Reflections:** Integrated `@react-three/drei` Environment maps for ultra-realistic studio and city reflections.
- 🛍️ **Sketchfab Integration:** Instant access to an expansive library of community-driven real car models.
- 🛡️ **Zero-Issues Architecture:** Fully typed with TypeScript, linted with ESLint, and secured with GitHub CodeQL.
- ⚡ **Automated CI/CD:** Fully automated testing, linting, and deployment pipeline to Vercel via GitHub Actions.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and `npm`
- **MongoDB** (Local or MongoDB Atlas cluster)
- **Firebase** Project Credentials

### 1. Clone & Install
```bash
git clone https://github.com/Advik-vp/3D-Mods-_-Cars.git
cd 3D-Mods-_-Cars
npm ci
```

### 2. Configure Environment
Create a `.env.local` file by copying the example template:
```bash
cp .env.example .env.local
```
Update the newly created `.env.local` with your MongoDB URI, Firebase keys, and JWT secrets.

### 3. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the studio!

---

## 📁 Project Structure

```text
├── src/
│   ├── app/              # Next.js App Router Pages & API
│   ├── components/       # 3D Viewers (GLTF/OBJ) & UI Components
│   ├── lib/              # Core Constants & DB connections
│   ├── models/           # Mongoose Database Schemas
│   └── services/         # 3D Model Loading Services
├── public/               # Static Assets (HDRIs, GLB, OBJ models)
├── .github/workflows/    # CI/CD pipelines (Lint, Build, CodeQL, Vercel)
└── vercel.json           # Deployment configurations
```

## 🛠️ Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind/Vanilla CSS
- **3D Engine:** Three.js, React Three Fiber, React Three Drei
- **Backend:** Node.js, Next.js API Routes
- **Database:** MongoDB (via Mongoose)
- **Auth:** Firebase Authentication, NextAuth
- **DevOps:** GitHub Actions, Vercel, CodeQL

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
2. Ensure Code Quality: `npm run lint` & `npm run build`
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

<div align="center">
  <i>Built with passion for car enthusiasts and 3D developers.</i>
</div>
