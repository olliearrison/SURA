<template>
    <div class="layer-viewer">
      <v-sheet class="mx-auto" elevation="0" max-width="800">
        <v-slide-group
          v-model="model"
          class="pa-4"
          show-arrows
        >
          <v-slide-group-item
            v-for="n in 3"
            :key="n"
          >
            <div class="card-wrapper" ref="cardElements">
              <v-card
                width="100"
                height="100"
                class="transparent-card ma-4"
              >
                <div class="card-content">
                  <div class="d-flex fill-height align-center justify-center">
                  </div>
                </div>
              </v-card>
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </template>
  
  <script>
  import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
  
  export default {
    data() {
      return {
        model: null,
      };
    },
    mounted() {
      this.initializeScene();
    },
    methods: {
      initializeScene() {
        // Create a scene
        const scene = new Scene();
  
        // Create a camera
        const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
  
        // Create a renderer
        const renderer = new WebGLRenderer({ antialias: true });
        const cardElements = this.$refs.cardElements;
        const width = cardElements[0].offsetWidth;
        const height = cardElements[0].offsetHeight;
        renderer.setSize(width, height);
        cardElements.forEach((cardElement) => {
          const cardContentElement = cardElement.querySelector('.card-content');
          cardContentElement.appendChild(renderer.domElement);
        });
  
        // Create a cube
        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new Mesh(geometry, material);
        scene.add(cube);
  
        // Render the scene
        function animate() {
          requestAnimationFrame(animate);
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
        animate();
      },
    },
  };
  </script>
  
  <style scoped>
  .layer-viewer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 8%;
    z-index: 1100;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  
  .v-card {
    background-color: transparent;
    box-shadow: none;
  }
  
  .transparent-card {
    background-color: transparent;
    border: none;
  }

  .v-sheet {
    position: fixed;
    bottom: 0;
    background-color: transparent;
    color: rgb(176, 190, 197);
  }
  
  .card-wrapper {
    display: inline-block;
  }
  
  .card-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  