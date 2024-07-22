import * as THREE from 'three';
import scene from './scene.js';
import camera from './camera.js';
import { render } from './renderer.js';
import controls from './controls.js';
import * as Models from './models.js';
import { ambientLight, directionalLight } from './lights.js';
import { onWindowResize } from './eventHandlers.js';

// Add lights to the scene
scene.add(ambientLight);
scene.add(directionalLight);

scene.fog = new THREE.Fog(0xf8d49e, 5, 300); // Sets a fog that fades on between 5 and 300

// Create a map to hold references to objects
const objects = {};

// Load some sand dunes
Models.loadInstancedGrid(
  'assets/models/sandDunes.glb',
  50,
  1,
  (dunes) => {
    objects.ground = dunes;

    // // Test Shadows
    // dunes.castShadow = true;
    // dunes.receiveShadow = true;

    // Apply a simple "sandy" color
    const sandyDuneColor = new THREE.Color(0xf8d49e); // Example sandy dune color
    const sandyMaterial = new THREE.MeshStandardMaterial({
      color: sandyDuneColor,
      roughness: 1,
      metalness: 0,
    });
    dunes.material = sandyMaterial;

    Models.setRenderOrder(dunes, 1);

    scene.add(dunes);
  },
  50
);

// Load the skybox textures
const loader = new THREE.CubeTextureLoader();
const skyboxTextures = loader.load([
  'assets/textures/waterfallSkybox/px.png',  // Left
  'assets/textures/waterfallSkybox/nx.png',  // Right
  'assets/textures/waterfallSkybox/py.png',  // Top
  'assets/textures/waterfallSkybox/ny.png',  // Bottom
  'assets/textures/waterfallSkybox/pz.png',  // Front
  'assets/textures/waterfallSkybox/nz.png'   // Back
]);

// Set the scene's background to the loaded skybox textures
scene.background = skyboxTextures;

// Keep track of if/when the camera moves
let lastCameraPosition = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  // Lock skydome to camera position if the camera moved
  if (objects.skydome_bg && !lastCameraPosition.equals(camera.position)) {
    objects.skydome_bg.position.copy(camera.position);
    objects.skydome_mg.position.copy(camera.position);
    lastCameraPosition.copy(camera.position);
  }

  // Scroll our "infinite" ground plane if it exists
  if (objects.ground) {
    Models.scrollInstancedGrid(objects.ground, 'x', 0.1);
  }

  controls.update();

  // Call the render function from renderer.js
  render(scene, camera);
}

window.addEventListener('resize', () => {
  onWindowResize(camera), false;
});

animate();
