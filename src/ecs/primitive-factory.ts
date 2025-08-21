import { BoxGeometry, LatheGeometry, Mesh, OctahedronGeometry, SphereGeometry, TubeGeometry, Vec2, Vector2 } from "three";



export type CuboidPrimitive = 'CUBOID'
export type SpherePrimitive = 'SPHERE'
export type OctahedronPrimitive = 'OCTAHEDRON'
export type LathePrimitive = 'LATHE'

export type Primitive = CuboidPrimitive | SpherePrimitive | OctahedronPrimitive | LathePrimitive

export interface PrimitiveOptions {
    name: string
}
export interface SphereOptions extends PrimitiveOptions {
    radius: number
}
export interface CuboidOptions extends PrimitiveOptions {

    w: number
    h: number
    d: number
}
export interface OctahedronOptions extends PrimitiveOptions {
    
    radius: number
    detail: number
}

export interface LatheOptions extends PrimitiveOptions {
    
    phiStart: number
    phiLength: number
}





export class PrimitiveFactory {


    static create(primitive: Primitive, options?: PrimitiveOptions) : THREE.Mesh {

        switch(primitive) {

            case 'SPHERE': return this.createSphere(options as SphereOptions)
            case 'CUBOID': return this.createCuboid(options as CuboidOptions)
            case 'OCTAHEDRON': return this.createOctahedron(options as OctahedronOptions)
            case 'LATHE': return this.createLathe(options as LatheOptions)
        }
    }

    static createSphere(options: SphereOptions) {

        const m = this.createMesh()
        m.name = options.name
        m.geometry = new SphereGeometry(options.radius, 32, 32)

        return m
    }

    static createCuboid(options: CuboidOptions) {

        const m = this.createMesh()
        m.name = options.name
        m.geometry = new BoxGeometry(options.w, options.h, options.d)

        return m
    }

    static createLathe(options: LatheOptions) {

        const m = this.createMesh()
        m.name = options.name

        const peakRadius = 0

        const points: Vector2[] = [];
        for ( let i = 0; i < 10; i ++ ) {
            points.push( new Vector2( Math.sin( i * 0.2 ) * 7 + peakRadius, ( i - 0 ) * 1.5 ) )
        }

        m.geometry = new LatheGeometry(points, 64, options.phiStart, options.phiLength)

        m.geometry.rotateX(Math.PI)
        m.geometry.translate(0, 10, 0)

        m.geometry.scale(.2, .2, .2)

        return m
    }

    static createOctahedron(options: OctahedronOptions) {

        const m = this.createMesh()
        m.name = options.name
        m.geometry = new OctahedronGeometry(options.radius, options.detail)

        return m
    }

    static createMesh() {

        const mesh = new Mesh()

        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.matrixAutoUpdate = false

        return mesh
    }
}