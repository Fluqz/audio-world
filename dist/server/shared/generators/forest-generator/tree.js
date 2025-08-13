"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.TreeAfterLifeState = void 0;
var TreeAfterLifeState;
(function (TreeAfterLifeState) {
    TreeAfterLifeState[TreeAfterLifeState["FRESH"] = 0] = "FRESH";
    TreeAfterLifeState[TreeAfterLifeState["ROTTEN"] = 1] = "ROTTEN";
    TreeAfterLifeState[TreeAfterLifeState["GONNAFALL"] = 2] = "GONNAFALL";
})(TreeAfterLifeState = exports.TreeAfterLifeState || (exports.TreeAfterLifeState = {}));
class Tree {
    constructor(species, position, age) {
        this.isDead = false;
        this.id = Tree.idCount++;
        this.species = species;
        this.position = position;
        age = age <= 0 ? 0.1 : age;
        this.setAge(age);
        this.setHeight((age / species.maxAge) * species.maxHeight);
        this.setDiameter((age / species.maxAge) * species.maxHeight);
    }
    setHeight(h) {
        this.height = Math.min(h, this.species.maxHeight);
        // console.log('set height', h, this.height)
    }
    setDiameter(d) {
        this.diameter = Math.min(d, this.species.maxDiameter);
        // console.log('set diameter', d, this.diameter)
    }
    setAge(a) {
        this.age = Math.min(a, this.species.maxAge);
        // console.log('set age', a, this.age)
    }
    /** Kills this tree */
    die() {
        this.isDead = true;
    }
    /** Lets time pass and decompose to the next state */
    decompose() {
        if (!this.isDead)
            return;
        if (this.afterLifeState == TreeAfterLifeState.FRESH)
            this.afterLifeState = TreeAfterLifeState.ROTTEN;
        if (this.afterLifeState == TreeAfterLifeState.ROTTEN)
            this.afterLifeState = TreeAfterLifeState.GONNAFALL;
    }
    /** Lets time pass and grow the tree */
    grow() {
        if (this.isDead)
            return;
        // console.log('grow', )
        this.setAge(this.age += 1);
        this.setHeight(this.height + (this.height * this.species.growRate));
        this.setDiameter(this.diameter + (this.diameter / this.species.maxDiameter * this.species.growRate));
        console.log('grow', this.height, this.diameter, this.age);
        if (this.species.maxAge <= this.age) {
            this.die();
        }
    }
    touch(tree, minRange = 2) {
        const d = Math.sqrt(Math.pow(tree.position.x - this.position.x, 2) + Math.pow(tree.position.y - this.position.y, 2));
        return d < (tree.diameter / 2) + (this.diameter / 2) + minRange;
    }
    takeOver(tree) {
        // console.log('takeover')
        if (!this.touch(tree, 4))
            return;
        // console.log('DIIIIIIIIIE')
        let dyingTree;
        let p1 = 0;
        let p2 = 0;
        if (this.height > tree.height)
            p1++;
        else if (this.height < tree.height)
            p2++;
        if (this.diameter > tree.diameter)
            p1++;
        else if (this.diameter < tree.diameter)
            p2++;
        if (this.age > tree.age)
            p1++;
        else if (this.age < tree.age)
            p2++;
        if (p1 == p2)
            p1 += (Math.random() * 2) - 1;
        if (p1 > p2)
            dyingTree = tree;
        else
            dyingTree = this;
        dyingTree.die();
    }
}
exports.Tree = Tree;
Tree.idCount = 0;
//# sourceMappingURL=tree.js.map