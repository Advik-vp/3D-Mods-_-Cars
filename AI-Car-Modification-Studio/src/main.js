/* ===========================
   MAIN APPLICATION ENTRY POINT
   =========================== */

import ThreeViewer from './scripts/threeViewer.js';
import ModelLoader from './scripts/modelLoader.js';
import AIGenerator from './scripts/aiGenerator.js';

class DashboardApp {
  constructor() {
    this.viewer = null;
    this.modelLoader = null;
    this.aiGenerator = null;
    this.selectedModel = null;
    this.init();
  }

  init() {
    console.log('🚀 AI 3D Car Modification Studio - Initializing...');
    this.setupEventListeners();
    this.initializeViewer();
    this.loadModels();
  }

  setupEventListeners() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // AI Prompt Submit
    const aiSubmitBtn = document.getElementById('ai-submit-btn');
    if (aiSubmitBtn) {
      aiSubmitBtn.addEventListener('click', () => this.handleAIPrompt());
    }

    // Control sliders
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach((slider) => {
      slider.addEventListener('input', (e) => this.handleSliderChange(e));
    });

    // Model library items
    const modelItems = document.querySelectorAll('.model-item');
    modelItems.forEach((item) => {
      item.addEventListener('click', (e) => this.handleModelSelect(e));
    });

    // File upload for photo detection
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
    }
  }

  initializeViewer() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    this.viewer = new ThreeViewer(canvas);
    this.viewer.init();
    console.log('✅ Three.js Viewer initialized');

    // Start animation loop
    this.viewer.animate();
  }

  loadModels() {
    this.modelLoader = new ModelLoader();
    // Load sample model for demonstration
    this.modelLoader
      .loadModel('/models/sample-car.gltf')
      .then((model) => {
        this.viewer.addModel(model);
        console.log('✅ Sample car model loaded');
      })
      .catch((err) => {
        console.warn('Sample model not found, using placeholder:', err);
        // Create a placeholder model
        this.viewer.createPlaceholderModel();
      });
  }

  handleNavigation(event) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => item.classList.remove('active'));
    event.target.classList.add('active');

    const action = event.target.dataset.action;
    console.log('Navigation:', action);

    switch (action) {
      case 'import':
        this.showImportPanel();
        break;
      case 'detect':
        this.showDetectionPanel();
        break;
      case 'modify':
        this.showModificationPanel();
        break;
      case 'export':
        this.exportModel();
        break;
      default:
        console.log('Action not implemented:', action);
    }
  }

  handleAIPrompt() {
    const input = document.getElementById('ai-prompt-input');
    const prompt = input.value.trim();

    if (!prompt) {
      alert('Please enter a modification prompt');
      return;
    }

    console.log('🤖 Processing AI prompt:', prompt);
    this.aiGenerator = new AIGenerator();
    this.aiGenerator.generateModification(prompt).then((result) => {
      console.log('AI Result:', result);
      this.applyModification(result);
    });

    input.value = '';
  }

  handleSliderChange(event) {
    const label = event.target.parentElement.querySelector('label');
    const value = event.target.value;
    const valueDisplay = event.target.parentElement.querySelector('.slider-value');

    if (valueDisplay) {
      valueDisplay.textContent = value;
    }

    console.log(`${label?.textContent || 'Control'} changed to: ${value}`);

    // Apply transformation to model
    if (this.viewer) {
      const controlName = label?.textContent.toLowerCase();
      this.viewer.applyTransformation(controlName, parseFloat(value));
    }
  }

  handleModelSelect(event) {
    const modelName = event.currentTarget.querySelector('.model-item-name').textContent;
    console.log('Selected model:', modelName);

    this.selectedModel = modelName;
    document.querySelectorAll('.model-item').forEach((item) => {
      item.style.borderColor = '';
      item.style.boxShadow = '';
    });

    event.currentTarget.style.borderColor = 'var(--primary)';
    event.currentTarget.style.boxShadow = 'var(--neon-cyan)';
  }

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('🖼️ Processing photo:', file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      // In a real app, send to AI detection service
      console.log('Photo loaded, ready for car part detection');
      alert('Photo detection would be processed by AI service');
    };

    reader.readAsDataURL(file);
  }

  showImportPanel() {
    console.log('Import panel would open here');
  }

  showDetectionPanel() {
    console.log('Detection panel would open here');
  }

  showModificationPanel() {
    console.log('Modification panel would open here');
  }

  applyModification(modification) {
    console.log('Applying modification:', modification);
    if (this.viewer) {
      this.viewer.applyModification(modification);
    }
  }

  exportModel() {
    if (this.viewer) {
      console.log('Exporting model...');
      this.viewer.exportModel();
      alert('Model export functionality would be implemented here');
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DashboardApp();
});
