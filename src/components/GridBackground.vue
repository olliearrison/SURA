<template>
    <div class="grid"> </div>
</template>

<script>
import * as THREE from 'three';
import InfiniteGridHelper from "./InfiniteGridHelper.js";
import { renderer, camera, scene } from '../App.vue';


export default {
  name: 'GridBackground',
  props: {
    cameraPosition: {
      type: Object,
      required: true
    },
    cameraAngle: {
      type: Object,
      required: true
    }
  },
  mounted(){

    // Create a renderer
    renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Create a camera
    
    //camera = camera;
    camera.rotation.order = "XYZ";
    camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    camera.rotation.set(new THREE.Euler(this.cameraAngle.x, this.cameraAngle.y, this.cameraAngle.z));


    renderer.setClearColor(new THREE.Color(0xFFFFFF));


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
    grid.rotation.x += .1;
    grid.rotation.y += .2;

    scene.add(grid);

    let rotationSpeed = 0.01; // Initial rotation speed
    const self = this;
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the cube
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;

        camera.position.copy(self.cameraPosition);
        camera.rotation.set(self.cameraAngle.x, self.cameraAngle.y, self.cameraAngle.z);

        // Render the scene with the camera
        renderer.render(scene, camera);
        
    }
    this.windowResizeHandler();
    animate();
    window.addEventListener('resize', this.windowResizeHandler);
  }, 
  beforeUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
},
  methods: {
    windowResizeHandler() {
        console.log("hi");
        const width = this.$el.clientWidth;
        const height = this.$el.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
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