"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestGenerator = void 0;
const three_1 = require("three");
const tree_1 = require("./tree");
const tree_species_1 = require("./tree-species");
class ForestGenerator {
    constructor(width, height, cellSize) {
        this.cells = [];
        this.trees = [];
        this.generateCells(width, height, cellSize);
    }
    getTrees() {
        return this.trees.filter((t) => t != undefined);
    }
    generateCells(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        for (let x = 0; x < this.width; x += 1) {
            for (let y = 0; y < this.height; y += 1) {
                const i = this.getIndex(x, y);
                this.cells[i] = false;
                this.trees[i] = undefined;
            }
        }
        console.log('Cells', this.cells, this.trees);
    }
    /** NOOOOOOOOOOOISE!!!! USE NOISE FOR BASIC TREE POSITIONS */
    generateBaseForest() {
        const v = new three_1.Vector2();
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (Math.random() > .8) {
                    this.cells[this.getIndex(x, y)] = true;
                    v.set(x * this.cellSize, y * this.cellSize);
                    this.addTree(this.getTreeBySpeciesName(Math.random() > .5 ? 'Beech' : 'Oak', v.clone(), 0));
                }
            }
        }
    }
    getCellCoordinatesByTree(tree) {
        const x = tree.position.x / this.cellSize;
        const y = tree.position.y / this.cellSize;
        return new three_1.Vector2(x, y);
    }
    getTreeByCell(cellIndex) {
        return this.trees[cellIndex];
    }
    getIndex(x, y) {
        return (y * this.height) + x;
    }
    getCoordinates(i) {
        if (i <= this.width)
            return this.width;
        return new three_1.Vector2(i % this.width, i / this.width);
    }
    getNeighbouringTrees(cell) {
        const arr = [];
        if (this.cells[this.getIndex(cell.x - 1, cell.y - 1)])
            arr.push(this.trees[this.getIndex(cell.x - 1, cell.y - 1)]);
        if (this.cells[this.getIndex(cell.x, cell.y - 1)])
            arr.push(this.trees[this.getIndex(cell.x, cell.y - 1)]);
        if (this.cells[this.getIndex(cell.x + 1, cell.y - 1)])
            arr.push(this.trees[this.getIndex(cell.x + 1, cell.y - 1)]);
        if (this.cells[this.getIndex(cell.x - 1, cell.y)])
            arr.push(this.trees[this.getIndex(cell.x - 1, cell.y)]);
        if (this.cells[this.getIndex(cell.x + 1, cell.y)])
            arr.push(this.trees[this.getIndex(cell.x + 1, cell.y)]);
        if (this.cells[this.getIndex(cell.x - 1, cell.y + 1)])
            arr.push(this.trees[this.getIndex(cell.x - 1, cell.y + 1)]);
        if (this.cells[this.getIndex(cell.x, cell.y + 1)])
            arr.push(this.trees[this.getIndex(cell.x, cell.y + 1)]);
        if (this.cells[this.getIndex(cell.x + 1, cell.y + 1)])
            arr.push(this.trees[this.getIndex(cell.x + 1, cell.y + 1)]);
        return arr;
    }
    addTree(tree) {
        if (this.trees.indexOf(tree) != -1)
            return;
        const c = this.getCellCoordinatesByTree(tree);
        const i = this.getIndex(c.x, c.y);
        this.cells[i] = true;
        this.trees[i] = tree;
        this.trees.push(tree);
    }
    removeTree(tree) {
        let i = this.trees.indexOf(tree);
        if (i == -1)
            return;
        const c = this.getCellCoordinatesByTree(tree);
        i = this.getIndex(c.x, c.y);
        this.cells[i] = false;
        this.trees[i] = undefined;
    }
    iterate() {
        console.log('ITERATE');
        const treesToRemove = [];
        for (let tree of this.trees) {
            if (!tree)
                continue;
            if (tree.isDead) {
                // Gonna fall already -> remove and continue
                if (tree.afterLifeState == tree_1.TreeAfterLifeState.GONNAFALL) {
                    treesToRemove.push(tree);
                    continue;
                }
                // Decompose tree
                tree.decompose();
            }
            else { // Alive
                tree.grow();
            }
            // Check if any tree grown too big and kills surrounding trees
            for (let t of this.getNeighbouringTrees(this.getCellCoordinatesByTree(tree))) {
                if (t)
                    tree.takeOver(t);
            }
            // Flower
            if (tree.species.minAgeOfReproduction < tree.age) {
                for (let seed = 0; seed < tree.species.seedRate; seed++) {
                    if (tree.species.seedSurvivability >= Math.random() * 100) {
                        const x = (Math.random() * 2) - 1;
                        const y = (Math.random() * 2) - 1;
                        const n = new three_1.Vector2(x, y);
                        n.normalize().multiplyScalar(tree.species.seedSpreadDistance);
                        n.add(tree.position);
                        n.round();
                        if (this.getIndex(n.x, n.y))
                            this.addTree(this.getTreeBySpeciesName(tree.species.name, n, 0));
                    }
                }
            }
            // Remove trees
            for (let r of treesToRemove) {
                this.removeTree(r);
            }
        }
    }
    getOak(position, age) {
        return new tree_1.Tree(new tree_species_1.TreeSpecies('Oak', 200, 10, 100, 50, 2, 1.05, 4, .2, 10), position, age);
    }
    getBeech(position, age) {
        return new tree_1.Tree(new tree_species_1.TreeSpecies('Beech', 100, 5, 80, 40, 1.5, 1.03, 5, .15, 8), position, age);
    }
    getTreeBySpeciesName(name, position, age) {
        switch (name) {
            case 'Beech':
                return this.getBeech(position, age);
            case 'Oak':
                return this.getOak(position, age);
        }
        return null;
    }
}
exports.ForestGenerator = ForestGenerator;
//# sourceMappingURL=forest-generator.js.map