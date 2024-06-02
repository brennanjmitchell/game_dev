// Create the scene
const scene = new THREE.Scene();

// Create a geometry and a material, then combine them into a mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
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

// Initialize the renderer and add it to the DOM
const renderer = initRenderer();
document.body.appendChild(renderer.domElement);

// Initialize the camera
const camera = initCamera();

// Add event listeners for controls
initControls(camera);

// Start the animation loop
animate(scene, camera, renderer, cube);
