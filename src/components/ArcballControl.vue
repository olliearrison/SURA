<template>
    <div class="arc"> </div>
</template>

<script>
import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';


export default {
  name: 'ArcballControl',
  props: {
  },
  mounted() {
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    this.$el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

    const controls = new ArcballControls( camera, renderer.domElement, scene );

    controls.addEventListener( 'change', function () {

      renderer.render( scene, camera );

    } );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 20, 100 );
    controls.update();

  }
}
</script>

<style>
.arc {
  position: absolute;
  top: 100px;
  right: 100px;
  width: 150px;  /* Adjust these as necessary */
  height: 150px; /* Adjust these as necessary */
}
</style>