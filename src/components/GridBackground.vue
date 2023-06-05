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


    const grid = InfiniteGridHelper();

    scene.add(grid);

    let rotationSpeed = 0.01; // Initial rotation speed
    const self = this;
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the cube

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