<template>
    <div class="arc" ref="arcballContainer"></div>
</template>

<script>
import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

export let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
export let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
let controls, scene;

export default {
  name: 'ArcballControl',
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
  /*
  data() {
    return {
      renderer: renderer,
      controls: null,
      scene: null
    };
  },
  */
  mounted() {
    
    renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    this.$el.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    //this.$emit('update:camera', camera);

    //this.$emit('update:camera', camera.clone());

    controls = new ArcballControls( camera, renderer.domElement, scene );
    controls.addEventListener('change', this.handleCameraChange);


    camera.position.set( 0, 0, 5 );
    this.windowResizeHandler();
    controls.update();
    this.animate();
    window.addEventListener('resize', this.windowResizeHandler);

  },beforeUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
    controls.removeEventListener('change', this.handleCameraChange);
  },
   methods: {
    handleCameraChange() {
      const cameraPosition = camera.position.clone();
      const cameraAngle = camera.rotation.clone();


      this.$emit('camera-updated', {
        position: cameraPosition,
        angle: cameraAngle
      });

      renderer.render( scene, camera );

    },

    windowResizeHandler() {
      const width = this.$el.clientWidth;
      const height = this.$el.clientHeight;

      /*
      this.$emit('update:camera', {
        aspect: width / height,
        width: width,
        height: height
      });
      */
      

      renderer.setSize(width, height);
    },
    animate() {
      requestAnimationFrame(this.animate);
      controls.update();
      renderer.render(scene, camera);
    }
  }
}
</script>

<style>
.arc {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 150px;  /* Adjust these as necessary */
  height: 150px; /* Adjust these as necessary */
}
</style>