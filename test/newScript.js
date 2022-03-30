init=()=>{
    const scene = new THREE.Scene()
    // const camera = new THREE.OrthographicCamera( window.width / - 2, window.width / 2, window.height / 2, window.height / - 2, 1, 1000 );
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
    scene.add( camera );
    //
    //Make top-down camera
    //https://stackoverflow.com/questions/53473529/three-js-project-keeping-camera-centered-on-object-in-top-down-view
    //
    camera.position.set(0, 10, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    //Add grid of target
    const targets = getGridOfBoxes(8,3)
    scene.add( targets)
    // Add the ball
    const ball = getSphere(1)
    ball.name = 'ball'
    scene.add(ball)
    //Add ball 2
    const ball2=getSphere(1)
    ball2.name='ball-2'
    scene.add(ball2)
    //Add plane
    const plane = getPlane(10)
    scene.add(plane)
    plane.name= 'plane'
    console.log(plane)

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)')
    document.getElementById('webgl').appendChild(renderer.domElement)
    //renderer.render(scene,camera)
    //console.log(renderer)
    update(renderer,scene,camera)
}
// drawASquare=()=>{
    
// // create a simple square shape. We duplicate the top left and bottom right
// // vertices because each vertex needs to appear once per triangle.
//     const vertices = new Float32Array( [
// 	    -1.0, -1.0,  1.0,
// 	     1.0, -1.0,  1.0,
// 	     1.0,  1.0,  1.0,

// 	     1.0,  1.0,  1.0,
// 	    -1.0,  1.0,  1.0,
// 	    -1.0, -1.0,  1.0
//     ] );

// // itemSize = 3 because there are 3 values (components) per vertex

//     for( i = 0;i<5;i++){
//         const geometry = new THREE.BufferGeometry();
//         geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//         const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
//         const mesh = new THREE.Mesh( geometry, material );
//     }
//     return mesh
// }   

//group of target box

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

function getSphere(r){
    const geometry = new THREE.SphereGeometry(r,24,24);
    const material= new THREE.MeshBasicMaterial({
        color: 'rgb(255,255,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    return mesh
}

getPlane = (size)=>{
    const geometry = new THREE.PlaneGeometry(size,size);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(120,255 ,120)',
        side: THREE.DoubleSide
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    //mesh.receiveShadow =true
    return mesh
}

getGridOfBoxes = (amount,separationMultiplier)=>{
    const group= new THREE.Group()

    for(let i = 0; i<amount;i++){
        let obj  =getBox(2,1,1)
        obj.position.x = i * separationMultiplier
        //obj.position.y =
        group.add(obj)
        for(let j = 1;j<amount;j++){
            let obj  = getBox(2,1,1)
            obj.position.x = i * separationMultiplier
            obj.position.z = j * separationMultiplier
            group.add(obj)
        } 
    }
    group.position.x = -(separationMultiplier*(amount-1))/2
    group.position.z = -(separationMultiplier*(amount-1))/2

    return group
}

var toggle = 0
var toggle2 = 0
// function moveRight() {
//     v = new THREE.Vector3(0, 0, 0.01)
//     rads = THREE.Math.degToRad(totalrotation)
//     v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
//     object.position.add(v)
// }

DegreeDownRight = (object)=>{
    totalrotation=45
    v = new THREE.Vector3(0, 0, 0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}
DegreeUpLeft = (object)=>{
    totalrotation=45
    v = new THREE.Vector3(0, 0, -0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}
DegreeUpRight=()=>{

}

DegreeDownLeft=()=>{
    
}

update= (renderer,scene,camera)=>{
    renderer.render(
        scene,
        camera
    )
    //const square = scene.getObjectByName('square')
    //square.rotation.x+=0.005
    const ball = scene.getObjectByName('ball')
    const ball2 = scene.getObjectByName('ball-2')
    const plane = scene.getObjectByName('plane')

    // move ball in 45 degree: https://stackoverflow.com/questions/65534926/three-js-move-object-using-vector-with-applied-angle
    const planeWidth = plane.geometry.parameters.width
    if(toggle2 === 0){
        if(ball2.position.x>=plane.geometry.parameters.width/2){
            toggle2 = 1
            //ball.position.x-=1
        }
        else{
            DegreeDownRight(ball2)  
        }
    }
    if(toggle2 ===1){
        if(ball2.position.x<=-plane.geometry.parameters.width/2){
            toggle2 = 0
            //ball.position.x-=1
        }
        else{
            DegreeUpLeft(ball2)
        }
    }
    console.log(toggle2)
    
    if(toggle === 0){
        if(ball.position.x>=plane.geometry.parameters.width/2){
            toggle = 1
            //ball.position.x-=1
        }
        else{
            ball.position.x+=0.1  
        }
    }
    if(toggle ===1){
        if(ball.position.x<=-plane.geometry.parameters.width/2){
            toggle = 0
            //ball.position.x-=1
        }
        else{
            ball.position.x-=0.1
        }
    }
    console.log(ball.position)
    // console.log(toggle)
    

    //ball.position.x+=0.2
    requestAnimationFrame(()=>update(renderer,scene,camera))
}

init()
