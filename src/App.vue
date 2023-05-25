<template>
  <button @click="logCameraPosition">Log Camera Position</button>
  <div id="app">
    <GridBackground :camera="camera" />
    <Arcball ref="arcball" :camera="camera" @update:camera="updateCamera"/>
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
      camera: null,
    }
  },
  methods: {
    updateCamera(camera) {
      this.camera = camera;
    },
    logCameraPosition() {
      console.log('Logging camera position');
    console.log(this.camera);
    if (this.camera) {
      console.log(this.camera.position);
    } else {
      console.log('Camera is not initialized');
    }
    },
  },
  mounted() {
  this.$nextTick(() => {
    this.camera = this.$refs.arcball.camera;
    console.log("Mounted camera: ", this.camera);
  });
}

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