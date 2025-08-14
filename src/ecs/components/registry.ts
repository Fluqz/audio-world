import { TransformationComponent } from "./transformation-component";
import { ScriptComponent } from "./script-component";
import { TagComponent } from "./tag-component";
import { AudioComponent } from "./audio-component";
import { GraphicsComponent } from "./graphics-component";
import { VelocityComponent } from "./velocity-component";
import { ThirdPersonControllerComponent } from "./third-person-controller-component";
import { BoundingboxComponent } from "./boundingbox-component";
import { AudioSourceComponent } from "./audio-source-component";
import { AudioListenerComponent } from "./audio-listener-component";
import { AudioEffectComponent } from "./audio-effect-component";
import { AnimationComponent } from "./animation-component";
import { NameComponent } from "./name-component";

export const componentRegistry: Record<string, new (...args: any) => any> = {
    AnimationComponent,
    AudioComponent,
    AudioSourceComponent,
    AudioListenerComponent,
    AudioEffectComponent,
    BoundingboxComponent,
    GraphicsComponent,
    NameComponent,
    ScriptComponent,
    TagComponent,
    ThirdPersonControllerComponent,
    TransformationComponent,
    VelocityComponent,
};
