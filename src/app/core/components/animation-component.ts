import { Object3D } from "three";
import { Game } from "../../game";
import { Component, EComponents } from "./component";

export class AnimationComponent implements Component {
    
        name: string
    
        constructor(object: Object3D) {
    
            this.name = EComponents.ANIMATION
    
        }
    }