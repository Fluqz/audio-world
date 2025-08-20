import { Vector3 } from 'three';
import { Component } from './component';

export class InputComponent implements Component {
    __componentBrand: true; // Marker field - Typescritp structural overlap compromise

  velocity = new Vector3()


  serialize() {
    return {
      velocityX: this.velocity.x,
      velocityY: this.velocity.y,
      velocityZ: this.velocity.z,
    };
  }

  static deserialize(data: any) {

    const comp = new InputComponent()

    comp.velocity.x = data.velocityX
    comp.velocity.y = data.velocityZ
    comp.velocity.z = data.velocityZ
    
    return comp
  }
}
