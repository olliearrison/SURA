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
import { renderer, scene, canvas, frames, drawRenderer } from '../App.vue';
import { camera } from './Camera.js';
import { canvasIndex } from './DrawingInput.vue';

export let grid = InfiniteGridHelper();
export let background = new THREE.Object3D();

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

    camera.rotation.order = "XYZ";
    camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    camera.rotation.set(new THREE.Euler(this.cameraAngle.x, this.cameraAngle.y, this.cameraAngle.z));

    
    renderer.setClearColor(new THREE.Color(0xFFFFFF));

    scene.add(grid);

    

    const loader = new GLTFLoader();

    loader.load( './model.glb', function ( gltf ) {
      console.log("getting model");

      background = gltf.scene

    }, undefined, function ( error ) {

      console.error( error );

    } );

    //let rotationSpeed = 0.01; // Initial rotation speed
    const self = this;
    function animate() {
        

        // Rotate the cube
        if (frames.play){
          //console.log(frames.getFrame().pos);

          camera.position.copy(frames.currentPos);
          const angle = frames.currentAngle;
          camera.rotation.set(angle.x, angle.y, angle.z);


        } else {
          camera.position.copy(self.cameraPosition);
          camera.rotation.set(self.cameraAngle.x, self.cameraAngle.y, self.cameraAngle.z);
        }
        canvas[canvasIndex].rotation.set(self.cameraAngle.x, self.cameraAngle.y, self.cameraAngle.z);

        const frontVector = new THREE.Vector3(0, 0, 4); // Direction in front of the camera
        const canvasPosition = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(frontVector.z));
        canvas[canvasIndex].position.copy(canvasPosition);

        renderer.render(scene, camera);

        const s = frames.getFrameScene().add(background);
        let onionSkin = new THREE.Group();
        let point = frames.getFrame().guidePoint;

        if (!frames.play){
          s.add(canvas[canvasIndex]);
          //console.log(frames.getFrameScene().guidePoint);
          s.add(point);
          if (frames.onion){
            onionSkin = frames.allGhostGroups;

            s.add(onionSkin)
          }
        }

        

        drawRenderer.render(s, camera);

        s.remove(background);
        s.remove(point);
        if (frames.onion){
            s.remove(onionSkin);
        }
        frames.getFrameScene().remove(canvas[canvasIndex]);
        
        requestAnimationFrame(animate);
        
        
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
    },
    
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