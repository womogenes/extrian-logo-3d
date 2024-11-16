// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xbfdfff, 5);
light.position.set(50, 50, 50);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xbfdfff, 5);
light2.position.set(50, -50, -50);
scene.add(light2);

// Load GLB model
let toRotX = -0.1 * Math.PI;
let toRotY = -0.15 * Math.PI;
let toRotZ = 0;

const loader = new THREE.GLTFLoader();
loader.load(
  './extrian_logo_3d_v6.glb',
  function (gltf) {
    scene.add(gltf.scene);

    if (scene.children.length > 0) {
      const model = scene.children.find((child) => child.type === 'Group');
      if (model) {
        model.rotation.x = toRotX;
        model.rotation.y = toRotY;
        model.rotation.z = toRotZ;
      }
      console.log(model.rotation.x);
    }
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Load EXR environment map
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./roof_lights.jpg', function (texture) {
  const background = new THREE.WebGLCubeRenderTarget(texture.image.height);
  background.fromEquirectangularTexture(renderer, texture);
  scene.environment = background.texture;
});

// Camera position
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 15;

// Orbit Controls
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
// controls.enableZoom = true;

function animate() {
  if (scene.children.length > 0) {
    const model = scene.children.find((child) => child.type === 'Group');
    if (model) {
      model.rotation.x += (toRotX - model.rotation.x) * 0.01;
      model.rotation.y += (toRotY - model.rotation.y) * 0.01;
      model.rotation.z += (toRotZ - model.rotation.z) * 0.01;
    }
  }

  document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth - 1 / 2) * 0.2 - 0.1;
    const mouseY = (event.clientY / window.innerHeight - 1 / 2) * 0.2 - 0.15;

    toRotY = mouseX * Math.PI;
    toRotX = mouseY * Math.PI;
  });

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
