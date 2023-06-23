<template>
    <div class="layer-viewer">
      <v-sheet class="mx-auto" elevation="0" max-width="800">
        <v-slide-group
          v-model="model"
          class="pa-4"
          selected-class="bg-success"
          show-arrows
        >
          <v-slide-group-item
            v-for="n in 15"
            :key="n"
            v-slot="{ isSelected, toggle, selectedClass }"
          >
            <v-card
              color="grey-lighten-1"
              width="100"
              height="100"
              :class="['ma-4', selectedClass]"
              @click="toggle"
            >
              <div class="d-flex fill-height align-center justify-center">
                <v-scale-transition>
                  <v-icon
                    v-if="isSelected"
                    color="white"
                    size="48"
                    icon="mdi-close-circle-outline"
                  ></v-icon>
                </v-scale-transition>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
  </template>
  
  <script>
  export default {
    data: () => ({
      model: null,
    }),
  }
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
  
  .v-sheet {
    position: fixed;
    bottom: 0;
    background-color: transparent;
    color: rgb(176, 190, 197);
  }
  
  .v-card {
    color: rgb(176, 190, 197);
  }
  </style>
  