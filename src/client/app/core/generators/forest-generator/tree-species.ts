

export class TreeSpecies {

    /** Strain name */
    name: string
    /** Number of seeds per flowering */
    seedRate: number
    /** Range of seeds falling down */
    seedSpreadDistance: number
    /** Maximum age of the strain */
    protected _maxAge: number
    /** Maximum size of the strain */
    protected _maxHeight: number
    /** Maximum diameter */
    protected _maxDiameter: number
    /** Tolerance of an abnormal tree */
    abnormTolerance: number
    /** Survivability of each seed */
    seedSurvivability: number
    /** Amount of grow per iteration */
    growRate: number
    /** Min age of reproduction. Year after reproduction works. */
    protected _minAgeOfReproduction: number


    constructor(name: string, seedRate: number, seedSpreadDistance: number, maxAge: number, maxHeight: number, maxDiameter: number, abnormTolerance: number, seedSurvivability: number, growRate: number, minAgeOfReproduction: number) {

        this.name = name
        this.seedRate = seedRate
        this.seedSpreadDistance = seedSpreadDistance
        this.abnormTolerance = abnormTolerance
        this.seedSurvivability = seedSurvivability
        this.growRate = growRate
        
        this.maxAge = maxAge
        this.maxHeight = maxHeight
        this.maxDiameter = maxDiameter
        this.minAgeOfReproduction = minAgeOfReproduction
    }

    get maxAge() { return this._maxAge }
    set maxAge(a: number) { this._maxAge = a * this.abnormTolerance }

    get maxDiameter() { return this._maxDiameter }
    set maxDiameter(d: number) { this._maxDiameter = d * this.abnormTolerance }

    get maxHeight() { return this._maxHeight }
    set maxHeight(h: number) { this._maxHeight = h * this.abnormTolerance }

    get minAgeOfReproduction() { return this._minAgeOfReproduction }
    set minAgeOfReproduction(a: number) { this._minAgeOfReproduction = a * this.abnormTolerance }
}