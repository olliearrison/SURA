<template>
    <div class="grid"> </div>
</template>

<script>
import * as THREE from 'three';
import InfiniteGridHelper from "./InfiniteGridHelper.js";


export default {
  name: 'GridBackground',
  props: {
  },
  mounted(){
    const scene = new THREE.Scene();

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    document.body.appendChild(renderer.domElement);

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, this.$el.clientWidth/this.$el.clientHeight, 0.1, 1000);
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
  }
}
</script>

<style>

.grid {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>