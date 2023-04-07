import { AnimationClip, Object3D } from "three";
import { Game } from "../../game";
import { Component, EComponents } from "./component";

export class AnimationComponent implements Component {
    
        name: EComponents
    
        constructor(object: Object3D, animation: Function | AnimationClip[]) {
    
            this.name = EComponents.ANIMATION
    
        }
    }