<template>
    <div class="drawing-input">
        <v-btn class="fixed-button" ref="eraserButton" @click="toggleEraserMode" large>
            <v-icon>
                {{ stroke.eraser ? 'mdi-eraser' : 'mdi-brush-outline' }}
            </v-icon>
        </v-btn>
        
        <v-row class="bottom-buttons">
            <v-btn @click="backward" large>
                <v-icon>
                    mdi-arrow-left
                </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="forward" large>
                <v-icon>
                    mdi-arrow-right
                </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="play" large>
                <v-icon>
                    mdi-arrow-right
                </v-icon>
            </v-btn>
        </v-row>
    </div>
    
</template>
  
<script>
import { draw } from "./DrawHelper.js";
import { arcRenderer, drawSceneList } from '../App.vue';
import * as THREE from 'three';
//import * as THREE from "three";
//import { renderer, scene, camera } from "../App.vue";

export let index = 0;
let drawing = false;

let rotatingInterval = null;  // Interval to rotate index
//let rotatingCondition = false;


export default {
    name: 'DrawingInput',

    data(){
        return {
            isDrawing: false,
            rotatingCondition: false,
            stroke: {
                show_stroke: true,
                lineWidth: .25,
                color: 0x000000,
                eraser: false,
                
            }
        };
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
            if (this.inCanvas(event)){
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
            //console.log(event.pressure);
            if (event.pressure > 0){
                this.stroke.lineWidth = event.pressure * .5;
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
        },
        handleMouseUp() {
            this.isDrawing = false;
            draw.onEnd();
        },
        toggleEraserMode() {
            this.stroke.eraser = !this.stroke.eraser;
        },
        backward() {
            if (index > 0){
                index--;
                console.log(drawSceneList[index].children.length);
            }
            
        },
        forward() {
            if (index < drawSceneList.length - 1){
                index++;
                console.log(drawSceneList[index].children.length);
            } else {
                const newScene = new THREE.Scene();
                //newScene.add(plane);
                drawSceneList.push(newScene);
                index++;
                console.log(drawSceneList[index].children.length);
            }
        },
        play() {
            console.log(!this.rotatingCondition);
            this.rotatingCondition = !this.rotatingCondition;
        }
        
    }
}
</script>

<style scoped>
.drawing-input {
    width: 100%;
    height: 100%;
}

.fixed-button {
  position: fixed;
  top: 20px; /* Adjust the bottom value as needed */
  left: 20px; /* Adjust the right value as needed */
  z-index: 999; /* Set an appropriate z-index if necessary */
  /* Add any other desired styles */
}

.bottom-buttons {
  position: fixed;
  width: 15%;
  bottom: 40px; /* Adjust the bottom value as needed */
  left: 40px; /* Adjust the right value as needed */
  z-index: 999; /* Set an appropriate z-index if necessary */
  /* Add any other desired styles */
}

</style>
