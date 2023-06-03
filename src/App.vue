<template>
  <DrawingInput/>
  <GridBackground :camera-position="camera.position" :camera-angle="camera.angle"/>
  <div id = "arcballContainer">
    <Arcball ref="arcball" 
      :camera-position="camera.position"
      :camera-angle="camera.angle"
      @camera-updated="updateCamera"/>
    </div>
</template>


<script>
import DrawingInput from './components/DrawingInput.vue'
import GridBackground from './components/GridBackground.vue'
import Arcball from './components/ArcballControl.vue'
import * as THREE from 'three';

export let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export let renderer = new THREE.WebGLRenderer();
export let scene = new THREE.Scene();

export default {
  name: 'App',
  components: {
    DrawingInput,
    Arcball,
    GridBackground
  },
  data (){
    return {
      camera: {
        position: { x: 0, y: 0, z: 5 },
        angle: { x: 0, y: 0, z: 0 }
      },
    };
  },
  methods: {
    updateCamera({ position, angle }) {
      // Update the camera position and angle based on the emitted data
      this.camera.position = position;
      this.camera.angle = angle;
    },
    logCameraPosition() {
      console.log('Logging camera position');
    },
  },
  /*
  mounted() {
  this.$nextTick(() => {
    this.camera = this.$refs.arcball.camera;
    console.log("Mounted camera: ", this.camera);
  });
  */

}

</script>

<style>
body {
  margin: 0;
}

#app {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.drawing-input {
  position: relative;
}

</style>