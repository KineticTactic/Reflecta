import Vector from "../lib/Vector";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import SurfaceEntity from "./SurfaceEntity";

export default class ConcaveLens extends SurfaceEntity {
    span: number;
    radiusOfCurvature: number;
    thickness: number;
    refractiveIndex: number;

    constructor(pos: Vector) {
        super(pos);

        this.span = 0.4;
        this.radiusOfCurvature = 500;
        this.thickness = 4;
        this.refractiveIndex = 1.666;

        let centerOffset = this.radiusOfCurvature + this.thickness / 2;
        let h = this.radiusOfCurvature * Math.sin(this.span / 2);
        let x = this.radiusOfCurvature - Math.cos(this.span / 2) * this.radiusOfCurvature + this.thickness / 2;

        this.surfaces = [
            new CurvedRefractiveSurface(new Vector(pos.x - centerOffset, pos.y), this.radiusOfCurvature, new Vector(1, 0), this.span, this.refractiveIndex, -1),
            new CurvedRefractiveSurface(
                new Vector(pos.x + centerOffset, pos.y),
                this.radiusOfCurvature,
                new Vector(-1, 0),
                this.span,
                this.refractiveIndex,
                -1
            ),
            new PlaneRefractiveSurface(new Vector(pos.x - x, pos.y + h), new Vector(pos.x + x, pos.y + h), this.refractiveIndex),
            new PlaneRefractiveSurface(new Vector(pos.x + x, pos.y - h), new Vector(pos.x - x, pos.y - h), this.refractiveIndex),
        ];
    }
}
