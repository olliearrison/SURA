<template>
    <div class="drawing-input" ></div>
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
                lineWidth: .01,
                color: 0x000000,
            }
        };
    },
    mounted (){
        // document.body 


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

        document.body.addEventListener('mousemove', (event) => {
            if (this.inCanvas(event)) {
                this.handleMouseMove(event);
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
            let z = 0;
            draw.onMove(x, y, z);
        },
        handleMouseDown(event) {
            //console.log("mouse down");
            this.isDrawing = true;
            let x = event.clientX;
            let y = event.clientY;
            let z = 0;
            draw.onStart(x, y, z, this.stroke);
        },
        handleMouseUp() {
            this.isDrawing = false;
            draw.onEnd();
        }
    }
}
</script>

<style scoped>
.drawing-input {
    width: 100%;
    height: 100%;
}
</style>
