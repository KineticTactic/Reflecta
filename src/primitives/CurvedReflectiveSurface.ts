import { Vector } from "polyly";

import { LightRayResponseInfo, reflect } from "../lib/math";
import CurvedSurface from "./CurvedSurface";

export enum CurvedReflectiveSurfaceType {
    CONVEX,
    CONCAVE,
    DOUBLE_SIDED,
}

export default class CurvedReflectiveSurface extends CurvedSurface {
    surfaceType: CurvedReflectiveSurfaceType;

    constructor(
        center: Vector,
        radius: number,
        facing: Vector,
        span: number,
        public type: CurvedReflectiveSurfaceType = CurvedReflectiveSurfaceType.DOUBLE_SIDED
    ) {
        super(center, radius, facing, span);
        this.surfaceType = type;
    }

    override handle(intersection: Vector, dir: Vector, _wavelength: number) {
        let normal = Vector.sub(intersection, this.center).normalize();

        if (this.surfaceType !== CurvedReflectiveSurfaceType.DOUBLE_SIDED) {
            const response: LightRayResponseInfo = {
                dir: Vector.zero(),
                newRay: false,
                terminate: true,
            };

            if (this.surfaceType === CurvedReflectiveSurfaceType.CONVEX && dir.dot(normal) > 0) return response;
            if (this.surfaceType === CurvedReflectiveSurfaceType.CONCAVE && dir.dot(normal) < 0) return response;
        }

        return reflect(dir, normal);
    }
}
