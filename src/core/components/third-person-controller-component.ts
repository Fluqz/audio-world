import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { Component } from "./component";
import { ThirdPersonControl } from "../third-person-controls";


export class ThirdPersonControllerComponent implements Component {

    /** vector 3 storing the force */
    force = new Vector3()
    /** Normalized facing direction of object */
    normal = new Vector3()
    /** Offset angle Y used for walking directions */
    directionOffset: number = 0
    /** Velocity of walking speed */
    velocity = 15
    /** Velocity of running speed */
    runVeclocity = 30

    control: ThirdPersonControl
    camera: PerspectiveCamera
    dom: HTMLElement
    object: Object3D

    state: string

    constructor(camera: THREE.PerspectiveCamera, dom: HTMLElement) {

        this.camera = camera
        this.dom = dom 

        this.state = 'IDLE'

        this.control = new ThirdPersonControl(this.camera, this.dom)
        this.control.updateTarget(new Vector3())
    }
}
