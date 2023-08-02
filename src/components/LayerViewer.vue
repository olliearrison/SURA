<template>
    <div class="layer-viewer">
      <v-sheet class="mx-auto" elevation="0" max-width="800" max-height="100">
        <v-slide-group v-model="model" class="pa-4" show-arrows>
          <v-slide-group-item v-for="(n, index) in layerLength" :key="n">
            <div class="card-wrapper" ref="cardElements">
              <v-card
                width="60"
                height="60"
                :class="['selected-card', { 'transparent-card': index === model }]"
                class="ma-4"
                :variant="index === model ? 'outlined' : undefined"
                @click="selectCard(index)"
              >
                <div class="card-content">
                  <span class="card-text" >{{ n }}</span>
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
  import { frames } from "../App.vue";
  //import { index } from "../components/DrawingInput.vue";
  
  export default {
    data() {
      return {
        model: 0,
        renderers: [],
        layerLength: 1,
      };
    },
    methods: {
      updateLayers() {
        console.log("update");
        this.layerLength = frames.frameList.length;
        this.model = frames.index;
      },
      selectCard(selectedIndex) {
        if (this.model == selectedIndex){
          console.log("???")
          frames.updateCamera();
        }
        this.model = selectedIndex;
        this.$emit('card-selected', selectedIndex);
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
    height: 4%;
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

  .selected-card {
  background-color: rgba(211, 211, 211, 0.2); /* Default color */
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
    display: flex;
    align-items: center;
    justify-content: center;
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
    z-index: 1000;
  }
  
.card-text {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 2100;
  color: rgb(176, 190, 197);
}

  </style>
  