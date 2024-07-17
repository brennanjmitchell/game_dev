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
Models.loadModel('assets/models/sandDunes.glb', (ground) => {
  const geometry = ground.children[0].geometry; // Assuming the ground model is the first child
  const material = ground.children[0].material;
  const geometryWidth = 1;
  const geometryDepth = 1;

  // Create an InstancedMesh Grid
  const gridSize = 10;
  let count = Math.pow(gridSize, 2);
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

  const matrix = new THREE.Matrix4();
  const bottomCornerDim = geometryWidth * (gridSize / 2);
  matrix.setPosition(-bottomCornerDim, 0, -bottomCornerDim);

  let index = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      console.log(x, z);
      printMatrix(matrix);

      instancedMesh.setMatrixAt(index, matrix);
      moveMatrix(matrix, geometryWidth, 0, 0);
      index++;
    }
    moveMatrix(matrix, geometryWidth * -gridSize, 0, geometryDepth);
  }

  scene.add(instancedMesh);
});

// // Load and add our models to the scene
// Models.loadModel('assets/models/testBook.glb', (model) => {
//   objects.testBook = model;
//   // Models.convertToBasicMaterial(model);
//   scene.add(model);
// });

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
