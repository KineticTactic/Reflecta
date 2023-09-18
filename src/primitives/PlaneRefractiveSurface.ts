import PlaneSurface from "./PlaneSurface";
import Vector from "../lib/Vector";
import { calculateRefractiveIndexForWavelength, refract } from "../lib/math";

export default class PlaneRefractiveSurface extends PlaneSurface {
    refractiveIndex: number;
    criticalAngle: number;

    constructor(v1: Vector, v2: Vector, ri: number) {
        super(v1, v2);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }

    handle(_intersection: Vector, dir: Vector, wavelength: number) {
        const ri = calculateRefractiveIndexForWavelength(wavelength, 570, this.refractiveIndex);

        return refract(dir, this.normal, ri, this.criticalAngle);
    }

    setRefractiveIndex(ri: number) {
        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }
}
