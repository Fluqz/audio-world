import { Vec2, Vector2 } from "three";
import { Tree, TreeAfterLifeState } from "./tree";
import { TreeSpecies } from "./tree-species";


export class ForestGenerator {

    private cells: boolean[]

    private trees: Tree[]

    width: number
    height: number
    cellSize: number

    constructor(width: number, height: number, cellSize: number) {

        this.cells = []
        this.trees = []

        this.generateCells(width, height, cellSize)
    }

    getTrees() {

        return this.trees.filter((t) => t != undefined)
    }

    generateCells(width: number, height: number, cellSize: number) {

        this.width = width
        this.height = height
        this.cellSize = cellSize

        for(let x = 0; x < this.width; x += 1) {

            for(let y = 0; y < this.height; y += 1) {

                const i = this.getIndex(x, y)
                this.cells[i] = false
                this.trees[i] = undefined
            }
        }

        console.log('Cells',this.cells, this.trees)
    }

    /** NOOOOOOOOOOOISE!!!! USE NOISE FOR BASIC TREE POSITIONS */
    generateBaseForest() {

        const v = new Vector2()

        for(let x = 0; x < this.width; x++) {

            for(let y = 0; y < this.height; y++) {

                if(Math.random() > .8) {

                    this.cells[this.getIndex(x, y)] = true

                    v.set(x * this.cellSize, y * this.cellSize)

                    this.addTree(this.getTreeBySpeciesName(Math.random() > .5 ? 'Beech' : 'Oak', v.clone(), 0))
                }
            }
        }
    }

    getCellCoordinatesByTree(tree: Tree) {

        const x = tree.position.x / this.cellSize
        const y = tree.position.y / this.cellSize

        return new Vector2(x, y)
    }

    getTreeByCell(cellIndex: number) {

        return this.trees[cellIndex]
    }

    getIndex(x: number, y: number) {

        return (y * this.height) + x
    }

    getCoordinates(i: number) {

        if(i <= this.width) return this.width

        return new Vector2(i % this.width, i / this.width)
    }

    getNeighbouringTrees(cell: Vector2) {

        const arr: Tree[] = []

        if(this.cells[this.getIndex(cell.x - 1, cell.y - 1)]) arr.push(this.trees[this.getIndex(cell.x - 1, cell.y - 1)])
        if(this.cells[this.getIndex(cell.x    , cell.y - 1)]) arr.push(this.trees[this.getIndex(cell.x    , cell.y - 1)])
        if(this.cells[this.getIndex(cell.x + 1, cell.y - 1)]) arr.push(this.trees[this.getIndex(cell.x + 1, cell.y - 1)])
        if(this.cells[this.getIndex(cell.x - 1, cell.y    )]) arr.push(this.trees[this.getIndex(cell.x - 1, cell.y    )])
        if(this.cells[this.getIndex(cell.x + 1, cell.y    )]) arr.push(this.trees[this.getIndex(cell.x + 1, cell.y    )])
        if(this.cells[this.getIndex(cell.x - 1, cell.y + 1)]) arr.push(this.trees[this.getIndex(cell.x - 1, cell.y + 1)])
        if(this.cells[this.getIndex(cell.x    , cell.y + 1)]) arr.push(this.trees[this.getIndex(cell.x    , cell.y + 1)])
        if(this.cells[this.getIndex(cell.x + 1, cell.y + 1)]) arr.push(this.trees[this.getIndex(cell.x + 1, cell.y + 1)])

        return arr
    }
    
    addTree(tree: Tree) {

        if(this.trees.indexOf(tree) != -1) return

        const c = this.getCellCoordinatesByTree(tree)
        const i = this.getIndex(c.x, c.y)

        this.cells[i] = true
        this.trees[i] = tree

        this.trees.push(tree)
    }


    removeTree(tree: Tree) {

        let i = this.trees.indexOf(tree)
        if(i == -1) return

        const c = this.getCellCoordinatesByTree(tree)
        i = this.getIndex(c.x, c.y)

        this.cells[i] = false
        this.trees[i] = undefined
    }

    iterate() {

        console.log('ITERATE')

        const treesToRemove: Tree[] = []

        for(let tree of this.trees) {

            if(!tree) continue

            if(tree.isDead) {

                // Gonna fall already -> remove and continue
                if(tree.afterLifeState == TreeAfterLifeState.GONNAFALL) {

                    treesToRemove.push(tree)

                    continue
                }

                // Decompose tree
                tree.decompose()
            }
            else { // Alive

                tree.grow()
            }

            // Check if any tree grown too big and kills surrounding trees
            for (let t of this.getNeighbouringTrees(this.getCellCoordinatesByTree(tree))) {

                if(t) tree.takeOver(t)
            }

            // Flower
            if(tree.species.minAgeOfReproduction < tree.age) {

                for(let seed = 0; seed < tree.species.seedRate; seed++) {

                    if(tree.species.seedSurvivability >= Math.random() * 100) {

                        const x = (Math.random() * 2) - 1
                        const y = (Math.random() * 2) - 1
                        const n = new Vector2(x, y)
                        n.normalize().multiplyScalar(tree.species.seedSpreadDistance)
                        n.add(tree.position)
                        n.round()
                        if(this.getIndex(n.x, n.y))
                        this.addTree(this.getTreeBySpeciesName(tree.species.name, n, 0))
                    }
                } 
            }

            // Remove trees
            for(let r of treesToRemove) {

                this.removeTree(r)
            }
        }
    }

    getOak(position: Vector2, age: number) {

        return new Tree(new TreeSpecies(
            'Oak',
            200,
            10,
            100,
            50,
            2,
            1.05,
            4,
            .2,
            10
        ), position, age)
    }


    getBeech(position: Vector2, age: number) {

        return new Tree(new TreeSpecies(
            'Beech',
            100,
            5,
            80,
            40,
            1.5,
            1.03,
            5,
            .15,
            8
        ), position, age)
    }

    getTreeBySpeciesName(name: string, position: Vector2, age: number) {

        switch(name) {

            case 'Beech':
                return this.getBeech(position, age)

            case 'Oak':
                return this.getOak(position, age)

        }

        return null
    }
}