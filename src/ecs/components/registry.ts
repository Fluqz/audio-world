import { TransformationComponent } from "./transformation-component";
import { ScriptComponent } from "./script-component";
import { TagComponent } from "./tag-component";
import { VelocityComponent } from "./velocity-component";
import { BoundingboxComponent } from "./boundingbox-component";
import { AnimationComponent } from "./animation-component";
import { NameComponent } from "./name-component";
import { AudioListenerComponent } from "./audio/audio-listener-component";
import { OscillatorComponent } from "./audio/oscillator-component";
import { PlayerComponent } from "./audio/player-component";
import { AudibleRadiusComponent } from "./audio/audible-radius-component";
import { MeshComponent } from "./mesh-component";
import { MovementComponent } from "./movement-component";
import { InputComponent } from "./input-component";
import { AssetMeshComponent } from "./asset-mesh-component";
import { PrimitiveMeshComponent } from "./primitive-mesh-component";

export const componentRegistry: Record<string, new (...args: any) => any> = {
    
    AnimationComponent,
    AssetMeshComponent,
    AudibleRadiusComponent,
    AudioListenerComponent,
    BoundingboxComponent,
    InputComponent,
    MeshComponent,
    MovementComponent,
    NameComponent,
    OscillatorComponent,
    PrimitiveMeshComponent,
    PlayerComponent,
    ScriptComponent,
    TagComponent,
    TransformationComponent,
    VelocityComponent,
};
