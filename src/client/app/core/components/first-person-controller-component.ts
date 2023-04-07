import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { Game } from "../../game";
import { Globals } from "../../globals";
import { ThirdPersonControl } from "../third-person-controls";
import { Component, EComponents } from "./component";



export class FirstPersonControllerComponent implements Component {

    name: EComponents

    /** vector 3 storing the force */
    force = new Vector3()
    /** Normalized facing direction of object */
    normal = new Vector3()
    /** Offset angle Y used for walking directions */
    directionOffset: number = 0
    /** Velocity of walking speed */
    velocity = 10
    /** Velocity of running speed */
    runVeclocity = 20

    control: ThirdPersonControl
    camera: PerspectiveCamera
    object: Object3D

    state: string

    constructor(camera: THREE.PerspectiveCamera, object: Object3D) {

        this.name = EComponents.FIRST_PERSON_CONTROLLER

        this.camera = camera
        this.object = object

        this.state = 'IDLE'

        this.control = new ThirdPersonControl(this.object, this.camera, Game.renderer.domElement)
        this.control.updateTarget(new Vector3())
    }
}
