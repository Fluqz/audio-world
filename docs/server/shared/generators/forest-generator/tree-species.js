"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSpecies = void 0;
class TreeSpecies {
    constructor(name, seedRate, seedSpreadDistance, maxAge, maxHeight, maxDiameter, abnormTolerance, seedSurvivability, growRate, minAgeOfReproduction) {
        this.name = name;
        this.seedRate = seedRate;
        this.seedSpreadDistance = seedSpreadDistance;
        this.abnormTolerance = abnormTolerance;
        this.seedSurvivability = seedSurvivability;
        this.growRate = growRate;
        this.maxAge = maxAge;
        this.maxHeight = maxHeight;
        this.maxDiameter = maxDiameter;
        this.minAgeOfReproduction = minAgeOfReproduction;
    }
    get maxAge() { return this._maxAge; }
    set maxAge(a) { this._maxAge = a * this.abnormTolerance; }
    get maxDiameter() { return this._maxDiameter; }
    set maxDiameter(d) { this._maxDiameter = d * this.abnormTolerance; }
    get maxHeight() { return this._maxHeight; }
    set maxHeight(h) { this._maxHeight = h * this.abnormTolerance; }
    get minAgeOfReproduction() { return this._minAgeOfReproduction; }
    set minAgeOfReproduction(a) { this._minAgeOfReproduction = a * this.abnormTolerance; }
}
exports.TreeSpecies = TreeSpecies;
//# sourceMappingURL=tree-species.js.map