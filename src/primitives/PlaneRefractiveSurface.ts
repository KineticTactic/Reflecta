import PlaneSurface from "./PlaneSurface";
import Vector from "../lib/Vector";
import { refract } from "../lib/math";

export default class PlaneRefractiveSurface extends PlaneSurface {
    refractiveIndex: number;
    criticalAngle: number;

    constructor(v1: Vector, v2: Vector, ri: number) {
        super(v1, v2);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }

    handle(_intersection: Vector, dir: Vector) {
        return refract(dir, this.normal, this.refractiveIndex, this.criticalAngle);
    }
}
