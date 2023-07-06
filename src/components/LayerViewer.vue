<template>
    <div class="layer-viewer">
      <v-sheet class="mx-auto" elevation="0" max-width="800">
        <v-slide-group v-model="model" class="pa-4" show-arrows>
          <v-slide-group-item v-for="(n, index) in layerLength" :key="n">
            <div class="card-wrapper" ref="cardElements">
              <v-card
                width="70"
                height="70"
                :class="['transparent-card', { 'selected-card': index === model }]"
                color="blue-grey-lighten-3"
                class="ma-4"
                :variant="index === model ? 'outlined' : undefined"
                @click="selectCard(index)"
              >
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
        model: 0,
        renderers: [],
        layerLength: 1,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.initializeScene();
      });
    },
    methods: {
      initializeScene() {
        this.updateScene();
        this.animate(); // Start the animation loop
      },
      updateScene() {
        const cardElements = this.$refs.cardElements;

        console.log('cardElements:', cardElements.length);
  
        cardElements.forEach((cardElement) => {
        console.log('cardElement:', cardElement)
          const renderer = new WebGLRenderer({ antialias: true });
          renderer.setClearColor(0xffffff, 0);
          const width = cardElement.offsetWidth;
          const height = cardElement.offsetHeight;
          renderer.setSize(width, height);
  
          const cardContentElement = cardElement.querySelector('.card-content');

          cardContentElement.appendChild(renderer.domElement);
  
          this.renderers.push({ cardElement, renderer });
        });
        console.log(this.renderers);
      },
      updateLayers() {
        this.reset();

        this.layerLength = drawSceneList.length;
        this.$nextTick(() => {
            this.updateScene();
        });
      },
      animate() {
        const animateFrame = () => {
          requestAnimationFrame(animateFrame);
        
  
          this.renderers.forEach(({ cardElement, renderer }) => {
            if (!cardElement || !renderer) {
                console.log("DANGER");
                return;
            }


            const scene = drawSceneList[0].remove(plane);
            const cardCamera = camera;
  
            const width = cardElement.offsetWidth;
            const height = cardElement.offsetHeight;
            renderer.setSize(width, height);
  
            renderer.render(scene, cardCamera);
          });
        };
  
        animateFrame();
      },
      selectCard(index) {
        this.model = index;
        console.log('Selected Card Index:', index);
      },
      reset() {
        // Dispose old renderers and remove the canvas from the DOM
        this.renderers.forEach(({ cardElement, renderer }) => {
            const cardContentElement = cardElement.querySelector('.card-content');
            const oldCanvas = cardContentElement.querySelector('canvas');

            // If there's a canvas already, remove it
            if(oldCanvas) {
            cardContentElement.removeChild(oldCanvas);
            console.log("Removed old canvas");
            }

            // Dispose of the renderer
            renderer.dispose();
            renderer = null;
        });

        // Clear the renderers array
        this.renderers = [];
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
    position: relative;
  }

  .card-content canvas {
    z-index: 2000;
    }
  
  </style>
  