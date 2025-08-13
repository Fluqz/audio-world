"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M = void 0;
const three_1 = require("three");
class M {
    /** Map a value from one range (min, max) to another.
     * @param v Value to map
     * @param iMin Input min value
     * @param iMax Input max value
     * @param oMin Output min value
     * @param oMax Output max value
    */
    static map(v, iMin, iMax, oMin, oMax) {
        return oMin + (oMax - oMin) * ((v - iMin) / (iMax - iMin));
    }
    /** Returns val between 0 and 10 000 000 */
    static linearTologarithmic(v, vMin, vMax, lMin, lMax) {
        // let slMin = 0
        // let slMax = 0
        // if(lMin <= 0 || lMax <= 0) {
        //     slMin = lMin
        //     slMax = lMax
        //     let range = Math.abs(slMax - slMin)
        //     lMin = 1
        //     lMax = range + 1
        // }
        // The result should be between 100 an 10 000 000
        var minv = Math.log(lMin);
        var maxv = Math.log(lMax);
        // calculate adjustment factor
        var scale = (maxv - minv) / (vMax - vMin);
        return Math.exp(minv + scale * (v - vMin)); //- slMax
    }
    /** Returns val between 0 and 100 */
    static logsReverse(v) {
        // position will be between 0 and 100
        var minp = 0;
        var maxp = 100;
        // The result should be between 100 an 10000000
        var minv = Math.log(100);
        var maxv = Math.log(10000000);
        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);
        return (Math.log(v) - minv) / scale + minp;
    }
    /** Map a value to a logarithmic spacing.
     * @param x Value to map
     * @param iMin Input min value
     * @param iMax Input max value
     * @param oMin Output min value
     * @param oMax Output max value
    */
    static mapLog(v, min, max) {
        const sMin = min;
        const sMax = max;
        if (min < 0) {
            max += Math.abs(min);
            min = .01;
            let r = Math.log10(v / min) / Math.log10(max / min);
            return r - Math.abs(min);
        }
        else
            return Math.log10(v / min) / Math.log10(max / min);
    }
}
exports.M = M;
M.UP = new three_1.Vector3(0, 1, 0);
M.FORWARD = new three_1.Vector3(0, 0, 1);
//# sourceMappingURL=math.js.map