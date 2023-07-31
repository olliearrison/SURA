<template>
    <div class="drawing-input" >
        <LayerViewer @card-selected="handleCardSelected" ref="layerViewer"/>
        <v-app>
            <v-color-picker v-if="showColorPicker" v-model="color"></v-color-picker>

            <v-app-bar class="small-bar justify-center" >
                <div class="spacer"></div>
                <v-btn icon class="fixed-button" @click="toggleColorSelect">
                    <v-icon>mdi-home</v-icon>
                </v-btn>
                <div class="spacer"></div>
                <v-btn icon class="fixed-button">
                    <v-icon>mdi-file</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon class="fixed-button" @click="toggleNewMode">
                    <v-icon>
                        {{ newMode ? 'mdi-toggle-switch-outline' : 'mdi-toggle-switch-off-outline' }}
                    </v-icon>
                </v-btn>
                <div class="spacer"></div>
                <v-btn icon class="fixed-button" @click="loadPosition">
                    <v-icon>mdi-target</v-icon>
                </v-btn>
                <div class="spacer"></div>
                <v-btn icon class="fixed-button" ref="eraserButton" @click="toggleEraserMode">
                    <v-icon>
                    {{ stroke.eraser ? 'mdi-eraser' : 'mdi-brush-outline' }}
                    </v-icon>
                </v-btn>
                <div class="spacer"></div>
                <v-btn icon class="fixed-button">
                    <v-icon>mdi-layers-outline</v-icon>
                </v-btn>
                <div class="spacer"></div>
                <v-btn icon class="fixed-button" @click="toggleOnionSkin">
                    <v-icon>
                        {{ onionSkin ? 'mdi-animation' : 'mdi-animation-outline' }}
                    </v-icon>
                </v-btn>
                
            </v-app-bar>

        


            <v-card class="pa-2" outlined>
                <v-container class="align-center">
                    <v-row justify="center">
                        <v-col cols="12" sm="6" md="4">
                            <v-slider
                                show-ticks
                                class="my-slider"
                                color="blue-grey-lighten-3"
                                density="compact"
                                track-size="15"
                                direction="vertical"
                                v-model="sizeMultiplier"
                                :step="0.1"
                                :min="0.4"
                                :max="1.5"
                                @click="updateSizeMultiplier"
                                >
                            </v-slider>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols="12" sm="6" md="4">
                            <v-btn icon class="fixed-button" @click="showColorPicker = !showColorPicker">
                                        <v-icon>mdi-palette</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols="12" sm="6" md="4">
                            <v-btn icon class="fixed-button" @click="nextIcon">
                                <v-icon>{{ icons[currentIconIndex] }}</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols="12" sm="6" md="4">
                            <v-btn icon class="fixed-button custom-button" :style="{ color: canRedo ? '#B0BEC5' : '#78909C'}" @click="redo">
                                        <v-icon>mdi-arrow-u-right-top</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols="12" sm="6" md="4">
                            <v-btn icon class="fixed-button custom-button" :style="{ color: canUndo ? '#B0BEC5' : '#78909C'}" @click="undo">
                                        <v-icon>mdi-arrow-u-left-top</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            
            
            <v-row class="bottom-buttons">
                <v-btn class="fixed-button" @click="backward" large>
                    <v-icon>
                        mdi-minus
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="fixed-button" @click="forward" large>
                    <v-icon>
                        mdi-plus
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="fixed-button" @click="play" large>
                    <v-icon>
                        {{ rotatingCondition ? 'mdi-pause' : 'mdi-play' }}
                    </v-icon>
                </v-btn>
            </v-row>
    </v-app>
    </div>
    
</template>
  
<script>
import LayerViewer from "./LayerViewer.vue";
import { draw } from "./DrawHelper.js";
import { HistoryController } from "./HistoryController.js";
import { arcRenderer, drawSceneList } from '../App.vue';
import * as THREE from 'three';

export let index = 0;
export let canvasIndex = 0;

let drawing = false;

let rotatingInterval = null;  // Interval to rotate index
let historyController = new HistoryController();

export default {
    name: 'DrawingInput',
    components: {
        LayerViewer,
    },

    data(){
        return {
            icons: ['mdi-square-outline', 'mdi-sphere', 'mdi-cylinder'],
            currentIconIndex: 0,
            isDrawing: false,
            rotatingCondition: false,
            stroke: {
                show_stroke: true,
                lineWidth: .25,
                color: 0x000000,
                eraser: false,
                
                
            },
            showColorPicker: false,
            onionSkin: false,
            canUndo: false,
            canRedo: false,
            sizeMultiplier: .5,
            newMode: false,
        };
    },
    computed: {
        color: {
        get() {
            // Convert color from 0xRRGGBB to #RRGGBB when getting
            return '#' + this.stroke.color.toString(16).padStart(6, '0');
        },
        set(value) {
            // Convert color from #RRGGBB to 0xRRGGBB when setting
            this.stroke.color = parseInt(value.slice(1), 16);
        },
        },
    },
    mounted (){
        this.$watch(() => this.rotatingCondition, (newValue) => {
            console.log("hello");
            if(newValue){
                if(rotatingInterval == null){
                    console.log("hello");
                    // Rotate the index 5 times per second
                    rotatingInterval = setInterval(() => {
                        index = (index + 1) % drawSceneList.length;
                    }, 1000/5); // 1000 ms (1s) divided by 5 gives 200 ms
                }
            }else{
                // Stop rotating the index
                if(rotatingInterval != null){
                    clearInterval(rotatingInterval);
                    rotatingInterval = null;
                }
            }
        });
        // document.body 
        /*
        const button = this.$refs.eraserButton;
        
        button.addEventListener('click', () => {
            console.log("pointer down");
            this.isEraserMode = !this.isEraserMode;
        });
        */


        document.body.addEventListener('mouseup', (event) => {
            if (this.inCanvas(event) && drawing){
                this.handleMouseUp();
                drawing = false;
            }
        });

        document.body.addEventListener('mousedown', (event) => {
            if (this.inCanvas(event)) {
                drawing = true;
                this.handleMouseDown(event);
            }
        });

        document.body.addEventListener('pointermove', (event) => {
            if (event.pressure > 0){
                this.stroke.lineWidth = event.pressure * .5 * this.sizeMultiplier;
            }

        });

        document.body.addEventListener('mousemove', (event) => {
            //console.log(event.pressure);
            if (this.inCanvas(event)) {
                if (drawing) {
                    this.handleMouseMove(event);
                }
            } else {
                if (drawing){
                    this.handleMouseUp();
                    drawing = false;
                }
            }
        });
        //this.handleMouseMove(event);

       

    },
    methods: {
        inCanvas( event ) {
            var rect = arcRenderer.domElement.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;

            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < rect.width/2){
                return false;
            }
            return true;
        },
        handleMouseMove(event) {
            if (!this.isDrawing) return;
            let x = event.clientX;
            let y = event.clientY;
            // Assuming a 2D drawing, so Z is constant, but this could be modified as per the requirement.
            draw.onMove(x, y, this.stroke);
        },
        handleMouseDown(event) {
            //console.log("mouse down");
            this.isDrawing = true;
            let x = event.clientX;
            let y = event.clientY;
            draw.onStart(x, y, this.stroke);
            this.canUndo = historyController.canUndo();
            this.canRedo = historyController.canRedo();
        },
        handleMouseUp() {
            this.isDrawing = false;
            let result = draw.onEnd(this.stroke);
            if (result[0] != false){
                historyController.action(result);
            }
            this.canUndo = historyController.canUndo();
            this.canRedo = historyController.canRedo();
            //console.log(this.canUndo);
        },
        toggleEraserMode() {
            this.stroke.eraser = !this.stroke.eraser;
        },
        toggleColorSelect(){
            console.log(this.showColorPicker);
            this.showColorPicker = !this.showColorPicker;
        },
        toggleOnionSkin(){
            this.onionSkin = !this.onionSkin;
        },
        toggleNewMode(){
            this.newMode = !this.newMode;
        },
        backward() {
            const len = drawSceneList.length;
            console.log(len);

            historyController = new HistoryController();
            if (index > -1) {
                drawSceneList.splice(index, 1);
            }
            index --;
            //drawSceneList.remove(index);
            const layerViewer = this.$refs.layerViewer;
            layerViewer.updateLayers();
        },
        forward() {
            console.log(index);
            console.log("forwardddd");
            const newScene = new THREE.Scene();
            drawSceneList.push(newScene);
            historyController = new HistoryController();
            index++;
            
            const layerViewer = this.$refs.layerViewer;
      
            // Call the function in the child component
            layerViewer.updateLayers();
        },
        play() {
            this.rotatingCondition = !this.rotatingCondition;
            this.isDrawing = this.rotatingCondition;
        },
        undo(){
            historyController.undo();
            this.canRedo = historyController.canRedo();
        },
        redo(){
            historyController.redo();
            this.canUndo = historyController.canUndo();
        },
        updateSizeMultiplier() {
            // .5 is the constant multiplier
            // this is multiplied by .5, the default pressure
            this.stroke.lineWidth = .25 * this.sizeMultiplier;
        },
        handleCardSelected(selectedIndex) {
        // Use the selected index as needed
            console.log('Selected index:', selectedIndex);
            index = selectedIndex;
        },
        nextIcon() {
            
            this.currentIconIndex = (this.currentIconIndex + 1) % this.icons.length;
            console.log("index changed", this.currentIconIndex);
            canvasIndex = this.currentIconIndex;

        },
        loadPosition(){

        },
    }
}
</script>

<style scoped>
.drawing-input {
    width: 100%;
    height: 100%;
}

.fixed-button {
  z-index: 1200;
  background-color: rgb(33, 33, 33);
  color: rgb(176, 190, 197);
}

.v-card {
  position: fixed;
  top: 10%;
  bottom: 90%;
  left: 1%;
  display: flex;
  align-items: center;
  z-index: 998;
  height: 80%;
  width: 5%;
  justify-content: flex-start;
  background-color: rgba(1, 1, 1, 0.7);
}

.button-container {
  position: fixed;
  top: 2%;
  left: 2%;
  height: 50%;
  z-index: 999;
  width: 10%;
}

.spacer {
  width: 1%;
  height: 1%;
}

.small-bar {
  height: 8%;  /* Adjust this value as needed */
  background-color: rgba(1, 1, 1, 0.7) !important;
}

.bottom-buttons {
  position: fixed;
  width: 20%;
  bottom: 40px; /* Adjust the bottom value as needed */
  left: 2%; /* Adjust the right value as needed */
  z-index: 999; /* Set an appropriate z-index if necessary */
  /* Add any other desired styles */
}

.v-color-picker {
    position: fixed;
    top: 10%;
    left: 10%;
    z-index: 1001;
}

.custom-button {
  color: inherit;
}

</style>
