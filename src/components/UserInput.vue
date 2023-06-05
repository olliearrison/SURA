<template>
    <div class="drawing-input" ></div>
</template>

<script>
import { arcRenderer } from '../App.vue';

export default {
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
        }

    }
}
</script>