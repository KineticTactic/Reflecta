import { Vector } from "polyly";

import PlaneSurface from "./PlaneSurface";
import { LightRayResponseInfo } from "../lib/math";

// A blocker surface is a surface which absorbs (blocks) all light that hits it

export default class PlaneBlockerSurface extends PlaneSurface {
    constructor(v1: Vector, v2: Vector) {
        super(v1, v2);
    }

    override handle(_intersection: Vector, _dir: Vector, _wavelength: number) {
        const response: LightRayResponseInfo = {
            dir: Vector.zero(),
            newRay: false,
            terminate: true,
        };

        return response;
    }
}
