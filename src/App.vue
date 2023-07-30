<template>
  <div>
    <UserInput/>
    <DrawingInput/>
    <GridBackground :camera-position="camera.position" :camera-angle="camera.angle"/>
    <div id = "arcballContainer">
      <Arcball ref="arcball" 
        :camera-position="camera.position"
        :camera-angle="camera.angle"
        @camera-updated="updateCamera"/>
    </div>
  </div>
</template>



<script>
//import LayerViewer from './components/LayerViewer.vue';
import UserInput from './components/UserInput.vue';
import DrawingInput from './components/DrawingInput.vue';
import GridBackground from './components/GridBackground.vue';
import Arcball from './components/ArcballControl.vue';
import * as THREE from 'three';

export let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export let renderer = new THREE.WebGLRenderer();
export let scene = new THREE.Scene();
export let arcRenderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
export let drawRenderer = new THREE.WebGLRenderer({alpha: true, antialias: true});


const planeGeometry = new THREE.PlaneGeometry( 4, 4 );
    const planeMaterial = new THREE.MeshBasicMaterial( {
      color: 0x745DD9, 
      side: THREE.DoubleSide,
      opacity: 0.25,
      transparent: true,
    } );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );

const sphereGeometry = new THREE.SphereGeometry( 2, 32, 16 ); 
//const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const sphere = new THREE.Mesh( sphereGeometry, planeMaterial );

const cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 2, 32 ); 
//onst material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
const cylinder = new THREE.Mesh( cylinderGeometry, planeMaterial );

//export let canvasIndex = 0;
export let canvas = [plane, sphere, cylinder];

export let drawSceneList = [new THREE.Scene()];
//drawSceneList[0].add(plane);


//import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

export default {
  name: 'App',
  components: {
    UserInput,
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
  mounted (){
    plane.rotateX(Math.PI/2);

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
  overflow: hidden; /* Disable scroll */
}

#app {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Disable scroll */
}

.drawing-input {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#arcballContainer {
  height: calc(100vh - 1em); /* Adjust the height as needed */
}

</style>