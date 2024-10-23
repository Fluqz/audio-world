import { Vec2, Vector2 } from "three";
import { Tree, TreeAfterLifeState } from "./tree";
import { TreeSpecies } from "./tree-species";


export class ForestGenerator {

    cells: Vector2[][]

    trees: Tree[]

    width: number
    height: number
    cellSize: number

    constructor(width: number, height: number, cellSize: number) {

        this.cells = []
        this.trees = []

        this.generateCells(width, height, cellSize)
    }

    generateCells(width: number, height: number, cellSize: number) {

        this.width = width
        this.height = height
        this.cellSize = cellSize

        this.cells.length = 0

        let i = 0
        for(let x = -this.width / 2; x < this.width / 2; x+=cellSize) {

            this.cells[i] = []

            let k = 0
            for(let y = -this.height / 2; y < this.height / 2; y+=cellSize) {

                this.cells[i][k] = new Vector2(x, y)

                k++
            }

            i++
        }

        console.log('Cells',this.cells)
    }

    /** NOOOOOOOOOOOISE!!!! USE NOISE FOR BASIC TREE POSITIONS */
    generateBaseForest() {

        for(let x = 0; x < this.cells.length; x++) {

            for(let y = 0; y < this.cells[x].length; y++) {

                if(Math.random() > .8) {

                    this.cells[x][y] = new Vector2(x * this.cellSize, y * this.cellSize)
                    this.addTree(
                        this.getTreeBySpeciesName(Math.random() > .5 ? 'Beech' : 'Oak', 
                        new Vector2(this.cells[x][y].x, this.cells[x][y].y), 
                        0)
                    )
                }
            }
        }
    }

    getClosestCellPoint(tree: Tree) {

        let maxD = 0
        let closestNeighbour

        for(let x = 0; x < this.cells.length; x++) {

            for(let y = 0; y < this.cells[x].length; y++) {

                const d = this.cells[x][y].distanceTo(tree.position)
                if(d > maxD) {
    
                    maxD = d
                    closestNeighbour = this.cells[x][y]
                }
            }
        }

        console.log('getClosestCellPoint', tree, closestNeighbour)
        return closestNeighbour
    }

    getCellFromPoint(point: Vector2) {

        console.log('getCellFromPoint', this.cells[point.x / this.cellSize][point.y / this.cellSize])
        return this.cells[point.x / this.cellSize][point.y / this.cellSize]
    }

    getTreeByCell(cell: Vector2) {

        return this.trees.find((v) => {

            if(v.position.x / this.cellSize == cell.x && v.position.y / this.cellSize == cell.y) return
        })
    }
    getCellByTree(tree: Tree) {

        console.log('getCellByTree', this.getCellFromPoint(tree.position))
        return this.getCellFromPoint(tree.position)
    }

    getNeighbouringCells(cell: Vector2) {

        const arr: Vector2[] = []

        if(this.cells[cell.x-1] && this.cells[cell.x-1][cell.y-1]) arr.push(this.cells[cell.x-1][cell.y-1])
        if(this.cells[cell.x-1] && this.cells[cell.x-1][cell.y]) arr.push(this.cells[cell.x-1][cell.y])
        if(this.cells[cell.x-1] && this.cells[cell.x-1][cell.y+1]) arr.push(this.cells[cell.x-1][cell.y+1])
        if(this.cells[cell.x] && this.cells[cell.x][cell.y+1]) arr.push(this.cells[cell.x][cell.y+1])
        if(this.cells[cell.x] && this.cells[cell.x][cell.y-1]) arr.push(this.cells[cell.x][cell.y-1])
        if(this.cells[cell.x+1] && this.cells[cell.x+1][cell.y+1]) arr.push(this.cells[cell.x+1][cell.y+1])
        if(this.cells[cell.x+1] && this.cells[cell.x+1][cell.y]) arr.push(this.cells[cell.x+1][cell.y])
        if(this.cells[cell.x+1] && this.cells[cell.x+1][cell.y-1]) arr.push(this.cells[cell.x+1][cell.y-1])

        console.log('getNeighbouringCells', arr)
        return arr
    }
    
    addTree(tree: Tree) {

        if(this.trees.indexOf(tree) != -1) return
        this.trees.push(tree)
    }


    removeTree(tree: Tree) {

        let i = this.trees.indexOf(tree)
        if(i == -1) return
        this.trees.splice(i, 1)
    }

    iterate() {

        console.log('ITERATE')

        const treesToRemove: Tree[] = []

        for(let tree of this.trees) {

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
            for (let cell of this.getNeighbouringCells(this.getClosestCellPoint(tree))) {

                if(cell) tree.takeOver(this.getTreeByCell(cell))
            }

            // Flower
            if(tree.species.minAgeOfReproduction < tree.age) {

                for(let seed = 0; seed < tree.species.seedRate; seed++) {

                    if(tree.species.seedSurvivability >= Math.random()) {

                        const x = (Math.random() * 2) - 1
                        const y = (Math.random() * 2) - 1
                        const n = new Vector2(x, y)
                        n.normalize().multiplyScalar(tree.species.seedSpreadDistance)
                        n.add(tree.position)
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
            63,
            .5,
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
            60,
            .6,
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