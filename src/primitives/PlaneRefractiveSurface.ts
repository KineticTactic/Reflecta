import { Vector } from "polyly";

import PlaneSurface from "./PlaneSurface";
import { calculateRefractiveIndexForWavelength, refract } from "../lib/math";

export default class PlaneRefractiveSurface extends PlaneSurface {
    refractiveIndex: number;
    criticalAngle: number;

    constructor(v1: Vector, v2: Vector, ri: number) {
        super(v1, v2);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }

    handle(intersection: Vector, dir: Vector, wavelength: number) {
        const ri = calculateRefractiveIndexForWavelength(wavelength, 570, this.refractiveIndex);

        const response = refract(dir, this.normal, ri, this.criticalAngle);
        response.newRayOrigin = intersection;
        return response;
    }

    setRefractiveIndex(ri: number) {
        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }
}
