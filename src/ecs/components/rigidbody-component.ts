import { Component, ComponentData } from "./component";


export class RigidbodyComponent implements Component {
    __componentBrand: true

    isKinematic: boolean = false

    constructor(data?: { isKinematic: boolean }) {

        if(data) this.isKinematic = data.isKinematic
    }

    serialize(): ComponentData {
        return {

            isKinematic: this.isKinematic
        }
    }
}