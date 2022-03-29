

function init(){
    // INITIATE LIBRARY
    const scene = new THREE.Scene()
    //box.position.y = box.geometry.parameters.height/2
    //console.log()
    //box.name='box-1'
    const box=getBox(1,1,1)
    box.name='BOX1'
    box.position.x=0
    scene.add(box)

    const circle =getCircle(1,27)
    circle.name=('circle')
    scene.add(circle)
    circle.position.x=2

    const cylinder=getCylinder(0.5,1,2,12)
    scene.add(cylinder)
    cylinder.position.x=-2

    const square=drawASquare()
    scene.add(square)
    square.position.x=0
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    //const camera = new THREE.OrthographicCamera( window.innerWidth / - ,window.innerWidth / 1, window.innerHeight / 1, window.innerHeight / - 1, 1, 1000 );
    camera.position.z=5
    camera.position.x=1.5
    camera.position.y=1.5

    camera.lookAt(0,0,0)
    const renderer = new THREE.WebGLRenderer();
    // RENDER SHADOW
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)')
    document.getElementById('webgl').appendChild(renderer.domElement)

    initInput()
    //renderer.render(scene,camera);
    update(renderer,scene,camera)
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
    //mesh.castShadow =true
    return mesh
}
getCircle=(radius,segment)=>{
    const geometry=new THREE.CircleGeometry(radius,segment)
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)'
    })
    const mesh =new THREE.Mesh(geometry,material)
    return mesh
}
getCylinder=(radiusTop,radiusBottom,height,radialSegments = 12)=>{
    //const radiusTop = 4;  // ui: radiusTop
    //const radiusBottom = 4;  // ui: radiusBottom
    //const height = 8;  // ui: height
    //const radialSegments = 12;  // ui: radialSegments
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(255,255,120)'
    })
    const geometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height, radialSegments
    );
    const mesh=new THREE.Mesh(geometry,material)
    return mesh
}

drawASquare=()=>{
    // const material= new THREE.MeshBasicMaterial({
    //     color: 'rgb(255,255,120)'
    // })

    // const square =new THREE.Geometry();
    // square.vertices.push(new THREE.Vector3(x1,y1,0))
    // square.vertices.push(new THREE.Vector3(x1,y2,0))
    // square.vertices.push(new THREE.Vector3(x2,y1,0))
    // square.vertices.push(new THREE.Vector3(x2,y2,0))

    // square.faces.push(new THREE.Face3(0,1,2))
    // square.faces.push(new THREE.Face3(1,2,3))

    // const mesh =new THREE.Mesh(square,material)
    // return mesh
    const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
	    -1.0, -1.0,  1.0,
	     1.0, -1.0,  1.0,
	     1.0,  1.0,  1.0,

	     1.0,  1.0,  1.0,
	    -1.0,  1.0,  1.0,
	    -1.0, -1.0,  1.0
    ] );

// itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const mesh = new THREE.Mesh( geometry, material );
    return mesh
}   

update = (renderer,scene,camera)=>{
    renderer.render(
        scene,
        camera
    )
    const box = scene.getObjectByName('BOX1')
    const circle= scene.getObjectByName('circle')
    box.rotation.x+=0.01
    circle.rotation.x+=0.01
    //circle.position.y+=2
    //box.position.x +=2.3
    //console.log(box)

    requestAnimationFrame(()=>update(renderer,scene,camera))
}
//Initialize user input
initInput =()=>{
    this.keys_={
        right:false,
        up:false,
        down:false,
        left:false
    };
    this.oldKeys={...this.keys_,}
    document.addEventListener('keydown',(e)=>this.OnKeyDown(e));
    document.addEventListener('keyup',(e)=>this.OnKeyUp(e));
}

OnKeyDown=(Event)=>{
    const box = scene.getObjectByName('BOX1')
    switch (Event.keyCode){
        case 68:
            box.position.x+=0.1
            this.keys_.right=true
            break
        case 87:
            box.position.y+=0.1
            this.keys_.up=true
            break
        case 83:
            box.position.y-=0.1
            this.keys_.down=true
            break
        case 65:
            box.position.x-=0.1
            this.keys_.left=true
            break
    }   
}

OnKeyUp=(Event)=>{
    switch (Event.keyCode){
        case 32:
            this.keys_.space=false
            break
        case 87:
            this.keys_.up=false
            break
    }
}



//requestAnimationFrame(render)
const scene = init()
plus=(a,b)=>a+b
console.log(plus(2,5))
console.log(THREE.BufferGeometry)

