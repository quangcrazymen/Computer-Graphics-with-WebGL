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
    //Add ball 3
    const ball3 = getSphere(1)
    ball3.name = 'ball-3'
    scene.add(ball3)
    //Add plane
    const plane = getPlane(25)
    scene.add(plane)
    plane.name= 'plane'
    plane.rotation.x = Math.PI/2
    //Add lighting
    const pointLight = getPointLight(2)
    scene.add(pointLight)
    pointLight.position.y=10
    const lightBulb=getSphere(0.5)
    pointLight.add(lightBulb)
    //Add a Paddle
    const paddle = getBox(7,1,0.5)
    scene.add(paddle)
    paddle.position.z=plane.geometry.parameters.height/2-paddle.geometry.parameters.height/2
    paddle.name='paddle'
    //create bounding box for the paddle
    //let paddleBB=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3())
    //paddleBB.setFromObject(paddle)
    //create bounding box for the ball
    //let ballBB = new THREE.Sphere(ball3.position,1)

    initInput()
    console.log(plane.geometry.parameters)

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)')
    document.getElementById('webgl').appendChild(renderer.domElement)

    //Initiate Controls
    const control=new THREE.OrbitControls(camera,renderer.domElement)
    console.log(control)
    //console.log(renderer)
    update(renderer,scene,camera,control)
    return scene
}


//group of target box
getPointLight = (intensity)=>{
    const light = new THREE.PointLight(0xffffff,intensity)
    return light
}

function getBox(w,h,d){
    const geometry = new THREE.BoxGeometry(w,h,d);
    const material= new THREE.MeshPhongMaterial({
        color: 'rgb(255,120,120)'
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
        color: 'rgb(255,0,255)'
    })
    const mesh =new THREE.Mesh(
        geometry,
        material
    )
    return mesh
}

getPlane = (size)=>{
    const geometry = new THREE.PlaneGeometry(2*size,size);
    const material= new THREE.MeshBasicMaterial({
        color: 'rgb(0,0 ,120)',
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

let upRight = 0
let downLeft = 1
let downRight = 0
let upLeft =0

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
DegreeDownLeft=(object)=>{
    totalrotation=-45
    v = new THREE.Vector3(0, 0, 0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

DegreeUpRight=(object)=>{
    totalrotation=-45
    v = new THREE.Vector3(0, 0, -0.1)
    rads = THREE.Math.degToRad(totalrotation)
    v.applyAxisAngle( new THREE.Vector3(0, 1, 0), rads);
    object.position.add(v)
}

function checkCollisions(paddle,ball){
    if(paddle.intersectBox(ball)){
        ball.material.transparent = true
        ball.material.opacity = 0.5
        ball.material.color = new THREE.Color(Math.random()*0xffffff)
    }
    else{
        ball.material.opacity=1.0
    }
}

update= (renderer,scene,camera,control)=>{
    renderer.render(
        scene,
        camera
    )
    // Trajectory of the ball when it hit a paddle
    //https://gamedev.stackexchange.com/questions/4253/in-pong-how-do-you-calculate-the-balls-direction-when-it-bounces-off-the-paddl

    const plane = scene.getObjectByName('plane')
    // move ball in 45 degree: https://stackoverflow.com/questions/65534926/three-js-move-object-using-vector-with-applied-angle
    const planeWidth = plane.geometry.parameters.width
    const planeHeight = plane.geometry.parameters.height
    const paddle = scene.getObjectByName('paddle')

    //Control ball 3
    const ball3 = scene.getObjectByName('ball-3')
    if(upRight === 1){
        if(Math.abs(ball3.position.z)>= planeHeight/2){
            upRight=0
            downRight = 1
            //To prevent the ball from stucking in the boundary
            DegreeDownLeft(ball3)
        }
        else if(Math.abs(ball3.position.x)>= planeWidth/2){
            upLeft=1
            upRight=0
            DegreeDownLeft(ball3)
        }
        else{
            DegreeUpRight(ball3)  
        }
    }
    else if(downRight === 1){
        if(Math.abs(ball3.position.x)>= planeWidth/2){
            downRight=0
            downLeft = 1
            DegreeUpLeft(ball3)
        }
        else if(Math.abs(ball3.position.z)>= planeHeight/2){
            upRight = 1
            downRight = 0
            DegreeUpLeft(ball3)
        }
        else{
            DegreeDownRight(ball3)  
        }
    }
    else if(downLeft === 1){
        if(Math.abs(ball3.position.x)>= planeWidth/2 ){
            downRight=1
            downLeft=0
            DegreeUpRight(ball3)
        }
        else if(Math.abs(ball3.position.z)>= planeHeight/2){
            upLeft= 1
            downLeft=0 
            DegreeUpRight(ball3)
        }
        else{
            DegreeDownLeft(ball3)  
        }
    }
    else if(upLeft === 1){
        if(Math.abs(ball3.position.x)>= planeWidth/2 ){
            upLeft=0
            upRight = 1
            DegreeDownRight(ball3)
        }
        else if(Math.abs(ball3.position.z)>= planeHeight/2){
            downLeft=1
            upLeft=0
            DegreeDownRight(ball3)
        }
        else{
            DegreeUpLeft(ball3)  
        }
    }

    //If stuck try to implement this: https://www.youtube.com/watch?v=9H3HPq-BTMo
    if(ball3.position.z>0){
        let ballPosition = Math.abs(ball3.position.z)
        let paddlePosition = Math.abs(paddle.position.x)
            
        // if(Math.sqrt(ballPosition*ballPosition+paddlePosition*paddlePosition)<1){
        //     //console.log("Hit the ball")
        //     ball3.material.transparent = true
        //     ball3.material.opacity = 0.5
        //     ball3.material.color = new THREE.Color(Math.random()*0xffffff)
        // }
        // else{
        //     ball3.material.opacity=1.0
        // }
        console.log(Math.sqrt(ballPosition*ballPosition+paddlePosition*paddlePosition))

    }
    //console.log(ball3.position.z)
    //console.log(paddle.position.x)
    control.update()
    requestAnimationFrame(()=>update(renderer,scene,camera,control))
}
//Add control for the paddle
initInput = ()=>{
    this.keys_ = {
        right:false,
        left:false
    }
    this.oldKeys={...this.keys_,}


    document.addEventListener('keydown',(e)=>this.OnKeyDown(e))
    document.addEventListener('keyup',(e)=>this.OnKeyUp(e))

}

OnKeyDown = (Event)=>{
    const paddle = scene.getObjectByName('paddle')
    switch (Event.keyCode){
        case 68:
            paddle.position.x+=0.5
            this.keys_.right=true
            break
        case 65:
            paddle.position.x-=0.5
            this.keys_.left=true
            break
    }
}
OnKeyUp=(Event)=>{
    switch (Event.keyCode){
        case 68:
            this.keys_.right=false
            break
        case 65:
            this.keys_.left=false
            break
    }
}
const scene=init()