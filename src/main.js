import * as THREE from 'three';
import scene from './scene.js';
import camera from './camera.js';
import renderer from './renderer.js';
import controls from './controls.js';
import * as Models from './models.js';
import { ambientLight, directionalLight } from './lights.js';
import { onWindowResize } from './eventHandlers.js';

// Add lights to the scene
scene.add(ambientLight);
scene.add(directionalLight);

// Create a map to hold references to objects
const objects = {};

// Load and add our models to the scene
Models.loadModel('assets/models/testBook.glb', (model) => {
  objects.testBook = model;
  scene.add(model);
});

// Load and add our skydome to the scene
Models.loadModel('assets/models/skydome_RustigKoppie_PureSky.glb', (skydome) => {
  objects.skydome = skydome;
  Models.copyPosition(skydome, camera.position);
  Models.setFrontsideMaterial(skydome); // Ensure normals are correct
  Models.convertToBasicMaterial(skydome);
  Models.disableDepth(skydome);
  Models.setRenderOrder(skydome, -1); // Ensure skydome renders first
  scene.add(skydome);
});

let lastCameraPosition = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  // Lock skydome to camera position if the camera moved
  if (objects.skydome && !lastCameraPosition.equals(camera.position)) {
    objects.skydome.position.copy(camera.position);
    lastCameraPosition.copy(camera.position);
  }

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

animate();
