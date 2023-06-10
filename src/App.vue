<template>
  <v-row class="d-flex justify-start align-center" style="height: 100vh;">
  <v-col cols="12" sm="1" md="4" lg="4">
    <v-card class="mx-auto" rounded>
      <v-list class="grey darken-3">
        <!-- Your components go here -->
        <v-list-item>
          <v-list-item-content>
            <v-spacer></v-spacer>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-slider direction="vertical"></v-slider>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-col>
</v-row>

  <UserInput/>
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
import UserInput from './components/UserInput.vue';
import DrawingInput from './components/DrawingInput.vue';
import GridBackground from './components/GridBackground.vue';
import Arcball from './components/ArcballControl.vue';
import * as THREE from 'three';

export let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export let renderer = new THREE.WebGLRenderer();
export let scene = new THREE.Scene();
export let arcRenderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
const geometry = new THREE.PlaneGeometry( 5, 5 );
    const material = new THREE.MeshBasicMaterial( {
      color: 0x000000, 
      side: THREE.DoubleSide,
      opacity: 0.15,
      transparent: true,
    } );
export let plane = new THREE.Mesh( geometry, material );


const geometryL = new THREE.PlaneGeometry( 300, 300 );
    const materialL = new THREE.MeshBasicMaterial( {
      color: 0x000000, 
      side: THREE.DoubleSide,
      opacity: 0.01,
      transparent: true,
    } );
export let planeL = new THREE.Mesh( geometryL, materialL );


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
    planeL.rotateX(Math.PI/2);
    scene.add( plane );
    //scene.add( planeL);

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