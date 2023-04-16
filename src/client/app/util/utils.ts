import { CubeTexture } from "three"
import { Entity } from "../core/entity"
import { EComponent } from "../core/components/component"

export class Utils {


    static dispose(obj) {

        obj.traverse(object => {

            if (!object['isMesh']) return
            
            object['geometry'].dispose()
        
            if (object['material'].isMaterial) {
                cleanMaterial(object['material'])
            } else {
                // an array of materials
                for (const material of object['material']) cleanMaterial(material)
            }
        })
        
        function cleanMaterial(material) {

            material.dispose()
        
            // dispose textures
            for (const key of Object.keys(material)) {
                
                const value = material[key]
                if(value instanceof CubeTexture) continue
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    value.dispose()
                }
            }
        }
    }

    static makeUID() {

        return (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity.count
    }
}
