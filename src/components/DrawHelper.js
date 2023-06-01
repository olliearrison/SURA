import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { scene, camera } from "../App.vue";

let draw = {
    l: undefined,
    draw: class {
        constructor(stroke) {
            this.stroke = stroke;
            this.line = new MeshLine();
            this.geometry = new THREE.BufferGeometry();
            this.vertices = [];
            this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
            this.material = new MeshLineMaterial({
                lineWidth: this.stroke.show_stroke ? this.stroke.lineWidth : 0.01,
                sizeAttenuation: 1,
                color: this.stroke.show_stroke ? this.stroke.color : 0xFFFFFF,
                side: THREE.DoubleSide,
                fog: true,
                wireframe: false,
                alphaTest: 0.9,
                blending: THREE.NormalBlending,
                transparent: false,
                repeat: new THREE.Vector2(1, 1),
                opacity: 1,
            });
            this.mesh = new THREE.Line(this.line.geometry, this.material);
        }

        translate(x, y, z) {
            console.log(x, y, z);
            var vec = new THREE.Vector3(); // create once and reuse
            var pos = new THREE.Vector3(); // create once and reuse

            vec.set(
                ( x / window.innerWidth ) * 2 - 1,
                - ( y / window.innerHeight ) * 2 + 1,
                0.5 );

            vec.unproject( camera );

            vec.sub( camera.position ).normalize();

            var distance = - camera.position.z / vec.z;

            pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

            return pos;
                    
        }

        start() {
            console.log("start");
            scene.add(this.mesh);
        }

        move(x, y, z) {
            var v3 = this.translate(x, y, z);
            //var v3 = new THREE.Vector3(x, y, z);
            //v3.unproject(camera);
            this.vertices = [...this.vertices, v3.x, v3.y, v3.z];
            this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.vertices), 3));
            this.line.setGeometry(this.geometry);  // This updates the MeshLine's geometry
        }

        end() {
            this.geometry.computeBoundingSphere();
            //renderer.render(scene, camera);
        }
    },
    onStart: function (x, y, z, stroke) {
        this.l = new this.draw(stroke);
        this.l.move(x, y, z);
        this.l.start();
    },
    onMove: function (x, y, z) {
        //console.log(x, y, z);
        this.l.move(x, y, z);
    },
    onEnd: function () {
        this.l.end();
    },
}

export { draw }
