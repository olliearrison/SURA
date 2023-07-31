
import { HistoryController } from "./HistoryController.js";
import * as THREE from 'three';

class Frame {
    constructor() {
        this.history = new HistoryController();
        this.scene = new THREE.Scene();
        this.pos = new THREE.Vector3();
        this.angle = new THREE.Vector3();
    }

}

class FrameController {
    constructor() {
        this.frameList = [new Frame()];
        this.index = 0;

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
        this.check(i);
        this.frameList.splice(i, 0, new Frame());
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