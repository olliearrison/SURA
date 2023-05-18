<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import * as THREE from 'three';
import InfiniteGridHelper from "./components/InfiniteGridHelper.js";


const scene = new THREE.Scene();

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
camera.position.x = 0;


renderer.setClearColor(new THREE.Color(0x000000));


// Create a geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

const edges = new THREE.EdgesGeometry(geometry);

// Create a material

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Create a mesh

const cube = new THREE.LineSegments(edges, lineMaterial);

// Add the mesh to the scene


scene.add(cube);

const grid = InfiniteGridHelper();
scene.add(grid);

let rotationSpeed = 0.01; // Initial rotation speed

// Create a button
const button = document.createElement('button');
button.textContent = 'Increase Speed';
document.body.appendChild(button);

// Add event listener to the button
button.addEventListener('click', () => {
  rotationSpeed += 0.01; // Increase the rotation speed by 0.01
});

function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += rotationSpeed;
  cube.rotation.y += rotationSpeed;

  grid.rotation.x += .005;
  grid.rotation.y += .003;

  // Render the scene with the camera
  renderer.render(scene, camera);
}

animate();



import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
