// Create the scene
const scene = new THREE.Scene();

// Create a geometry and a material, then combine them into a mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);

// Add the cube to the scene
scene.add(cube);

// Load a test GLTF Model
const loader = new THREE.GLTFLoader();

loader.load(
    '/assets/models/testBook.glb',
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('An error occurred while loading the model:', error);
    }
);

// Test initial Point light
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Color, Intensity, Distance
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
scene.add(ambientLight);

// Initialize the renderer and add it to the DOM
const renderer = initRenderer();
document.body.appendChild(renderer.domElement);

// Initialize the camera
const camera = initCamera();

// Add event listeners for controls
initControls(camera);

// Start the animation loop
animate(scene, camera, renderer, cube);
