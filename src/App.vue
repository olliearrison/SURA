<template>
  <button @click="logCameraPosition">Log Camera Position</button>
  <div id="app">
    <GridBackground :camera-position="camera.position" :camera-angle="camera.angle"/>
    <Arcball ref="arcball" :camera-position="camera.position"
      :camera-angle="camera.angle"
      @camera-updated="updateCamera"/>
  </div>
</template>


<script>
import GridBackground from './components/GridBackground.vue'
import Arcball from './components/ArcballControl.vue'

export default {
  name: 'App',
  components: {
    Arcball,
    GridBackground
  },
  data (){
    return {
      camera: {
        position: { x: 0, y: 0, z: 5 },
        angle: { x: 0, y: 0, z: 0 }
      }
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
</style>