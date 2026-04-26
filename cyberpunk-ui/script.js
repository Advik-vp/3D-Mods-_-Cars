/**
 * 3D Car Modification Platform - Frontend Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Interactions ---

    // Left Navigation
    document.querySelectorAll('.side-nav li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('.side-nav li.active')?.classList.remove('active');
            item.classList.add('active');
        });
    });

    // Control Options (Rims)
    document.querySelectorAll('.option-card').forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.closest('.grid-options');
            parent.querySelector('.active')?.classList.remove('active');
            item.classList.add('active');
            
            // Interaction effect
            item.style.transform = 'scale(0.95)';
            setTimeout(() => item.style.transform = '', 150);
        });
    });

    // Color Pickers
    document.querySelectorAll('.color-picker-container').forEach(container => {
        const isNeon = container.querySelector('.neon-swatch');
        
        container.querySelectorAll('.color-swatch').forEach(item => {
            item.addEventListener('click', () => {
                container.querySelector('.active')?.classList.remove('active');
                item.classList.add('active');
                
                // Get color from style variable
                const colorHex = item.style.getPropertyValue('--swatch-color').trim();
                
                if (window.carMaterials) {
                    if (isNeon && window.neonLights) {
                        // Change neon color
                        const colorObj = new THREE.Color(colorHex);
                        window.neonLights.forEach(light => {
                            if(light.isRectAreaLight) light.color = colorObj;
                        });
                        if (window.underglowMat) window.underglowMat.color = colorObj;
                    } else if (!isNeon && window.carMaterials.body) {
                        // Change paint color
                        window.carMaterials.body.color = new THREE.Color(colorHex);
                    }
                }
            });
        });
    });

    // Neon Intensity Slider
    const neonSlider = document.getElementById('neon-intensity');
    if(neonSlider) {
        neonSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            e.target.previousElementSibling.querySelector('span').innerText = val + '%';
            
            if (window.underglowMat) {
                window.underglowMat.opacity = (val / 100) * 0.8;
            }
        });
    }

    // Initialize View
    initThreeJS();
});


// --- Three.js 3D Viewer ---
function initThreeJS() {
    const container = document.getElementById('threejs-canvas');
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4, 2, 6);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LIGHTING (Cyberpunk aesthetics)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main neon blue rim light
    const dirLight1 = new THREE.DirectionalLight(0x00f3ff, 2);
    dirLight1.position.set(5, 5, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    // Purple fill light
    const dirLight2 = new THREE.DirectionalLight(0x9d00ff, 2.5);
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);
    
    // Top spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 8, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // ENVIRONMENT / PLATFORM
    // High-tech floor grid
    const gridHelper = new THREE.GridHelper(15, 30, 0x00f3ff, 0x111111);
    gridHelper.position.y = 0;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Center glowing ring platform
    const platformGroup = new THREE.Group();
    
    const ringGeo = new THREE.RingGeometry(2.5, 2.7, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    platformGroup.add(ring);
    
    const innerDiskGeo = new THREE.CylinderGeometry(2.5, 2.6, 0.1, 64);
    const innerDiskMat = new THREE.MeshStandardMaterial({ 
        color: 0x0a0c14,
        roughness: 0.1,
        metalness: 0.8
    });
    const innerDisk = new THREE.Mesh(innerDiskGeo, innerDiskMat);
    innerDisk.position.y = -0.05;
    innerDisk.receiveShadow = true;
    platformGroup.add(innerDisk);
    
    scene.add(platformGroup);

    // PLACEHOLDER CAR BUILDER (Since we don't have a GLTF model)
    const carGroup = new THREE.Group();
    
    // Global references for UI modifications
    window.carMaterials = {
        body: new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.6,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        }),
        glass: new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.6, // Glass effect
            transparent: true
        }),
        rims: new THREE.MeshStandardMaterial({
            color: 0xb4b4b4,
            metalness: 0.8,
            roughness: 0.3
        })
    };

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.8, 0.5, 4.2);
    const body = new THREE.Mesh(bodyGeometry, window.carMaterials.body);
    body.position.y = 0.45;
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);
    
    // Wedge nose (Sports car look)
    const noseGeometry = new THREE.CylinderGeometry(0, 0.9, 1, 3, 1, false, Math.PI / 2, Math.PI);
    const nose = new THREE.Mesh(noseGeometry, window.carMaterials.body);
    nose.rotation.z = Math.PI / 2;
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.45, 2.1);
    nose.scale.set(0.5, 1, 1);
    carGroup.add(nose);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.4, 0.4, 1.8);
    const cabin = new THREE.Mesh(cabinGeometry, window.carMaterials.glass);
    cabin.position.set(0, 0.9, -0.2);
    carGroup.add(cabin);

    // Wheels
    const wheelRadius = 0.35;
    const rimGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.25, 32);
    
    const wheelPositions = [
        [1.0, wheelRadius, 1.3],
        [-1.0, wheelRadius, 1.3],
        [1.0, wheelRadius, -1.2],
        [-1.0, wheelRadius, -1.2]
    ];

    wheelPositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(...pos);
        
        // Tire
        const tireGeo = new THREE.TorusGeometry(wheelRadius, 0.15, 16, 32);
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
        const tire = new THREE.Mesh(tireGeo, tireMat);
        tire.rotation.y = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);
        
        // Rim
        const rim = new THREE.Mesh(rimGeo, window.carMaterials.rims);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);
        
        carGroup.add(wheelGroup);
    });

    // Underglow Neon (Cyberpunk styling)
    const underglowGeo = new THREE.PlaneGeometry(1.6, 3.8);
    window.underglowMat = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const underglow = new THREE.Mesh(underglowGeo, window.underglowMat);
    underglow.rotation.x = Math.PI / 2;
    underglow.position.y = 0.05;
    carGroup.add(underglow);
    
    scene.add(carGroup);

    // INTERACTION / CONTROLS (Simple mouse drag for rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: Math.PI / 4 };
    let currentRotation = { x: 0, y: Math.PI / 4 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            targetRotation.y += deltaMove.x * 0.01;
            // Limit vertical rotation
            targetRotation.x += deltaMove.y * 0.01;
            targetRotation.x = Math.max(-Math.PI/6, Math.min(Math.PI/6, targetRotation.x));
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, {passive: true});
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };
            targetRotation.y += deltaMove.x * 0.01;
        }
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, {passive: true});
    
    document.addEventListener('touchend', () => { isDragging = false; });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();

        // Smooth rotation interpolation
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
        
        // Apply camera/group rotation
        carGroup.rotation.y = currentRotation.y;
        carGroup.rotation.x = currentRotation.x;

        // Auto rotation when idle
        if (!isDragging) {
            targetRotation.y += 0.002;
        }

        // Pulse the platform ring
        const scale = 1 + Math.sin(time * 2) * 0.03;
        ring.scale.set(scale, scale, 1);
        ringMat.opacity = 0.6 + Math.sin(time * 2) * 0.2;

        renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}
