import PlaneSurface from "./PlaneSurface";
import Vector from "../lib/Vector";
import { LightRayResponseInfo } from "../lib/math";

export default class PlaneBlockerSurface extends PlaneSurface {
    constructor(v1: Vector, v2: Vector) {
        super(v1, v2);
    }

    handle(_intersection: Vector, _dir: Vector, _wavelength: number) {
        const response: LightRayResponseInfo = {
            dir: Vector.zero(),
            newRay: false,
            terminate: true,
        };

        return response;
    }
}
