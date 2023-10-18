import { Vector } from "polyly";

import PlaneSurface from "./PlaneSurface";
import { reflect } from "../lib/math";

export default class PlaneReflectiveSurface extends PlaneSurface {
    constructor(v1: Vector, v2: Vector) {
        super(v1, v2);
    }

    handle(_intersection: Vector, dir: Vector, _wavelength: number) {
        return reflect(dir, this.normal);
    }
}
