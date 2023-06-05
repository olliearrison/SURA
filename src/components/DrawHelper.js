import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { scene, camera, plane } from "../App.vue";

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

        translate(x, y, z) {
            if (z < 0) {
                console.log("z < 0");
            }
            // Translation from stackoverflow
            //console.log(x, y, z);
            var vec = new THREE.Vector3();
            var pos = new THREE.Vector3();

            vec.set(
                ( x / window.innerWidth ) * 2 - 1,
                - ( y / window.innerHeight ) * 2 + 1,
                .5 );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( vec, camera );
            var intersects = raycaster.intersectObject( plane );
            if (intersects.length > 0) {
                //console.log("intersects");
                //console.log(intersects[0].point);
                return intersects[0].point;
            }

            vec.unproject( camera );

            vec.sub( camera.position ).normalize();

            var distance = - camera.position.z / vec.z;

            pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

            return pos;
            
                    
        }

        start() {
            scene.add(this.mesh);
        }

        move(x, y, z, stroke) {
            var v3 = this.translate(x, y, z);
            this.vertices = [...this.vertices, v3.x, v3.y, v3.z];
            this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
              // This updates the MeshLine's geometry
            var width = stroke.lineWidth;
            
            this.lineWidths = [...this.lineWidths, width];
            
            var widthCallback = (p) => {
                return this.lineWidths[Math.floor(p * this.lineWidths.length)];
            };

            this.line.setGeometry(this.geometry, widthCallback);

        }

        end() {
            this.geometry.computeBoundingBox();
        }


    },
    onStart: function (x, y, z, stroke) {
        this.l = new this.draw(stroke);
        this.l.move(x, y, z, stroke);
        this.l.start();
    },
    onMove: function (x, y, z, stroke) {
        this.l.move(x, y, z, stroke);
    },
    onEnd: function () {
        this.l.end();
    },
}

export { draw }
