import * as THREE from 'three';
import scene from './scene.js';
import camera from './camera.js';
import { renderer, render, resize } from './renderer.js';
import controls from './controls.js';
import * as Models from './models.js';
import { ambientLight, directionalLight } from './lights.js';
import { onWindowResize } from './eventHandlers.js';
import { moveMatrix, printMatrix } from './utils.js';

// Add lights to the scene
scene.add(ambientLight);
scene.add(directionalLight);

// scene.fog = new THREE.Fog(0xeb4034, 10, 20); // Sets a red fog that fades on between 10 and 20 units

// Create a map to hold references to objects
const objects = {};

// Load and add some sand dunes
Models.loadInstancedGrid('assets/models/sandDunes.glb', 10, 1, (dunes) => {
  scene.add(dunes);
});

// Load and add our skydome to the scene
Models.loadModel(
  // 'assets/models/skydome_RustigKoppie_PureSky.glb',
  'assets/models/skydome_Simple.glb', // Simple skydome with low horizon line
  (skydome) => {
    objects.skydome = skydome;
    Models.copyPosition(skydome, camera.position);
    Models.setFrontsideMaterial(skydome); // Ensure normals are correct
    Models.convertToBasicMaterial(skydome);
    Models.disableDepth(skydome);
    Models.setRenderOrder(skydome, -1); // Ensure skydome renders first
    scene.add(skydome);
  }
);

// Keep track of if/when the camera moves
let lastCameraPosition = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  // Lock skydome to camera position if the camera moved
  if (objects.skydome && !lastCameraPosition.equals(camera.position)) {
    objects.skydome.position.copy(camera.position);
    lastCameraPosition.copy(camera.position);
  }

  controls.update();

  // Call the render function from renderer.js
  render(scene, camera);
}

window.addEventListener('resize', () => {
  onWindowResize(camera), false;
});

animate();
