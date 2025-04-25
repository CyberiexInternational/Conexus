// We need 3 things everytime we use Three.js
 // Scene + Camera + Renderer
 const scene = new THREE.Scene()
 const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
 const renderer = new THREE.WebGLRenderer({ antialias: true})
 
 var WIDTH = window.innerWidth,
 HEIGHT = window.innerHeight,
 ASPECT = WIDTH / HEIGHT,
 UNITSIZE = 250,
 WALLHEIGHT = UNITSIZE / 3,
 MOVESPEED = 100,
 LOOKSPEED = 0.075,
 BULLETMOVESPEED = MOVESPEED * 5,
 NUMAI = 5,
 PROJECTILEDAMAGE = 20;
// Global vars
var t = THREE, cam, controls, clock, projector, model, skin;
var runAnim = true, mouse = { x: 0, y: 0 }, kills = 0, health = 100;
var healthCube, lastHealthPickup = 0;

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
     camera.mbadtk757174
     aspect = width / height
     camera.updateProjectionMatrix()
 })

//Doors and windows are defined by start co-ords, height, width and base height. Orientation and depth are assumed to be identical to the wall that the door / window is part of.

 // basic cube
 var geometry = new THREE.BoxGeometry( 1, 1, 1)
 var material = new THREE.MeshStandardMaterial( { color: 0xff0051, flatShading: true, metalness: 0, roughness: 1 })
 var cube = new THREE.Mesh ( geometry, material )
 scene.add( cube )

 var geometry= new THREE.BoxGeometry(20,20,20)
 /*
 // basic cube
 var geometry = new THREE.BoxGeometry( 100, 1, 100)
 var material = new THREE.MeshStandardMaterial( { color: 0x00ff51, flatShading: true, metalness: 0, roughness: 1 })
 var groundCube = new THREE.Mesh ( geometry, material )
 scene.add(groundCube)
 groundCube.position.set(0,-1,0)
*/
 // wireframe cube
 var geometry = new THREE.BoxGeometry( 3, 3, 3)
 var material = new THREE.MeshBasicMaterial({color: "#dadada", wireframe: true, transparent: true })
 var wireframeCube = new THREE.Mesh ( geometry, material )
 scene.add( wireframeCube )
 
 // wireframe cube
 var geometry = new THREE.BoxGeometry( 6, 6, 6)
 var material = new THREE.MeshBasicMaterial({color: "#dadada", wireframe: true, transparent: true })
 var wireframeBigCube = new THREE.Mesh ( geometry, material )
 scene.add( wireframeBigCube )

 //The doors will be described by location (x,y,z) and height/depth, and consist of two blocks placed in a gap between two walls.
 
// ambient light
 var ambientLight = new THREE.AmbientLight ( 0xffffff, 0.2)
 scene.add( ambientLight )
 
 // point light
 var pointLight = new THREE.PointLight( 0xffffff, 1 );
 pointLight.position.set( 25, 50, 25 );
 scene.add( pointLight );

 //THis function sets up the animation sequence and then calls itself recursively to consistently update the scene...
 function animate() {
     requestAnimationFrame( animate )
     cube.rotation.x += 0.4;
     cube.rotation.y += 0.4;
     wireframeCube.rotation.x -= 1;
     wireframeCube.rotation.y -= 1;
     renderer.render( scene, camera )
 }
 //animate()
 renderer.render( scene, camera )
//init();