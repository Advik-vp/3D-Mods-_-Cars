import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three';

class ModelLoaderService {
  private gltfLoader: GLTFLoader;
  private objLoader: OBJLoader;
  private mtlLoader: MTLLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
    
    // Setup DRACO for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.gltfLoader.setDRACOLoader(dracoLoader);

    // Setup OBJ and MTL loaders
    this.objLoader = new OBJLoader();
    this.mtlLoader = new MTLLoader();
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

  /**
   * Loads an OBJ model from a URL
   */
  public loadOBJModel(objUrl: string, mtlUrl?: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      if (mtlUrl) {
        // Load materials first, then OBJ
        this.mtlLoader.load(
          mtlUrl,
          (materials) => {
            materials.preload();
            this.objLoader.setMaterials(materials);
            this.objLoader.load(
              objUrl,
              (object) => {
                resolve(object);
              },
              undefined,
              (error) => {
                reject(error);
              }
            );
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      } else {
        // Load OBJ without materials
        this.objLoader.load(
          objUrl,
          (object) => {
            resolve(object);
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      }
    });
  }
}

export const modelLoader = new ModelLoaderService();
