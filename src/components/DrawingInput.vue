<template>
    <div class="drawing-input">
        <v-btn class="fixed-button" ref="eraserButton" @click="toggleEraserMode" large>
            <v-icon>
                {{ stroke.eraser ? 'mdi-eraser' : 'mdi-brush-outline' }}
            </v-icon>
        </v-btn>
    </div>
    
</template>
  
<script>
import { draw } from "./DrawHelper.js";
import { arcRenderer } from '../App.vue';
//import * as THREE from "three";
//import { renderer, scene, camera } from "../App.vue";

let drawing = false;


export default {
    name: 'DrawingInput',

    data(){
        return {
            isDrawing: false,
            stroke: {
                show_stroke: true,
                lineWidth: .25,
                color: 0x000000,
                eraser: false,
                
            }
        };
    },
    mounted (){
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
        handleClick() {
            
        // Your function logic here
        console.log('Button clicked!');
        console.log("hiiiii");
        },
        toggleEraserMode() {
            this.stroke.eraser = !this.stroke.eraser;
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

</style>
