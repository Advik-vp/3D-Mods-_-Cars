import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';

class ModelLoaderService {
  private gltfLoader: GLTFLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
    
    // Setup DRACO for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }

  /**
   * Parse a Sketchfab URL to extract the 32-character UID
   */
  public extractSketchfabUID(url: string): string | null {
    const regex = /([a-fA-F0-9]{32})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Fetches a 3D model from a generic URL using GLTFLoader
   */
  public fetchModel(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined, // onProgress omitted
        (error) => {
          reject(error);
        }
      );
    });
  }
}

export const modelLoader = new ModelLoaderService();
