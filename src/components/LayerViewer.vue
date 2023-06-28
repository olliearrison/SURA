<template>
    <div class="layer-viewer">
      <v-sheet class="mx-auto" elevation="0" max-width="800">
        <v-slide-group v-model="model" class="pa-4" show-arrows>
          <v-slide-group-item v-for="n in 4" :key="n">
            <div class="card-wrapper" ref="cardElements">
              <v-card width="100" height="100" color="white" class="transparent-card ma-4">
                <div class="card-content">
                  <div class="d-flex fill-height align-center justify-center"></div>
                </div>
              </v-card>
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </template>
  
  <script>
  import { WebGLRenderer } from 'three';
  import { camera, drawSceneList, plane } from '../App.vue';
  
  export default {
    data() {
      return {
        model: null,
        renderers: [],
      };
    },
    mounted() {
      this.initializeScene();
    },
    methods: {
      initializeScene() {
        const cardElements = this.$refs.cardElements;
        this.renderers = [];
  
        cardElements.forEach((cardElement) => {
          const renderer = new WebGLRenderer({ antialias: true });
          const width = cardElement.offsetWidth;
          const height = cardElement.offsetHeight;
          renderer.setSize(width, height);
  
          const cardContentElement = cardElement.querySelector('.card-content');
          cardContentElement.appendChild(renderer.domElement);
  
          this.renderers.push(renderer);
        });
  
        this.animate();
      },
      animate() {
        requestAnimationFrame(this.animate);
  
        const cardElements = this.$refs.cardElements;
        cardElements.forEach((cardElement, index) => {
          const renderer = this.renderers[index];
          const scene = drawSceneList[0].remove(plane);
          const cardCamera = camera;
  
          const width = cardElement.offsetWidth;
          const height = cardElement.offsetHeight;
          renderer.setSize(width, height);
  
          renderer.render(scene, cardCamera);
        });
      },
    },
  };
  </script>
  
  
  <style scoped>

  .slide-group {
    color: rgb(176, 190, 197);
    z-index: 1100;
  }
  .layer-viewer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 6%;
    z-index: 1100;
    align-items: center;
    justify-content: center;
    display: flex;
    color: rgb(176, 190, 197);
  }
  
  .v-card {
    background-color: transparent;
    box-shadow: none;
    color: rgb(176, 190, 197);
  }
  
  .transparent-card {
    background-color: transparent;
    border: none;
  }

  .v-sheet {
    position: fixed;
    bottom: 0;
    background-color: rgba(1, 1, 1, 0.7);
    color: rgb(176, 190, 197);
    border-radius: 5px;
    width: 50%;
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
  