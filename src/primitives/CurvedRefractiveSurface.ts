import { refract } from "../lib/math";
import Vector from "../lib/Vector";
import CurvedSurface from "./CurvedSurface";

export default class CurvedRefractiveSurface extends CurvedSurface {
    refractiveIndex: number;
    criticalAngle: number;
    normal: number;

    constructor(center: Vector, radius: number, facing: Vector, span: number, ri: number, normal = 1) {
        super(center, radius, facing, span);

        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
        this.normal = normal;
    }

    handle(intersection: Vector, dir: Vector) {
        // Calculate normal vector by (intersection point - center)
        let normal = Vector.sub(intersection, this.center).normalize().mult(this.normal);

        return refract(dir, normal, this.refractiveIndex, this.criticalAngle);
    }

    setRefractiveIndex(ri: number) {
        this.refractiveIndex = ri;
        this.criticalAngle = Math.asin(1 / this.refractiveIndex);
    }
}
