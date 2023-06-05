<template>
    <div class="arc" ref="arcball"></div>
</template>

<script>
import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { arcRenderer, camera } from '../App.vue';

//export let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

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
    
    
    arcRenderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    arcRenderer.setPixelRatio(window.devicePixelRatio);
    //document.body.appendChild(renderer.domElement);
    this.$el.appendChild(arcRenderer.domElement);

    scene = new THREE.Scene();

    //this.$emit('update:camera', camera);

    //this.$emit('update:camera', camera.clone());
    //const domElement = this.$refs.arcball;

    /*
    domElement.addEventListener('mousedown', () => {
      console.log('mousedown picked up');
    });


    document.body.addEventListener('mouseup', () => {
      console.log('mouseup picked up');
    });
    */


    controls = new ArcballControls( camera, arcRenderer.domElement, scene );
    controls.addEventListener('change', this.handleCameraChange);


    camera.position.set( 0, 0, 5 );
    //camera.angle.set(0,0,0);
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

      arcRenderer.render( scene, camera );

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
      

      arcRenderer.setSize(width, height);
    },
    animate() {
      requestAnimationFrame(this.animate);
      controls.update();
      arcRenderer.render(scene, camera);
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