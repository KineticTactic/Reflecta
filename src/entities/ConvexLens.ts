import Vector from "../lib/Vector";
import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";

export default class ConvexLens extends SurfaceEntity {
    angle: number;
    span: number;
    radiusOfCurvature: number;
    refractiveIndex: number;

    constructor(pos: Vector) {
        super(pos);

        this.span = 1;
        this.radiusOfCurvature = 200;
        this.refractiveIndex = 1.666;
        this.angle = 0;

        let l = this.radiusOfCurvature * Math.sin(this.span / 2);
        let centerOffset = Math.sqrt(this.radiusOfCurvature ** 2 - l ** 2);

        this.surfaces = [
            new CurvedRefractiveSurface(new Vector(pos.x - centerOffset, pos.y), this.radiusOfCurvature, new Vector(1, 0), this.span, this.refractiveIndex),
            new CurvedRefractiveSurface(new Vector(pos.x + centerOffset, pos.y), this.radiusOfCurvature, new Vector(-1, 0), this.span, this.refractiveIndex),
        ];

        this.updateBounds();
    }
}
