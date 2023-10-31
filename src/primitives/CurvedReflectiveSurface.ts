import { Vector } from "polyly";

import { reflect } from "../lib/math";
import CurvedSurface from "./CurvedSurface";

export default class CurvedReflectiveSurface extends CurvedSurface {
    constructor(center: Vector, radius: number, facing: Vector, span: number) {
        super(center, radius, facing, span);
    }

    override handle(intersection: Vector, dir: Vector, _wavelength: number) {
        let normal = Vector.sub(intersection, this.center).normalize();
        return reflect(dir, normal);
    }
}
