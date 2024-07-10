import { resize } from './renderer.js';

function onWindowResize(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  resize();
}

export { onWindowResize };
