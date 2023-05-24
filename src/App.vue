<template>
  <div id="app">
    <GridBackground/>
    <Arcball/>
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
  }
}

</script>

<style>

#app {
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100vw;
  height: 100vh;
}
</style>