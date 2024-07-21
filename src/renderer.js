import * as THREE from 'three';

// Create an optional Render Target for a pixelated, "DS" look
let useReducedResolution = true;
const VIRTUAL_WIDTH = 320;
const VIRTUAL_HEIGHT = 240;

const renderTarget = new THREE.WebGLRenderTarget(
  VIRTUAL_WIDTH,
  VIRTUAL_HEIGHT,
  {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  }
);

// Set texture filtering to nearest for pixelated look
renderTarget.texture.minFilter = THREE.NearestFilter;
renderTarget.texture.magFilter = THREE.NearestFilter;

// Create initial, default renderer with anti-aliasing based on the useReducedResolution flag
const renderer = new THREE.WebGLRenderer({ antialias: !useReducedResolution });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene and camera for the full-screen RenderTarget quad
const quadScene = new THREE.Scene();
const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quadGeometry = new THREE.PlaneGeometry(2, 2);
const quadMaterial = new THREE.ShaderMaterial({
  uniforms: {
    tDiffuse: { value: renderTarget.texture },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(tDiffuse, vUv);
    }
  `,
});
const quadMesh = new THREE.Mesh(quadGeometry, quadMaterial);
quadScene.add(quadMesh);

// Determine the correct size of the Renderer or RenderTarget based on the window
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update the renderer size
  renderer.setSize(width, height);

  // Update the resolution uniform for scaling the quad
  quadMaterial.uniforms.resolution.value.set(width, height);
}

function render(scene, camera) {
  if (useReducedResolution) {
    // Render the scene to the render target
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    // Render the render target to the screen
    renderer.setRenderTarget(null);
    renderer.render(quadScene, quadCamera);
  } else {
    renderer.setRenderTarget(null);
    renderer.outputEncoding = THREE.sRGBEncoding; // Set encoding to sRGB
    renderer.render(scene, camera);
  }
}

export { renderer, renderTarget, resize, useReducedResolution, render };
