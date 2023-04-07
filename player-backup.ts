
// import * as THREE from 'three'
// import { Input } from './input'
// import { Globals } from './globals'
// import { AssetManager } from './asset-manager'
// import { ThirdPersonControl } from './third-person-controls'
// import { M } from './util/math'
// import { GameObject } from './object'
// import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'


// export class Player extends GameObject {

//     static list: Player[] = []

//     /** Player 3D container object */
//     obj: THREE.Object3D

//     /** Normalized direction of walking */
//     normal: THREE.Vector3
//     rotation: THREE.Quaternion
//     position: THREE.Vector3

//     force = new THREE.Vector3()

//     /** Offset angle Y used for walking directions */
//     directionOffset: number = 0
//     /** Velocity of walking speed */
//     velocity = 10
//     /** Velocity of running speed */
//     runVeclocity = 15

//     control: ThirdPersonControl
//     camera: THREE.PerspectiveCamera

//     state: string

//     constructor(camera: THREE.PerspectiveCamera) {

//         super()

//         Player.list.push(this)
            
//         this.camera = camera || new THREE.PerspectiveCamera()
//         this.normal = new THREE.Vector3()
//         this.position = new THREE.Vector3()
//         this.rotation = new THREE.Quaternion()
//         this.obj = new THREE.Object3D()

//         this.construct()
//     }

//     construct(): void {
        
//         this.state = 'IDLE'

//         // AssetManager.get('https://hitpuzzle.b-cdn.net/06627.glb').then((gltf: GLTF) => {

//         //     let m = gltf.scene.clone()

//         //     m.rotation.y = Math.PI
//         //     m.scale.set(1, 1, 1)
//         //     m.position.set(0, 0, 0)
//         //     m.traverse(o => o.updateMatrix())

//         //     this.obj.add(m)

//         //     console.log(gltf)
//         // })

//         let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshDistanceMaterial())
//         // m.geometry.translate(0, .5, 0)
//         // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
//         m.castShadow = true
//         m.receiveShadow = true
//         this.obj.add(m)

//         this.control = new ThirdPersonControl(this.obj, this.camera, Globals.dom)
//         this.control.updateTarget(new THREE.Vector3())
//     }

//     update(delta: number) {

//         this.checkInput()

//         if(this.state === 'WALK')
//             this.move(delta)

//         this.control.update()
//     }

//     checkInput() {

//         this.state = 'IDLE'

//         this.directionOffset = 0

//         if(Input.on('forward')) {

//             this.state = 'WALK'

//             // console.log('forward')
//             if(Input.on('left')) {
//                 // console.log('right')
//                 this.directionOffset = Math.PI / 4
//             }
//             else if(Input.on('right')) {
                
//                 // console.log('left')
//                 this.directionOffset = -Math.PI / 4
//             }
//         }
//         else if(Input.on('back')) {

//             this.state = 'WALK'

//             // console.log('back')
//             if(Input.on('left')) {

//                 // console.log('right')
//                 this.directionOffset = Math.PI / 4 + Math.PI / 2
//             }
//             else if(Input.on('right')) {
                
//                 // console.log('left')
//                 this.directionOffset = -Math.PI / 4 - Math.PI / 2
//             }
//             else {

//                 this.directionOffset = Math.PI
//             }
//         }
//         else if(Input.on('left')) {
            
//             // console.log('left')
//             this.state = 'WALK'
//             this.directionOffset = Math.PI / 2
//         }
//         else if(Input.on('right')) {

//             // console.log('right')
//             this.state = 'WALK'
//             this.directionOffset = -Math.PI / 2
//         }
//     }

//     get angleYCameraDirection() {

//         return Math.atan2((this.camera.position.x - this.obj.position.x), this.camera.position.z - this.obj.position.z)
//     }

//     move(delta: number) {

//         this.rotation.setFromAxisAngle(M.UP, this.angleYCameraDirection + this.directionOffset)
//         this.obj.quaternion.rotateTowards(this.rotation, .24)

//         this.camera.getWorldDirection(this.normal)
//         this.normal.y = 0
//         this.normal.normalize()
//         this.normal.applyAxisAngle(M.UP, this.directionOffset)

//         this.force.x = this.normal.x * this.velocity * delta
//         this.force.z = this.normal.z * this.velocity * delta

//         this.obj.position.x += this.force.x
//         this.obj.position.z += this.force.z
//         this.obj.updateMatrix()

//         this.position.copy(this.obj.position)

//         this.control.updateTarget(this.force)
//     }

//     destruct(): void {

//         Player.list.splice(Player.list.indexOf(this))
//     }
// }