/* ===========================
   MODEL LOADER SERVICE
   =========================== */

export default class ModelLoader {
  constructor() {
    this.loadedModels = new Map();
    this.loader = new THREE.GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  /**
   * Load a GLTF/GLB model from URL
   * @param {string} url - URL to the model file
   * @returns {Promise<THREE.Group>}
   */
  loadModel(url) {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (this.loadedModels.has(url)) {
        resolve(this.loadedModels.get(url).clone());
        return;
      }

      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;

          // Optimize materials
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              // Improve material properties
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    this.optimizeMaterial(mat);
                  });
                } else {
                  this.optimizeMaterial(child.material);
                }
              }
            }
          });

          // Cache the model
          this.loadedModels.set(url, model);

          // Load textures if any
          if (gltf.animations.length > 0) {
            console.log(`Loaded ${gltf.animations.length} animations`);
          }

          resolve(model);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading model: ${percent.toFixed(2)}%`);
          this.onProgress(percent);
        },
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        },
      );
    });
  }

  /**
   * Load a texture from URL
   * @param {string} url - URL to the texture file
   * @returns {Promise<THREE.Texture>}
   */
  loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          // Set optimal properties
          texture.encoding = THREE.sRGBColorSpace;
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipMapLinearFilter;
          resolve(texture);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading texture: ${percent.toFixed(2)}%`);
        },
        (error) => {
          console.error('Error loading texture:', error);
          reject(error);
        },
      );
    });
  }

  /**
   * Optimize material for better performance
   * @param {THREE.Material} material
   */
  optimizeMaterial(material) {
    if (!material) return;

    // Set properties for better rendering
    material.shadowSide = THREE.BackSide;

    // Improve metallic materials
    if (material.metalness !== undefined) {
      material.metalness = Math.min(material.metalness, 0.8);
    }

    if (material.roughness !== undefined) {
      material.roughness = Math.max(material.roughness, 0.2);
    }

    // Enable better lighting
    material.envMapIntensity = 1;
  }

  /**
   * Load multiple models in parallel
   * @param {string[]} urls - Array of model URLs
   * @returns {Promise<THREE.Group[]>}
   */
  loadModels(urls) {
    return Promise.all(urls.map((url) => this.loadModel(url)));
  }

  /**
   * Create a car part component
   * @param {string} partName - Name of the part
   * @param {THREE.Geometry|THREE.BufferGeometry} geometry - Part geometry
   * @param {string} color - Hex color code
   * @returns {THREE.Mesh}
   */
  createCarPart(partName, geometry, color = 0x00d9ff) {
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.7,
      roughness: 0.3,
      envMapIntensity: 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = partName;

    return mesh;
  }

  /**
   * Clone a model and detach from cache
   * @param {string} url - URL of model to clone
   * @returns {Promise<THREE.Group>}
   */
  cloneModel(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const model = await this.loadModel(url);
        const cloned = model.clone();
        resolve(cloned);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get loaded model from cache
   * @param {string} url - Model URL
   * @returns {THREE.Group|null}
   */
  getCachedModel(url) {
    return this.loadedModels.get(url) || null;
  }

  /**
   * Clear model cache
   */
  clearCache() {
    this.loadedModels.clear();
    console.log('✅ Model cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      cachedModels: this.loadedModels.size,
      urls: Array.from(this.loadedModels.keys()),
    };
  }

  /**
   * Called during model loading progress
   * @param {number} percent - Loading percentage
   */
  onProgress(percent) {
    // This can be overridden to update a progress bar
    // Example: progressBar.style.width = percent + '%';
  }

  /**
   * Detect car parts in a loaded model
   * @param {THREE.Group} model - The loaded model
   * @returns {Object} - Parts detected
   */
  detectCarParts(model) {
    const parts = {
      body: [],
      wheels: [],
      windows: [],
      lights: [],
      other: [],
    };

    model.traverse((child) => {
      if (!child.isMesh) return;

      const name = child.name.toLowerCase();

      if (name.includes('wheel') || name.includes('tire')) {
        parts.wheels.push(child);
      } else if (name.includes('window') || name.includes('glass')) {
        parts.windows.push(child);
      } else if (name.includes('light') || name.includes('headlight')) {
        parts.lights.push(child);
      } else if (name.includes('body') || name.includes('frame')) {
        parts.body.push(child);
      } else {
        parts.other.push(child);
      }
    });

    console.log('🔍 Car parts detected:', parts);
    return parts;
  }
}
