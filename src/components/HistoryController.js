//import * as THREE from "three";
import { drawSceneList } from "../App.vue";
import { index } from './DrawingInput.vue';

class HistoryController {
    constructor() {
        this.undoHistory = [];
        this.redoHistory = [];
    }

    canUndo() {
        return this.undoHistory.length > 0;
    }

    canRedo() {
        return this.redoHistory.length > 0;
    }

    undo() {
        if (!this.canUndo()) {
            return;
        }

        let item = this.undoHistory.pop();
        let action = item[0];
        let objectID = item[1];

        if (action === 'add') {

            let object = drawSceneList[index].getObjectById(objectID);
            drawSceneList[index].remove(object);
            this.redoHistory.push(['remove', object]);

        } else if (action === 'remove') {
            drawSceneList[index].add(objectID);
            this.redoHistory.push(['add', objectID]);
        }
    }

    redo() {
        if (!this.canRedo()) {
            return;
        }
        let item = this.redoHistory.pop();
        let action = item[0];
        let objectID = item[1];

        // Reverse the action
        if (action === 'add') {

            let object = drawSceneList[index].getObjectById(objectID);
            this.undoHistory.push(['remove', objectID]);
            drawSceneList[index].remove(object);

        } else if (action === 'remove') {
            drawSceneList[index].add(objectID);
            this.undoHistory.push(['add', objectID]);
        }
    }

    action(item){
        this.undoHistory.push(item);
    }
}

export { HistoryController }