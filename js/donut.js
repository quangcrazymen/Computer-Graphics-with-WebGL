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
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  THREE.PCFShadowMap;

const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);

const pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
pointLight.position.set(1.5, 9.5, 11.8 ); 
pointLight.castShadow = true;  false
scene.add( pointLight );

pointLight.shadow.mapSize.width = 512; 
pointLight.shadow.mapSize.height = 512; 
pointLight.shadow.camera.near = 0.5; 
pointLight.shadow.camera.far = 500; 


var object = new DisplayObject("Cube", "Solid", false, "#ffffff");
object.mesh.castShadow = true;
object.mesh.position.z = 2.5;
object.mesh.position.x = 1;
object.mesh.position.y = 1;
scene.add(object.mesh)

const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff} )
planeMaterial.map = textureLoader.load("../assets/textures/wood.jfif")
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );

const helper = new THREE.CameraHelper( pointLight.shadow.camera );
scene.add( helper );

camera.position.x = 0;
camera.position.y = -4;
camera.position.z = 10;

camera.lookAt(new THREE.Vector3(0,0,0));

const animationSet = {
  callback: "Reset",
  "Reset": function(){
    object.mesh.position.x = 1;
    object.mesh.position.y = 1;
  },
  "Rotation": function(){
    object.mesh.rotation.x += 0.1;
    object.mesh.rotation.z += 0.1;
  },
  "Orbiting": function(){
    var orbitRadius = 5.0;
    while(object.mesh.position.x <= orbitRadius){
      object.mesh.position.x += 0.0001;
    }
    object.mesh.position.set(
      Math.cos(Date.now() * 0.001) * orbitRadius,
      Math.sin(Date.now() * 0.001) * orbitRadius,
      2.5
    );
  }
}

const affineTransformation = {
  transform:"Translation",
}
var animation = "Reset";
const objectMeshFolder = gui.addFolder("Mesh setting");
objectMeshFolder.addColor(object, "color").onChange(function(value){
  object.updateColor(value);
});

const objectRotationFolder = gui.addFolder("Object rotation");
objectRotationFolder.add(object.mesh.rotation, "x", 0 , Math.PI * 2);
objectRotationFolder.add(object.mesh.rotation, "y", 0 , Math.PI * 2);
objectRotationFolder.add(object.mesh.rotation, "z", 0 , Math.PI * 2);

const objectScaleFolder = gui.addFolder("Object scale");
objectScaleFolder.add(object.mesh.scale, "x", 1, 10);
objectScaleFolder.add(object.mesh.scale, "y", 1, 10);
objectScaleFolder.add(object.mesh.scale, "z", 1, 10);

const objectTranslateFolder = gui.addFolder("Object translate");
objectTranslateFolder.add(object.mesh.position, "x", 1, 20);
objectTranslateFolder.add(object.mesh.position, "y", 1, 20);
objectTranslateFolder.add(object.mesh.position, "z", 1, 20);

const cameraPositionFolder = gui.addFolder("Camera position");
cameraPositionFolder.add(camera.position, "x", -10, 10);
cameraPositionFolder.add(camera.position, "y", -10, 10);
cameraPositionFolder.add(camera.position, "z", -10, 20);
cameraPositionFolder.add(camera, "near", 0.1, 10).onChange(function(value){
  camera.updateProjectionMatrix();
});
cameraPositionFolder.add(camera, "far", 1000, 2000).onChange(function(value){
  camera.updateProjectionMatrix();
});
const cameraRotationFolder = gui.addFolder("Camera rotation");
cameraRotationFolder.add(camera.rotation, "x", 0 , Math.PI * 2 );
cameraRotationFolder.add(camera.rotation, "y", 0 , Math.PI * 2 );
cameraRotationFolder.add(camera.rotation, "z", 0 , Math.PI * 2 );

const lightFolder = gui.addFolder("Light and shadow");
lightFolder.add(pointLight, 'intensity', 0, 10)
lightFolder.add(object.mesh, "castShadow").name("Cast shadow");
lightFolder.add(pointLight.position, "x", 1, 10);
lightFolder.add(pointLight.position, "y", 1, 10);
lightFolder.add(pointLight.position, "z", 1, 10);

gui.add(animationSet, "callback", ["Reset","Orbiting", "Rotation"]).name("Animation").onChange(function(value){
  animation = value;
});
gui.add(object, 'type', ['Cube', 'Sphere','Cone','Cylinder','Torus']).name("Object")
  .onChange(function(value){
    object.updateGeometry(value);
  });

const animate = function () {
    requestAnimationFrame( animate );
    animationSet[animation]();
    renderer.render( scene, camera );
    orbitControl.update();
};
function constructObject(type){

}
animate();