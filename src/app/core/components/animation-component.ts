import { GameObject } from "../object";
import { Component } from "./component";



export class AnimationComponent extends Component {

    constructor(object: GameObject) {

        super()
    }

    animation: () => void

    construct() {}
    update(delta: number) {

        if(this.animation) this.animation()
    }
    destruct() {}
}