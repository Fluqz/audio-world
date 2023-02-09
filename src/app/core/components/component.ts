

export abstract class Component {

    abstract construct?() : void
    abstract update?(delta?: number) : void
    abstract destruct?() : void
}