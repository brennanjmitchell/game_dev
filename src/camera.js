import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Some simple default camera settings
camera.position.z = 5;
camera.position.y = 5;
camera.rotation.x = Math.PI / 4.0;

export default camera;
