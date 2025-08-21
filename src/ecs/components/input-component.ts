import { Vector3 } from 'three';
import { Component } from './component';
import { ECS } from '../ecs';

export class InputComponent implements Component {
    __componentBrand: true; // Marker field - Typescritp structural overlap compromise

  velocity = new Vector3()
}
