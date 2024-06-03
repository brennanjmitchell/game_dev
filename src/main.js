import scene from './scene.js';
import camera from './camera.js';
import renderer from './renderer.js';
import controls from './controls.js';
import { loadModel } from './models.js';
import { ambientLight, directionalLight } from './lights.js';
import { onWindowResize } from './eventHandlers.js';

// Add lights to the scene
scene.add(ambientLight);
scene.add(directionalLight);

// Load and add model to the scene
loadModel('assets/models/testBook.glb', (model) => {
  scene.add(model);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

animate();
