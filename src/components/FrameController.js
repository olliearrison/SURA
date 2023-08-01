import { camera } from './Camera.js';
import { HistoryController } from "./HistoryController.js";
import * as THREE from 'three';

class Frame {
    constructor() {
        this.history = new HistoryController();
        this.scene = new THREE.Scene();
        this.pos = camera.position.clone();
        this.angle = camera.rotation.clone();
    }

}

class FrameController {
    constructor() {
        this.frameList = [new Frame()];
        this.index = 0;

        this.play = false;
        this.animationPos = [];
        this.animationAngle = [];
        this.animationDetail = 0;
        this.animationFPS = 100;
        this.drawingFPS = 5;

        this.currentPos = new THREE.Vector3();
        this.currentAngle = new THREE.Euler();
        this.animationIndex = 0;
    }

    calculateAnimation(){
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

        const posCurve = new THREE.CatmullRomCurve3(positions);
        const angleCurve = new THREE.CatmullRomCurve3(rotations);
        this.animationPos = posCurve.getPoints(this.animationDetail);
        this.animationAngle = angleCurve.getPoints(this.animationDetail);
    }

    updateAnimationFrame(){
        this.currentPos = this.animationPos[this.animationIndex];
        this.currentAngle = this.animationAngle[this.animationIndex];
        
        if (this.animationIndex % this.animationFPS){
            this.setIndex((this.index + 1) % this.frameList.length);
        }

        this.animationIndex = (this.animationIndex + 1) % this.animationDetail;
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
        this.index ++;

    }

    delFrame(){
        this.delFrameAtIndex(this.index);
    }

    delFrameAtIndex(i){
        this.check(i);
        if (this.index > 0 && i > 0){
            this.frameList.splice(i, 1);
            this.index --;
        }
    }

    check(i){
        if (i < 0 || i >= this.frameList.length){
            console.log("frame accessed out of bounds", i);
        }
    }

}

export { FrameController }