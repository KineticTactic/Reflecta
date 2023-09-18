import { reflect } from "../lib/math";
import Vector from "../lib/Vector";
import CurvedSurface from "./CurvedSurface";

export default class CurvedReflectiveSurface extends CurvedSurface {
    constructor(center: Vector, radius: number, facing: Vector, span: number) {
        super(center, radius, facing, span);
    }

    handle(intersection: Vector, dir: Vector, _wavelength: number) {
        // Calculate normal vector by (intersection point - center)
        let normal = Vector.sub(intersection, this.center).normalize();
        return reflect(dir, normal);
    }
}
