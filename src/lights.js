import * as THREE from 'three';

const ambientLight = new THREE.AmbientLight(0x404040);
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(1, 1, 1).normalize();

export { ambientLight, directionalLight };
