import { Component } from "./component"

export class MovementComponent implements Component {
    __componentBrand: true; // Marker field - Typescritp structural overlap compromise

  speed: number = 10
  runSpeed: number = 20
  jumpForce: number = 10
}
