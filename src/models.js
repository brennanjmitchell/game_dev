import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

function loadModel(path, onLoad) {
  loader.load(path, (gltf) => {
    onLoad(gltf.scene);
  });
}

function copyPosition(object, position) {
  object.position.copy(position)
}

function setPosition(object, x, y, z) {
  object.position.set(x, y, z);
}

function disableShadows(object) {
  object.castShadow = false;
  object.receiveShadow = false;
}

function disableDepth(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material.depthTest = false;
      child.material.depthWrite = false;
    }
  });
}

function setBacksideMaterial(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.BackSide;
    }
  });
}

function setFrontsideMaterial(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.FrontSide;
    }
  });
}

function convertToBasicMaterial(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      const basicMaterial = new THREE.MeshBasicMaterial({
        map: child.material.map || null,
        color: child.material.color || new THREE.Color(0xffffff),
        side: child.material.side || THREE.FrontSide,
      });

      child.material = basicMaterial;
    }
  });
}

function setEmissiveIntensity(object, intensity) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material.emissiveIntensity = intensity;
    }
  });
}

function setLayer(object, layer) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.layers.set(layer);
    }
  });
}

function setRenderOrder(object, order) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.renderOrder = order;
    }
  });
}

export { loadModel, copyPosition, setPosition, disableShadows, disableDepth, setBacksideMaterial, setFrontsideMaterial, convertToBasicMaterial, setEmissiveIntensity, setLayer, setRenderOrder };
