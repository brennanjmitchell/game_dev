import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

function loadModel(path, onLoad) {
  loader.load(path, (gltf) => {
    onLoad(gltf.scene);
  });
}

export { loadModel };
