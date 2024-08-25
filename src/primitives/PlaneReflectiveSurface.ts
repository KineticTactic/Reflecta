import { Vector } from "polyly";

import PlaneSurface from "./PlaneSurface";
import { LightRayResponseInfo, reflect } from "../lib/math";

export default class PlaneReflectiveSurface extends PlaneSurface {
    oneSided: boolean;

    constructor(v1: Vector, v2: Vector, oneSided = false) {
        super(v1, v2);
        this.oneSided = oneSided;
    }

    handle(_intersection: Vector, dir: Vector, _wavelength: number) {
        if (this.oneSided && dir.dot(this.normal) > 0) {
            const response: LightRayResponseInfo = {
                dir: Vector.zero(),
                newRay: false,
                terminate: true,
            };
            return response;
        }
        return reflect(dir, this.normal);
    }
}
