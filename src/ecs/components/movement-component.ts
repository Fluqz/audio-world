import { Component } from "./component"

export class MovementComponent implements Component {
    __componentBrand: true; // Marker field - Typescritp structural overlap compromise

  speed: number = 10
  jumpForce: number = 10
}
