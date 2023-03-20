import PlaneSurface from "./PlaneSurface";
import Vector from "../lib/Vector";
import { reflect } from "../lib/math";

export default class PlaneRefractiveSurface extends PlaneSurface {
    refractiveIndex: number;
    criticalAngle: number;

    constructor(v1: Vector, v2: Vector, ri: number) {
        super(v1, v2);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }

    handle(_intersection: Vector, dir: Vector) {
        // let angleBetween = intersection.normalize().dot(dir.normalize());

        // find angle between dir and normal
        let angleBetween = Math.atan2(dir.y, dir.x) - Math.atan2(this.normal.y, this.normal.x);

        if (angleBetween > Math.PI / 2 || angleBetween < -Math.PI / 2) {
            // The ray is going from RARER TO DENSER
            let angleOfIncidence = Math.PI - angleBetween;
            let angleOfRefraction = Math.asin(Math.sin(angleOfIncidence) / this.refractiveIndex);
            let angleOfDeviation = angleOfIncidence - angleOfRefraction;

            return dir.copy().rotate(angleOfDeviation);
        } else {
            // The ray is going from DENSER TO RARER
            let angleOfIncidence = angleBetween;
            if (angleOfIncidence > this.criticalAngle || angleOfIncidence < -this.criticalAngle) {
                // TOTAL INTERNAL REFLECTION!!
                return reflect(dir, this.normal);
            }
            let angleOfRefraction = Math.asin(Math.sin(angleOfIncidence) * this.refractiveIndex);
            let angleOfDeviation = angleOfIncidence - angleOfRefraction;

            return dir.copy().rotate(-angleOfDeviation);
        }
    }
}
