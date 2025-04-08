// We need 3 things everytime we use Three.js
 // Scene + Camera + Renderer
 const scene = new THREE.Scene()
 const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
 const renderer = new THREE.WebGLRenderer({ antialias: true})
 
 renderer.setSize( window.innerWidth, window.innerHeight )
 // sets renderer background color
 renderer.setClearColor("#222222")
 document.body.appendChild( renderer.domElement )
 camera.position.z = 5
 
 // resize canvas on resize window
 window.addEventListener( 'resize', () => {
     let width = window.innerWidth
     let height = window.innerHeight
     renderer.setSize( width, height )
     camera.aspect = width / height
     camera.updateProjectionMatrix()
 })
 
 // basic cube
 var geometry = new THREE.BoxGeometry( 1, 1, 1)
 var material = new THREE.MeshStandardMaterial( { color: 0xff0051, flatShading: true, metalness: 0, roughness: 1 })
 var cube = new THREE.Mesh ( geometry, material )
 scene.add( cube )
 
 // basic cube
 var geometry = new THREE.BoxGeometry( 100, 1, 100)
 var material = new THREE.MeshStandardMaterial( { color: 0x00ff51, flatShading: true, metalness: 0, roughness: 1 })
 var groundCube = new THREE.Mesh ( geometry, material )
 scene.add(groundCube)
 groundCube.position.set(0,-1,0)

 // wireframe cube
 var geometry = new THREE.BoxGeometry( 3, 3, 3)
 var material = new THREE.MeshBasicMaterial({color: "#dadada", wireframe: true, transparent: true })
 var wireframeCube = new THREE.Mesh ( geometry, material )
 scene.add( wireframeCube )
 
 // ambient light
 var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.2)
 scene.add( ambientLight )
 
 // point light
 var pointLight = new THREE.PointLight( 0xffffff, 1 );
 pointLight.position.set( 25, 50, 25 );
 scene.add( pointLight );
 
 
 function animate() {
     requestAnimationFrame( animate )
     cube.rotation.x += 0.004;
     cube.rotation.y += 0.04;
     wireframeCube.rotation.x -= 0.01;
     wireframeCube.rotation.y -= 0.01;
     renderer.render( scene, camera )
 }
 //animate()
 renderer.render( scene, camera )
/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1)
var material = new THREE.MeshStandardMaterial( { color: 0xff0051 })
//var material = new THREE.MeshBasicMaterial( { color: 0xff0051 })
var cube = new THREE.Mesh ( geometry, material )
scene.add( cube )
renderer.render( scene, camera )

var geometry = new THREE.BoxGeometry( 3, 3, 3)
var material = new THREE.MeshBasicMaterial( {
 color: "#dadada", wireframe: true, transparent: true
})
var wireframeCube = new THREE.Mesh ( geometry, material )
scene.add( wireframeCube )




camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate )
    cube.rotation.x += 0.04;
    cube.rotation.y += 0.04;
    wireframeCube.rotation.x -= 0.01;
    wireframeCube.rotation.y -= 0.01;
    renderer.render( scene, camera )
   }
   animate()

   var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.5)
scene.add( ambientLight )

var pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.set( 25, 50, 25 );
scene.add( pointLight );
*/