import { camera } from './Camera.js';
import { HistoryController } from "./HistoryController.js";
import * as THREE from 'three';
import { MeshLineMaterial } from "three.meshline";

class Frame {
    constructor() {
        this.history = new HistoryController();
        this.scene = new THREE.Scene();
        this.ghostGroup = new THREE.Group();

        this.pos = camera.position.clone();
        this.angle = camera.rotation.clone();
        this.guidePoint = new THREE.Group();
        this.guidePointPosition = new THREE.Vector3();
        this.guidePointGhost = new THREE.Group();
    }

    setGuidePoint(pos) {
        this.guidePointPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
    
        let geometry = new THREE.BufferGeometry();
    
        // Add a vertex (point) to the geometry using a Float32Array
        const verticesArray = new Float32Array([pos.x, pos.y, pos.z]);
        geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
    
        // Create a material for the points
        let material = new THREE.PointsMaterial({ color: 0xffffff, size: .05 });
    
        // Create a points object and add it to the scene
        this.guidePoint = new THREE.Points(geometry, material);
    }

    getGuidePointGhost(opacity) {
    
        let geometry = new THREE.BufferGeometry();
    
        const verticesArray = new Float32Array([this.guidePointPosition.x, this.guidePointPosition.y, this.guidePointPosition.z]);
        geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
    
        // Create a material for the points
        let material = new THREE.PointsMaterial
        ({ 
            color: 0xffffff, 
            size: .05,
            transparent: true,
            opacity: opacity,
        });
    
        // Create a points object and add it to the scene
        return new THREE.Points(geometry, material);

    }

    getGhostGroup(opacity) {
        this.ghostGroup = new THREE.Group();

        this.scene.traverse(child => {
            if (child.isMesh) {
                let childClone = child.clone();

                let material = new MeshLineMaterial({
                    lineWidth: childClone.material.lineWidth,
                    sizeAttenuation: 1,
                    color: new THREE.Vector4(1, 0, 0, 1),
                    side: THREE.DoubleSide,
                    fog: true,
                    wireframe: false,
                    alphaTest: 0,
                    blending: THREE.NormalBlending,
                    transparent: true,
                    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
                    repeat: new THREE.Vector2(.1, .1),
                    opacity: opacity,
                });

                
                childClone.material = material;
                childClone.material.color = new THREE.Vector3(1, 0, 0);
                this.ghostGroup.add(childClone)
            }
        });
        console.log(this.ghostGroup, opacity);

        return this.ghostGroup;
        
    }

}

class FrameController {
    constructor() {
        this.frameList = [new Frame()];
        this.index = 0;

        this.allGhostGroups = new THREE.Group();
        this.allGhostGuides = new THREE.Group();
        this.onionSkinDepth = 3;
        this.onion = true;

        this.play = false;
        this.animationPos = [];
        this.animationAngle = [];
        this.animationDetail = 0;
        this.animationFPS = 10;
        this.drawingFPS = 5;

        this.currentPos = new THREE.Vector3();
        this.currentAngle = new THREE.Euler();
        this.animationIndex = 0;

        this.needsUpdate = false;
        this.guideNeedsUpdate = false;

        this.animationMoments = 0;

    }

    updateAllGhostGuides(){
        const startIndex = Math.max(0, this.index - this.onionSkinDepth);
        const endIndex = Math.min(this.frameList.length, this.index + this.onionSkinDepth);

        this.allGhostGuides = new THREE.Group();

        for (let i = startIndex; i < endIndex; i++) {
            if (i != this.index){
                let opacity = .3 / (Math.abs(this.index - i))
                this.allGhostGuides.add(this.getFrameAtIndex(i).getGuidePointGhost(opacity));
            }
        }
    }

    updateAllGhostGroups(){
        this.updateAllGhostGuides();
        const startIndex = Math.max(0, this.index - this.onionSkinDepth);
        const endIndex = Math.min(this.frameList.length, this.index + this.onionSkinDepth);

        this.allGhostGroups = new THREE.Group();

        for (let i = startIndex; i < endIndex; i++) {
            if (i != this.index){
                let opacity = .3 / (Math.abs(this.index - i))
            this.allGhostGroups.add(this.getFrameAtIndex(i).getGhostGroup(opacity));
            }
        }
    }

    updateGuide(){
        this.guideNeedsUpdate = true;
    }

    updateCamera(){
        this.needsUpdate = true;
    }

    calculateAnimation(){
        this.animationIndex = 0;
        const positions = [];
        const rotations = [];
        for (let i = 0; i < this.frameList.length; i++){
            const frame = this.getFrameAtIndex(i);
            positions.push(frame.pos);
            const v = new THREE.Vector3();
            v.setFromEuler(frame.angle);
            rotations.push(v);
        }
        console.log(positions, rotations);

        this.animationDetail = this.animationFPS * this.drawingFPS;
        this.animationMoments = this.animationDetail * this.frameList.length;

        const posCurve = new THREE.CatmullRomCurve3(positions);
        const angleCurve = new THREE.CatmullRomCurve3(rotations);
        this.animationPos = posCurve.getPoints(this.animationMoments);
        this.animationAngle = angleCurve.getPoints(this.animationMoments);
    }

    updateAnimationFrame(){
        this.currentPos = this.animationPos[this.animationIndex];
        this.currentAngle = this.animationAngle[this.animationIndex];
        
        if (this.animationIndex % (this.animationDetail) == 0){
            this.setIndex((this.index + 1) % this.frameList.length);
        }

        this.animationIndex = (this.animationIndex + 1) % this.animationMoments;
    }

    setPos(pos){
        this.setPosAtFrame(pos, this.index);
    }

    setPosAtFrame(p, i){
        this.getFrameAtIndex(i).pos = p;
    }

    setAngle(angle){
        this.setAngleAtFrame(angle, this.index);
    }

    setAngleAtFrame(a, i){
        this.getFrameAtIndex(i).angle = a;
    }

    addIndex(){
        this.setIndex(1 + this.index);
    }

    subIndex(){
        this.setIndex(-1 + this.index);
    }

    setIndex(v){
        this.check(v);
        this.index = v;
        this.updateAllGhostGroups();
    }

    getFrameScene(){
        return this.getFrame().scene;
    }

    getFrame(){
        return this.getFrameAtIndex(this.index);
    }

    getFrameAtIndex(i){
        this.check(i);
        return this.frameList[i];
    }

    addFrame(){
        this.addFrameAtIndex(this.index);
    }

    addFrameAtIndex(i){
        console.log(i);
        this.check(i);
        this.frameList.splice(i+1, 0, new Frame());
        this.addIndex()

    }

    delFrame(){
        this.delFrameAtIndex(this.index);
    }

    delFrameAtIndex(i){
        this.check(i);
        if (this.index > 0 && i > 0){
            this.frameList.splice(i, 1);
            this.subIndex;
        }
    }

    check(i){
        if (i < 0 || i >= this.frameList.length){
            console.log("frame accessed out of bounds", i);
        }
    }

}

export { FrameController }