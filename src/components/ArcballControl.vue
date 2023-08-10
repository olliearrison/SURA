<template>
    <div class="arc" ref="arcball"></div>
</template>

<script>
import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { arcRenderer, frames } from '../App.vue';
import { camera } from './Camera.js';
import { cameraDistance } from './DrawingInput.vue'

//export let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

let scene;
export let controls;

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



    controls = new ArcballControls( camera, arcRenderer.domElement, scene );
    controls.target.set(10,1,0);

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

      if (frames.needsUpdate){
        camera.position.copy(frames.getFrame().pos);
        const angle = frames.getFrame().angle;
        camera.rotation.set(angle.x, angle.y, angle.z);
        camera.updateProjectionMatrix();

        const frontVector = new THREE.Vector3(0, 0, cameraDistance); // Direction in front of the camera
        const canvasPosition = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(frontVector.z));
        controls.target.copy(canvasPosition);


        controls.update();
        frames.needsUpdate = false;
      }

      if (frames.guideNeedsUpdate){
        const angle = frames.getFrame().angle;
        camera.rotation.set(angle.x, angle.y, angle.z);

        const canvasPosition = frames.getFrame().guidePointPosition;

        const frontVector = new THREE.Vector3(0, 0, -cameraDistance); // Direction in front of the camera

        const cameraPosition = canvasPosition.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(frontVector.z));
        camera.position.copy(cameraPosition);

        camera.updateProjectionMatrix();
        controls.target.copy(canvasPosition);
        controls.update();
        frames.guideNeedsUpdate = false;

      }
      
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

      arcRenderer.setSize(width, height);
      arcRenderer.setPixelRatio(window.devicePixelRatio);
    },
    animate() {
      requestAnimationFrame(this.animate);

      if (frames.needsUpdate || frames.guideNeedsUpdate){
        this.handleCameraChange();
      }

      const frontVector = new THREE.Vector3(0, 0, cameraDistance); // Direction in front of the camera
      const canvasPosition = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(frontVector.z));
      controls.target.copy(canvasPosition);


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
  width: 20%;
  height: 20%;
}
</style>