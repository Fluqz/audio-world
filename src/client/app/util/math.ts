import { Vector3 } from "three"



export class M {


    static UP = new Vector3(0, 1, 0)
    static FORWARD = new Vector3(0, 0, 1)

    /** Map a value from one range (min, max) to another. 
     * @param iMin Input min value
     * @param iMin Input max value
     * @param iMin Output min value
     * @param iMin Output max value
     * @param v Value to map
    */
    static map(v, iMin, iMax, oMin, oMax) {

        return oMin + (oMax - oMin) * ((v - iMin) / (iMax - iMin))
    }
}