<template>
    <div class="drawing-input" ></div>
</template>
  
<script>
import { draw } from "./DrawHelper.js";
//import * as THREE from "three";
//import { renderer, scene, camera } from "../App.vue";

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


        document.body.addEventListener('mouseup', () => {
        this.handleMouseUp();
        });

        document.body.addEventListener('mousedown', (event) => {
            console.log(this.valid(event));
            this.handleMouseDown(event);
        });

        document.body.addEventListener('mousemove', (event) => {
        this.handleMouseMove(event);
        });

    },
    methods: {
        valid( event ) {
            var rect = document.body.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;

            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            console.log("hi", centerX, centerY);

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
            console.log("mouse down");
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
