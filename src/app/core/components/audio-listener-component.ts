import { GameObject } from "../object";
import { Component } from "./component";

export class AudioListenerComponent implements Component {

    object: GameObject

    constructor(object: GameObject) {

    }

    construct() {}
    update(delta: number) {}
    destruct() {}
}