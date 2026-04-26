# 🚗 AI 3D Car Modification Studio - Quick Setup Guide

## ✅ Installation Complete!

Your complete AI 3D Car Modification Studio is ready. Follow these steps to get started:

---

## 📋 Step 1: Initial Setup (2 minutes)

### 1.1 Install Dependencies
```bash
cd AI-Car-Modification-Studio
npm install
```

This will install the required npm packages (Three.js, Live Server, etc.)

---

## 🎮 Step 2: Run Locally (Choose One Method)

### Method A: VS Code Live Server (⭐ Recommended)
1. Open the project folder in VS Code:
   ```bash
   code AI-Car-Modification-Studio
   ```

2. Install VS Code Extension:
   - Press `Ctrl+Shift+X` (Cmd+Shift+X on Mac)
   - Search for "Live Server"
   - Install by Ritwick Dey

3. Start the server:
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Browser opens at `http://127.0.0.1:5500`

### Method B: npm Script
```bash
npm run dev
# Opens at http://localhost:8000
```

### Method C: Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
# Opens at http://localhost:8000
```

---

## 🎨 Step 3: Test the Application

1. ✅ 3D Viewer loads with placeholder car model
2. ✅ Dashboard UI displays with sidebar, viewer, and control panel
3. ✅ Sliders work for transformations
4. ✅ AI prompt box is functional (demo mode)
5. ✅ All buttons responsive with glassmorphism effects

**Note**: The placeholder model will auto-rotate. Click and drag to manually rotate.

---

## 🔗 Step 4: GitHub Setup

### 4.1 Create GitHub Repository
1. Go to https://github.com/new
2. Create repository: `AI-Car-Modification-Studio`
3. Choose `Public` visibility
4. **Do NOT** add README, .gitignore, license yet (we have these)

### 4.2 Push to GitHub
```bash
cd AI-Car-Modification-Studio

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - AI Car Modification Studio"

# Rename branch to main
git branch -M main

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/AI-Car-Modification-Studio.git

# Push to GitHub
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## 🚀 Step 5: Deploy to Vercel

### 5.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 5.2 Login to Vercel
```bash
vercel login
```

This opens a browser to authenticate with your Vercel account.

### 5.3 Deploy
```bash
# Deploy to staging (gets a unique URL)
vercel

# Deploy to production (uses your domain)
vercel --prod
```

**✅ Your app is live!**

---

## 📝 Step 6: Customization

### 6.1 Update Project Information

Edit `package.json`:
```json
{
  "name": "ai-car-modification-studio",
  "author": "Your Name",
  "description": "Your custom description",
  "version": "1.0.0"
}
```

### 6.2 Add Your Car Models

1. Find or create GLTF/GLB car models
2. Place them in `public/models/`
3. Update model URLs in the application
4. Example: `/models/my-car.gltf`

### 6.3 Connect to AI Service

Create `.env` file:
```env
AI_API_ENDPOINT=https://your-api.com/ai-design
```

Then update `src/scripts/aiGenerator.js` to use your real API.

### 6.4 Customize Colors/Theme

Edit `src/styles/variables.css`:
```css
:root {
  --primary: #00d9ff;      /* Cyan */
  --secondary: #ff006e;    /* Pink */
  --accent: #ffbe0b;       /* Yellow */
  --dark-bg: #0a0e27;      /* Dark blue */
}
```

---

## 📂 Project Structure Summary

```
AI-Car-Modification-Studio/
├── public/models/          ← Add your .gltf/.glb files here
├── src/
│   ├── scripts/            ← Core JavaScript modules
│   ├── styles/             ← CSS stylesheets
│   └── main.js             ← App entry point
├── index.html              ← HTML entry point
├── package.json            ← Dependencies
├── vercel.json             ← Deployment config
├── .gitignore              ← Git ignore rules
└── README.md               ← Full documentation
```

---

## 🎯 Key Files Reference

| File | Purpose |
|------|---------|
| `index.html` | Dashboard UI & layout |
| `src/main.js` | Application initialization & event handling |
| `src/scripts/threeViewer.js` | 3D scene management |
| `src/scripts/modelLoader.js` | GLTF/GLB model loading |
| `src/scripts/aiGenerator.js` | AI design generation |
| `src/styles/variables.css` | Design tokens & colors |
| `src/styles/glass-ui.css` | Component styles |
| `src/styles/dashboard.css` | Layout & responsive |
| `vercel.json` | Vercel deployment config |
| `.gitignore` | Git ignore patterns |

---

## 🔥 Features to Try

- **3D Rotation**: Click and drag the canvas
- **Zoom**: Scroll with mouse wheel
- **Transform**: Use sliders on the right panel
- **AI Prompts**: Type modifications in the AI box
- **Presets**: Try Racing, Luxury, Futuristic, Classic
- **Reset**: Click reset button to restore view
- **Export**: Download model or screenshot

---

## 🆘 Troubleshooting

### "Canvas not rendering"
→ Check browser console (F12) for errors
→ Ensure hardware acceleration is enabled

### "Models not loading"
→ Check file paths in `src/main.js`
→ Verify GLTF/GLB format compatibility

### "VS Code Live Server won't start"
→ Install extension (Ctrl+Shift+X, search "Live Server")
→ Restart VS Code

### "npm install fails"
→ Make sure Node.js 16+ is installed
→ Delete `node_modules/` and try again

---

## 📊 Next Steps

1. ✅ **Local Testing** (Step 2)
2. ✅ **GitHub Setup** (Step 4)
3. ✅ **Deploy to Vercel** (Step 5)
4. 📝 **Add Car Models** (Step 6.2)
5. 📝 **Connect AI Service** (Step 6.3)
6. 📝 **Share Live URL** with others!

---

## 🎓 Learning Resources

- **Three.js**: https://threejs.org/docs/
- **Glassmorphism**: https://hype4.academy/articles/design/glassmorphism
- **WebGL**: https://www.khronos.org/webgl/
- **Vercel Docs**: https://vercel.com/docs

---

## 🎉 You're All Set!

Your AI 3D Car Modification Studio is ready to use:

✅ **Local Development**: VS Code Live Server
✅ **Version Control**: GitHub
✅ **Deployment**: Vercel (automatic updates)
✅ **Scalability**: Ready for backend API integration
✅ **Modern UI**: Glassmorphism design
✅ **3D Graphics**: Three.js powered

**Happy designing! 🚗✨**

---

For detailed documentation, see [README.md](README.md)
