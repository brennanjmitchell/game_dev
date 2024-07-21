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
 * @param {number} spacing - The spacing between each instance before any scaling. Make this value the same size as each instance for seamless tiling.
 * @param {function} callback - The callback function to execute when the grid is created.
 * @param {number} [scale] - The scale factor for each instance. Defaults to 1 if not provided.
 * @param {function} [onError] - The optional callback function to execute if an error occurs during loading.
 */
function loadInstancedGrid(
  path,
  gridSize,
  spacing,
  callback,
  scale = 1,
  onError
) {
  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene.children[0]; // Assume our intended model is the first child
      const geometry = model.geometry;
      const material = model.material;

      // Create an InstancedMesh Grid
      spacing *= scale;
      const count = Math.pow(gridSize, 2);
      const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

      const matrix = new THREE.Matrix4();
      const bottomCornerDim = spacing * (gridSize / 2);

      let index = 0;
      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          matrix.compose(
            new THREE.Vector3(
              -bottomCornerDim + x * spacing,
              0,
              -bottomCornerDim + z * spacing
            ),
            new THREE.Quaternion(),
            new THREE.Vector3(scale, scale, scale) // Set scale here
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

/**
 * Scrolls an instanced grid in the specified direction, creating an infinite scrolling effect.
 * Automatically calculates the grid's spacing by comparing the distance between the first two instances.
 *
 * @param {THREE.InstancedMesh} instancedMesh - The instanced mesh representing the grid.
 * @param {'x' | 'z'} direction - The direction in which to scroll the grid ('x' for horizontal, 'z' for vertical).
 * @param {number} speed - The speed at which to scroll the grid.
 */
function scrollInstancedGrid(instancedMesh, direction, speed) {
  const standin = new THREE.Object3D();
  const countX = Math.sqrt(instancedMesh.count); // Assuming square grid
  const countY = countX;

  // Determine spacing by comparing the positions of the first two instances
  instancedMesh.getMatrixAt(0, standin.matrix);
  const pos1 = new THREE.Vector3().setFromMatrixPosition(standin.matrix);
  instancedMesh.getMatrixAt(1, standin.matrix);
  const pos2 = new THREE.Vector3().setFromMatrixPosition(standin.matrix);
  const spacing = pos1.distanceTo(pos2);

  let thresholdX = (countX * spacing) / 2;
  let thresholdY = (countY * spacing) / 2;

  for (let i = 0; i < instancedMesh.count; i++) {
    instancedMesh.getMatrixAt(i, standin.matrix);

    // Decompose matrix into position, quaternion, and scale
    standin.matrix.decompose(
      standin.position,
      standin.quaternion,
      standin.scale
    );

    // Update position
    standin.position[direction] += speed;

    // Recycle instances
    if (standin.position.x >= thresholdX) standin.position.x -= thresholdX * 2;
    if (standin.position.x < -thresholdX) standin.position.x += thresholdX * 2;
    if (standin.position.z >= thresholdY) standin.position.z -= thresholdY * 2;
    if (standin.position.z < -thresholdY) standin.position.z += thresholdY * 2;

    standin.updateMatrix();
    instancedMesh.setMatrixAt(i, standin.matrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
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
        transparent: child.material.transparent || false,
        premultipliedAlpha: child.material.premultipliedAlpha || false
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
  scrollInstancedGrid,
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
