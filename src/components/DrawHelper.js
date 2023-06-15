import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { drawSceneList, camera, plane } from "../App.vue";
import { grid } from "./GridBackground.vue";
import { index } from './DrawingInput.vue';

let draw = {
    l: undefined,
    draw: class {
        constructor(stroke) {
            this.stroke = stroke;
            this.line = new MeshLine();
            this.geometry = new THREE.BufferGeometry();
            this.vertices = [];
            this.lineWidths = [];
            this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
            //this.geometry.setAttribute("widthCallback", new THREE.BufferAttribute(new Float32Array(this.lineWidths), 1));
            
            this.material = new MeshLineMaterial({
                lineWidth: this.stroke.show_stroke ? this.stroke.lineWidth : .01,
                sizeAttenuation: 1,
                color: this.stroke.show_stroke ? this.stroke.color : 0xFFFFFF,
                side: THREE.DoubleSide,
                fog: true,
                wireframe: false,
                alphaTest: 0.9,
                blending: THREE.NormalBlending,
                transparent: false,
                resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
                repeat: new THREE.Vector2(.1, .1),
                opacity: 1,
            });
            this.mesh = new THREE.Mesh(this.line.geometry, this.material);
            this.mesh.raycast = MeshLineRaycast;
        }


        translate(x, y) {
          
            var vec = new THREE.Vector3();
    
            // from stackoverflow
            vec.set(
                ( x / window.innerWidth ) * 2 - 1,
                - ( y / window.innerHeight ) * 2 + 1,
                .5 );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( vec, camera );
            var intersects = raycaster.intersectObject( plane );
            
            const intersectPoints = intersects.map((intersection) => intersection.point);
            return intersectPoints;
                    
        }

        start() {
            drawSceneList[index].add(this.mesh);
        }

        move(x, y, z, stroke) {
            //var v3 = this.translate(x, y, z);
            this.vertices = [...this.vertices, x, y, z];
            this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
            //console.log(this.vertices);
              // This updates the MeshLine's geometry
            var width = stroke.lineWidth;
            
            this.lineWidths = [...this.lineWidths, width];
            
            var widthCallback = (p) => {
                return this.lineWidths[Math.floor(p * this.lineWidths.length)];
            };

            this.line.setGeometry(this.geometry, widthCallback);
        }

        erase(x, y) {
            var vec = new THREE.Vector3();
    
            // from stackoverflow
            vec.set(
                ( x / window.innerWidth ) * 2 - 1,
                - ( y / window.innerHeight ) * 2 + 1,
                .5 );

            const raycaster = new THREE.Raycaster();
            raycaster.params.Line.threshold = .1;

            //raycaster.near = 0; // Set the minimum distance for intersection (default is 0)
            //raycaster.far = 5; // Set the maximum distance for intersection (increase/decrease as needed)


            raycaster.setFromCamera( vec, camera );
            var intersects = raycaster.intersectObjects(drawSceneList[index].children, false);
            
            //const intersectPoints = intersects.map((intersection) => intersection.point);
            for (var i = 0; i < intersects.length; i++) {
                var intersectedObject = intersects[i].object;
                if (intersectedObject !== plane && intersectedObject !== grid) {
                    drawSceneList[index].remove(intersectedObject);
                    console.log("removed");
                }
                
            }


        }

        end() {
            if (this.vertices.length >= 3) {
                this.geometry.computeBoundingBox();
              }
        }


    },
    onStart: function (x, y, stroke) {
        //console.log(index);
        
        if (stroke.eraser){
            this.l.erase(x, y);
        } else {
            this.l = new this.draw(stroke);

        var coor = this.l.translate(x, y);

        if (coor.length > 0)
        {
            this.l.move(coor[0].x, coor[0].y, coor[0].z, stroke);
            this.l.start();
        }
    }
        
    },
    onMove: function (x, y, stroke) {

        
        if(this.l !== undefined) {
            if (stroke.eraser){
                this.l.erase(x, y);
            } else {

                var coor = this.l.translate(x, y);
                if (coor.length > 0)
                {
                    this.l.move(coor[0].x, coor[0].y, coor[0].z, stroke);
                }
            }
        }
        
    },
    onEnd: function () {
        this.l.end();
    },
}

export { draw }
