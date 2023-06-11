<template>
    <div class="grid">
        <div id="rendererElement" class="renderer"></div>
        <div id="drawRendererElement" class="renderer"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import InfiniteGridHelper from "./InfiniteGridHelper.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { renderer, camera, scene, plane, drawSceneList, drawRenderer } from '../App.vue';
import { index } from './DrawingInput.vue';

export let grid = InfiniteGridHelper();

export default {
  name: 'GridBackground',
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
  mounted(){

    // Create a renderer
    renderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    drawRenderer.setSize(this.$el.clientWidth, this.$el.clientHeight);
    drawRenderer.setPixelRatio(window.devicePixelRatio);

    let rendererElement = document.getElementById('rendererElement');
    let drawRendererElement = document.getElementById('drawRendererElement');
    rendererElement.appendChild(renderer.domElement);
    drawRendererElement.appendChild(drawRenderer.domElement);

    //document.body.appendChild(renderer.domElement);
    //document.body.appendChild(drawRenderer.domElement);
    // Create a camera
    
    //camera = camera;
    camera.rotation.order = "XYZ";
    camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    camera.rotation.set(new THREE.Euler(this.cameraAngle.x, this.cameraAngle.y, this.cameraAngle.z));

    
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    //renderer.setClearAlpha(0);


    scene.add(grid);

    const loader = new GLTFLoader();

    loader.load( './model.glb', function ( gltf ) {
      console.log("getting model");

      scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //let rotationSpeed = 0.01; // Initial rotation speed
    const self = this;
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the cube

        camera.position.copy(self.cameraPosition);
        camera.rotation.set(self.cameraAngle.x, self.cameraAngle.y, self.cameraAngle.z);
        plane.rotation.set(self.cameraAngle.x, self.cameraAngle.y, self.cameraAngle.z);

        const frontVector = new THREE.Vector3(0, 0, 4); // Direction in front of the camera
        const planePosition = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(frontVector.z));
        plane.position.copy(planePosition);

        //plane.position.copy(self.camera.position);
        //plane.position.copy(camera.getWorldDirection().multiplyScalar(5));

       // plane.lookAt(camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3())));

        //const offset = new THREE.Vector3(-1, -1, -4); // Adjust the value based on your desired distance
        //const planePosition = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(offset.z));
        //plane.position.copy(planePosition);

        // Calculate the rotation to make the plane perpendicular to the camera
        //const target = planePosition.clone().add(camera.getWorldDirection(new THREE.Vector3()));
        //plane.lookAt(target);

        // make the plane.position plus 5 perpendicular to the camera
        //plane.position.copy(self.cameraPosition);
        //plane.position.add(camera.getWorldDirection().multiplyScalar(5));
        
        //planeL.rotation.set(self.cameraAngle.x, self.cameraAngle.y, self.cameraAngle.z);

        //plane.position.set(self.cameraPosition.x-10, self.cameraPosition.y-10, self.cameraPosition.z-10);

        // Render the scene with the camera
        
        renderer.render(scene, camera);
        drawRenderer.render(drawSceneList[index], camera);
        
        
    }
    this.windowResizeHandler();
    animate();
    window.addEventListener('resize', this.windowResizeHandler);
  }, 
  beforeUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
},
  methods: {
    windowResizeHandler() {
        const width = this.$el.clientWidth;
        const height = this.$el.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        drawRenderer.setSize(width, height);
    }
  }
}
</script>

<style>

.grid {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.renderer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

</style>