import { TransformationComponent } from "./transformation-component";
import { ScriptComponent } from "./script-component";
import { TagComponent } from "./tag-component";
import { GraphicsComponent } from "./graphics-component";
import { VelocityComponent } from "./velocity-component";
import { ThirdPersonControllerComponent } from "./third-person-controller-component";
import { BoundingboxComponent } from "./boundingbox-component";
import { AnimationComponent } from "./animation-component";
import { NameComponent } from "./name-component";
import { AudioListenerComponent } from "./audio/audio-listener-component";
import { OscillatorComponent } from "./audio/oscillator-component";
import { PlayerComponent } from "./audio/player-component";
import { AudibleRadiusComponent } from "./audio/audible-radius-component";

export const componentRegistry: Record<string, new (...args: any) => any> = {
    AnimationComponent,
    AudibleRadiusComponent,
    AudioListenerComponent,
    BoundingboxComponent,
    GraphicsComponent,
    NameComponent,
    OscillatorComponent,
    PlayerComponent,
    ScriptComponent,
    TagComponent,
    ThirdPersonControllerComponent,
    TransformationComponent,
    VelocityComponent,
};
