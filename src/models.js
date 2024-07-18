import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

/**
 * Loads a GLTF from the specified path and executes a callback function upon successful loading.
 *
 * @param {string} path - The path to the 3D model file.
 * @param {function} onLoad - The callback function to execute when the model is successfully loaded.
 * @param {function} [onError] - The optional callback function to execute if an error occurs during loading.
 */
function loadModel(path, onLoad, onError) {
  loader.load(
    path,
    (gltf) => {
      onLoad(gltf.scene);
    },
    undefined,
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('An error occurred while loading the model:', error);
      }
    }
  );
}

/**
 * Loads a GLTF from the specified path and instances its first child in a square grid.
 *
 * @param {string} path - The path to the GLTF file.
 * @param {number} gridSize - The width and height of the square grid.
 * @param {number} spacing - The spacing between each instance. Make this value the same size as each instance for seamless tiling.
 * @param {function} callback - The callback function to execute when the grid is created.
 * @param {function} [onError] - The optional callback function to execute if an error occurs during loading.
 */
function loadInstancedGrid(path, gridSize, spacing, callback, onError) {
  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene.children[0]; // Assume our intended model is the first child
      const geometry = model.geometry;
      const material = model.material;

      // Create an InstancedMesh Grid
      const count = Math.pow(gridSize, 2);
      const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

      const matrix = new THREE.Matrix4();
      const bottomCornerDim = spacing * (gridSize / 2);

      let index = 0;
      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          matrix.setPosition(
            -bottomCornerDim + x * spacing,
            0,
            -bottomCornerDim + z * spacing
          );
          instancedMesh.setMatrixAt(index, matrix);
          index++;
        }
      }

      callback(instancedMesh);
    },
    undefined,
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('An error occurred while loading the model:', error);
      }
    }
  );
}

function copyPosition(object, position) {
  object.position.copy(position);
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

export {
  loadModel,
  loadInstancedGrid,
  copyPosition,
  setPosition,
  disableShadows,
  disableDepth,
  setBacksideMaterial,
  setFrontsideMaterial,
  convertToBasicMaterial,
  setEmissiveIntensity,
  setLayer,
  setRenderOrder,
};
