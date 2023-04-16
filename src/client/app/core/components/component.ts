

export interface Component {

    name: EComponent
}

export enum EComponent {

    BOUNDINGBOX = 'boundingbox-component',
    SCRIPT = 'script-component',
    TRANSFORMATION = 'transformation-component',
    ANIMATION = 'animation-component',
    GRAPHICS = 'graphics-component',
    AUDIO = 'audio-component',
    AUDIO_SOURCE = 'audio-source-component',
    AUDIO_EFFECT = 'audio-effect-component',
    AUDIO_LISTENER = 'audio-listener-component',
    FIRST_PERSON_CONTROLLER = 'first-person-controller-component'
}