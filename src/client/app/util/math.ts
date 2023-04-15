import { Vector3 } from "three"



export class M {

    static UP = new Vector3(0, 1, 0)
    static FORWARD = new Vector3(0, 0, 1)

    /** Map a value from one range (min, max) to another. 
     * @param v Value to map
     * @param iMin Input min value
     * @param iMax Input max value
     * @param oMin Output min value
     * @param oMax Output max value
    */
    static map(v: number, iMin: number, iMax: number, oMin: number, oMax: number) {

        return oMin + (oMax - oMin) * ((v - iMin) / (iMax - iMin))
    }

    /** Map a value to a logarithmic spacing. 
     * @param x Value to map
     * @param iMin Input min value
     * @param iMax Input max value
     * @param oMin Output min value
     * @param oMax Output max value
    */
    static mapLog(v: number, min: number, max: number) {

        const sMin = min
        const sMax = max

        if(min < 0) {

            max += Math.abs(min)
            min = .01
            let r = Math.log10(v / min) / Math.log10(max / min)

            return r - Math.abs(min)

        }
        else return Math.log10(v / min) / Math.log10(max / min)
    }


    // /** Map a value to a logarithmic spacing. 
    //  * @param x Value to map
    //  * @param iMin Input min value
    //  * @param iMax Input max value
    //  * @param oMin Output min value
    //  * @param oMax Output max value
    // */
    // static mapLog(v: number, vMin: number, vMax: number, lMin: number, lMax: number) {

    //     return vMin + Math.log10(v / lMin) / Math.log10(lMax / lMin) * (vMax - vMin)
    // }
}