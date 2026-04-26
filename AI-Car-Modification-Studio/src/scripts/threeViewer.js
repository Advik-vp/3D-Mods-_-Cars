/* ===========================
   THREE.JS 3D CAR VIEWER
   =========================== */

export default class ThreeViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentModel = null;
    this.lights = [];
    this.stats = {
      polygons: 0,
      vertices: 0,
      texturesLoaded: 0,
    };
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setupLighting();
    this.setupControls();
    this.setupEventListeners();
    this.updateStats();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 100, 1000);
  }

  createCamera() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, 0);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);

    // Point light - Cyan neon
    const pointLight1 = new THREE.PointLight(0x00d9ff, 0.5, 100);
    pointLight1.position.set(-10, 5, 10);
    this.scene.add(pointLight1);
    this.lights.push(pointLight1);

    // Point light - Pink neon
    const pointLight2 = new THREE.PointLight(0xff006e, 0.5, 100);
    pointLight2.position.set(10, 5, -10);
    this.scene.add(pointLight2);
    this.lights.push(pointLight2);
  }

  setupControls() {
    // Implement orbit controls functionality
    // In a real app, you'd use THREE.js OrbitControls
    this.rotationSpeed = 0;
    this.zoomLevel = 5;
  }

  setupEventListeners() {
    // Mouse rotation
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Touch controls for mobile
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event) {
    if (!this.isDragging || !this.currentModel) return;

    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;

    this.currentModel.rotation.y += deltaX * 0.01;
    this.currentModel.rotation.x += deltaY * 0.01;

    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(event) {
    this.isDragging = false;
  }

  onMouseWheel(event) {
    event.preventDefault();
    const scrollSpeed = 0.1;
    this.zoomLevel += event.deltaY > 0 ? scrollSpeed : -scrollSpeed;
    this.zoomLevel = Math.max(1, Math.min(20, this.zoomLevel));
    this.camera.position.z = this.zoomLevel;
  }

  onTouchStart(event) {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  }

  onTouchMove(event) {
    if (!this.isDragging || !this.currentModel) return;
    event.preventDefault();

    const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
    const deltaY = event.touches[0].clientY - this.previousMousePosition.y;

    this.currentModel.rotation.y += deltaX * 0.01;
    this.currentModel.rotation.x += deltaY * 0.01;

    this.previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }

  onTouchEnd(event) {
    this.isDragging = false;
  }

  onWindowResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  createPlaceholderModel() {
    // Create a simple placeholder car model
    const group = new THREE.Group();

    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      metalness: 0.8,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Car roof
    const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0xff006e,
      metalness: 0.7,
      roughness: 0.3,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.4;
    roof.position.z = -0.2;
    roof.castShadow = true;
    roof.receiveShadow = true;
    group.add(roof);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.5,
      roughness: 0.8,
    });

    const wheelPositions = [
      [-0.8, 0.4, 1],
      [0.8, 0.4, 1],
      [-0.8, 0.4, -1],
      [0.8, 0.4, -1],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(...pos);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheel.receiveShadow = true;
      group.add(wheel);
    });

    // Headlights
    const lightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });

    const headLight1 = new THREE.Mesh(lightGeometry, lightMaterial);
    headLight1.position.set(-0.4, 0.6, 2);
    group.add(headLight1);

    const headLight2 = new THREE.Mesh(lightGeometry, lightMaterial);
    headLight2.position.set(0.4, 0.6, 2);
    group.add(headLight2);

    group.castShadow = true;
    group.receiveShadow = true;

    this.scene.add(group);
    this.currentModel = group;

    console.log('✅ Placeholder car model created');
  }

  addModel(model) {
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
    }

    model.castShadow = true;
    model.receiveShadow = true;

    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    this.scene.add(model);
    this.currentModel = model;

    this.updateStats();
    console.log('✅ Model added to scene');
  }

  applyTransformation(controlName, value) {
    if (!this.currentModel) return;

    switch (controlName) {
      case 'rotation':
        this.currentModel.rotation.y = (value * Math.PI) / 180;
        break;
      case 'scale':
        this.currentModel.scale.set(value, value, value);
        break;
      case 'x-position':
        this.currentModel.position.x = value;
        break;
      case 'y-position':
        this.currentModel.position.y = value;
        break;
      case 'z-position':
        this.currentModel.position.z = value;
        break;
      default:
        console.log('Unknown transformation:', controlName);
    }
  }

  applyModification(modification) {
    console.log('Applying modification to model:', modification);
    // This would apply AI-generated modifications to the model
    if (this.currentModel) {
      // Example: change color
      this.currentModel.traverse((child) => {
        if (child.isMesh) {
          if (Math.random() > 0.5) {
            child.material.color.setHex(Math.random() * 0xffffff);
          }
        }
      });
    }
  }

  exportModel() {
    if (!this.currentModel) {
      alert('No model to export');
      return;
    }

    console.log('Exporting model...');
    // In a real app, use THREE.js GLTFExporter to export the model
    const dataUrl = this.renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'car-model-preview.png';
    link.click();
  }

  updateStats() {
    if (!this.currentModel) return;

    let polygons = 0;
    let vertices = 0;

    this.currentModel.traverse((child) => {
      if (child.isMesh && child.geometry) {
        polygons += child.geometry.attributes.position.count / 3;
        vertices += child.geometry.attributes.position.count;
      }
    });

    this.stats.polygons = Math.floor(polygons);
    this.stats.vertices = Math.floor(vertices);

    // Update UI stats display
    const polyCount = document.querySelector('[data-stat="polygons"]');
    const vertexCount = document.querySelector('[data-stat="vertices"]');

    if (polyCount) polyCount.textContent = this.stats.polygons.toLocaleString();
    if (vertexCount) vertexCount.textContent = this.stats.vertices.toLocaleString();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Auto-rotate if not dragging
    if (!this.isDragging && this.currentModel) {
      this.currentModel.rotation.y += 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
