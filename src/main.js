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

scene.fog = new THREE.Fog(0xf8d49e, 150, 300); // Sets a red fog that fades on between 10 and 20 units

// Create a map to hold references to objects
const objects = {};

// Load some sand dunes
Models.loadInstancedGrid(
  'assets/models/sandDunes.glb',
  20,
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

    scene.add(dunes);
  },
  50
);

// Load a reference sphere to indicate "origin"
Models.loadModel('assets/models/skydome_Simple.glb', (sphere) => {
  scene.add(sphere);
});

// Load and add our skydome to the scene
Models.loadModel(
  'assets/models/skydome_RustigKoppie_PureSky.glb',
  // 'assets/models/skydome_Simple.glb', // Simple skydome with low horizon line
  (skydome) => {
    objects.skydome = skydome;

    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load(
      'assets/textures/skydome_simpleDesert.jpg',
      (texture) => {
        texture.flipY = false; // Flip the texture vertically
      }
    );

    // Apply the texture to the skydome material
    skydome.traverse((child) => {
      if (child.isMesh) {
        child.material.map = skyTexture;
        child.material.needsUpdate = true;
      }
    });

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

  // Scroll our "infinite" ground plane if it exists
  if (objects.ground) {
    Models.scrollInstancedGrid(objects.ground, 'x', 0.02);
  }

  controls.update();

  // Call the render function from renderer.js
  render(scene, camera);
}

window.addEventListener('resize', () => {
  onWindowResize(camera), false;
});

animate();
