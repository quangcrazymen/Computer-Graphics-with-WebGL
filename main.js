function init(){
    // INITIATE LIBRARY
    const scene = new THREE.Scene();
    const gui = new dat.GUI();

    //scene.fog = new THREE.FogExp2(0xffffff,0.3)
    //const box = getBox(1,1,1)
    const plane = getPlane(30)
    const sphere = getSphere(0.05)
    const boxGrid = getBoxGrid(10,1.5)
    boxGrid.name = 'boxGrid'
    //light
    const pointLight = getPointLight(1,2)
    const spotLight = getSpotLight(1,2)
    const helper = new THREE.CameraHelper(spotLight.shadow.camera)
    plane.rotation.x = Math.PI/2
    //box.position.y = box.geometry.parameters.height/2
    //console.log()
    //box.name='box-1'
    //scene.add(box)
    scene.add(plane)
    scene.add(boxGrid)
    // POINT LIGHT
    // scene.add(pointLight)
    // spotLight.position.y=1.25
    // pointLight.position.y=1.25
    // pointLight.add(sphere)
    // plane.position.y=1
    // pointLight.name='pointLight-1'
    // pointLight.intensity = 2

    //SPOT LIGHT
    scene.add(spotLight)
    scene.add(helper)
    spotLight.position.y=1.25
    spotLight.position.y=1.25
    spotLight.add(sphere)
    //plane.position.y=1
    spotLight.name='pointLight-1'
    spotLight.intensity = 2

    // GUI CONTROLLER
    gui.add(spotLight,'intensity',0,10)
    gui.add(spotLight.position,'x',0,20)
    gui.add(spotLight.position,'y',0,20)
    gui.add(spotLight.position,'z',0,20)
    gui.add(spotLight,'penumbra',0,1)

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    camera.position.z=5
    camera.position.x=1.5
    camera.position.y=1.5

    camera.lookAt(new THREE.Vector3(0,0,0))
    const renderer = new THREE.WebGLRenderer();
    // RENDER SHADOW
    renderer.shadowMap.enabled=true;

    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)')
    document.getElementById('webgl').appendChild(renderer.domElement)

    // INITIATE CONTROLS
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    renderer.render(
        scene,
        camera
    )
    update(renderer,scene,camera,controls)
    return scene
}
function getBox(w,h,d){
    const geometry = new THREE.BoxGeometry(w,h,d);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.castShadow =true
    return mesh
}

function getPlane(size){
    const geometry = new THREE.PlaneGeometry(size,size);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side: THREE.DoubleSide
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    mesh.receiveShadow =true
    return mesh
}

function getSphere(r){
    const geometry = new THREE.SphereGeometry(r,24,24);
    const material= new THREE.MeshBasicMaterial({
        color: 'rgb(255,0,0)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    return mesh
}


function getBoxGrid(amount,separationMultiplier){
    const group = new THREE.Group()

    for(let i=0;i<amount;i++){
        let obj =getBox(1,1,1)
        obj.position.x = i * separationMultiplier
        obj.position.y = obj.geometry.parameters.height/2
        group.add(obj)
        for(let j=1;j<amount;j++){
            let obj =getBox(1,1,1)
            obj.position.x = i * separationMultiplier
            obj.position.y = obj.geometry.parameters.height/2
            obj.position.z = j * separationMultiplier
            group.add(obj)
        }
    }
    group.position.x = -(separationMultiplier*(amount-1))/2
    group.position.z = -(separationMultiplier*(amount-1))/2

    return group

}
//Different type of light
function getPointLight(intensity){
    const light =new THREE.PointLight(0xffffff,intensity)
    light.castShadow = true
    return light
}

function getSpotLight(intensity){
    const light =new THREE.SpotLight(0xffffff,intensity)
    light.castShadow = true
    light.shadow.bias = 0.001
    light.shadow.mapSize.width=2048
    light.shadow.mapSize.height=2048
    return light
}

function update(renderer,scene,camera,controls){
    renderer.render(
        scene,
        camera
    )

    const boxGrid = scene.getObjectByName('boxGrid')
    // boxGrid.children.forEach(function(child){
    //     child.scale.y = Math.random()
    // })
    //const light =scene.getObjectByName('pointLight-1')
    // const plane = scene.getObjectByName('plane-1')
    //light.position.y+=-0.002
    //light.rotation.x+=2
    // scene.traverse(function(child){
    //     child.scale.y=1.5
    // })
    // const timer = Date.now() * 0.00025;

	// light.position.x = Math.sin( timer * 7 ) * 3.0;
	// light.position.y = Math.cos( timer * 5 ) * 0.40;
	// light.position.z = Math.cos( timer * 3 ) * 0.3
	// for ( let i = 0; i < group.children.length; i ++ ){
	// 	const child = group.children[ i ];
	// 	child.rotation.y += 0.00
	// }
    controls.update()
    requestAnimationFrame(function(){update(renderer,scene,camera,controls)})
}

const scene = init()
console.log(scene)