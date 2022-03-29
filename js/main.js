const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const gui = new dat.GUI();

const camera = new THREE.PerspectiveCamera(
  75, //field of view
  window.innerWidth / window.innerHeight, //aspect ratio
  0.1, //near clipping plane
  1000 //far clipping plane
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; THREE.PCFShadowMap;

const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
const transformControl = new THREE.TransformControls(camera, renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(1.5, 9.5, 11.8);
pointLight.castShadow = true;
scene.add(pointLight);

pointLight.shadow.mapSize.width = 512;
pointLight.shadow.mapSize.height = 512;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 500;


var object = new DisplayObject("Cube", "Mesh");
// for (var key in object) {s
//   console.log(key, object[key]);
// }
object.display.castShadow = true;
object.display.position.z = 4;
object.display.position.x = 1;
object.display.position.y = 1;
scene.add(object.display)

transformControl.attach(object.display);
transformControl.addEventListener('dragging-changed', function (event) {

  orbitControl.enabled = !event.value;

});
scene.add(transformControl);

window.addEventListener('keydown', function (event) {

  switch (event.keyCode) {

    case 81: // Q
      transformControl.setSpace(transformControl.space === "local" ? "world" : "local");
      break;

    case 16: // Shift
      transformControl.setTranslationSnap(100);
      transformControl.setRotationSnap(THREE.MathUtils.degToRad(15));
      transformControl.setScaleSnap(0.25);
      break;

    case 87: // W
      transformControl.setMode("translate");
      break;

    case 69: // E
      transformControl.setMode("rotate");
      break;

    case 82: // R
      transformControl.setMode("scale");
      break;

    case 88: // X
      transformControl.showX = !transformControl.showX;
      break;

    case 89: // Y
      transformControl.showY = !transformControl.showY;
      break;

    case 90: // Z
      transformControl.showZ = !transformControl.showZ;
      break;

    case 32: // Spacebar
      transformControl.enabled = !transformControl.enabled;
      break;

  }
}
);

const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
planeMaterial.map = textureLoader.load("../assets/textures/wood.jfif")
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);

const helper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(helper);

camera.position.x = 0;
camera.position.y = -2;
camera.position.z = 12;

camera.lookAt(new THREE.Vector3(0, 0, 0));

const animationSet = {
  callback: "Reset",
  "Reset": function () {
    // object.display.position.x = 1;
    // object.display.position.y = 1;
  },
  "Rotation": function () {
    object.display.rotation.x += 0.1;
    object.display.rotation.z += 0.1;
  },
  "Orbiting": function () {
    var orbitRadius = 5.0;
    while (object.display.position.x <= orbitRadius) {
      object.display.position.x += 0.0001;
    }
    object.display.position.set(
      Math.cos(Date.now() * 0.001) * orbitRadius,
      Math.sin(Date.now() * 0.001) * orbitRadius,
      2.5
    );
  }
}

const affineTransformation = {
  transform: "Translation",
}
var animation = "Reset";
const objectMeshFolder = gui.addFolder("Mesh setting");
objectMeshFolder.addColor(object, "color").onChange(function (value) {
  object.updateColor(value);
});
objectMeshFolder.add(object, "mesh_type", ["Solid", "Point", "Line"]).name("Display type").onChange(function (value) {
  scene.remove(transformControl);
  scene.remove(object.display);
  object.updateSurface(value);
  scene.add(object.display);
  transformControl.attach(object.display);
  scene.add(transformControl);
});
// objectMeshFolder.add({ type: "Solid" }, "type", ["Solid", "Point", "Line"]).name("Display type").onChange(function (value) {
//   object.updateSurface(value);
// });



// objectMeshFolder.add(object.display.material, "wireframe");

const cameraPositionFolder = gui.addFolder("Camera position");
cameraPositionFolder.add(camera, "zoom", 0.1, 4).listen().onChange(function (value) {
  camera.updateProjectionMatrix();
});
cameraPositionFolder.add(camera, "fov", 1, 150).listen().onChange(function (value) {
  camera.updateProjectionMatrix();
});

const lightFolder = gui.addFolder("Light and shadow");
lightFolder.add(pointLight, 'intensity', 0, 10)
lightFolder.add(pointLight, "castShadow", true, false).name("Cast shadow");
lightFolder.add(pointLight.position, "x", -20, 20);
lightFolder.add(pointLight.position, "y", -20, 20);
lightFolder.add(pointLight.position, "z", -20, 20);

gui.add({ type: "translate" }, 'type', ["translate", "rotate", "scale"]).name("Transform").onChange(function (value) {
  transformControl.setMode(value);
})
gui.add(animationSet, "callback", ["Reset", "Orbiting", "Rotation"]).name("Animation").onChange(function (value) {
  animation = value;
});
gui.add(object, 'type', ['Cube', 'Sphere', 'Cone', 'Cylinder', 'Torus', 'Knot', 'Tetrahedron', 'Dodecahedron']).name("Object").onChange(function (value) {
  object.updateGeometry(value);
});

const animate = function () {
  requestAnimationFrame(animate);
  animationSet[animation]();
  renderer.render(scene, camera);
  orbitControl.update();
};
animate();