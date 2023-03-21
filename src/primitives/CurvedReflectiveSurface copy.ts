import { reflect } from "../lib/math";
import Vector from "../lib/Vector";
import CurvedSurface from "./CurvedSurface";

export default class CurvedRefractiveSurface extends CurvedSurface {
    refractiveIndex: number;
    criticalAngle: number;

    constructor(center: Vector, radius: number, facing: Vector, span: number, ri: number) {
        super(center, radius, facing, span);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }

    handle(intersection: Vector, dir: Vector) {
        // Calculate normal vector by (intersection point - center)
        let normal = Vector.sub(intersection, this.center).normalize();

        // find angle between dir and normal
        let angleBetween = Math.atan2(dir.y, dir.x) - Math.atan2(normal.y, normal.x);

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
                return reflect(dir, normal);
            }
            let angleOfRefraction = Math.asin(Math.sin(angleOfIncidence) * this.refractiveIndex);
            let angleOfDeviation = angleOfIncidence - angleOfRefraction;

            return dir.copy().rotate(-angleOfDeviation);
        }
    }
}
