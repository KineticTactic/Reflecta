import Vector from "../lib/Vector";
import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";

export default class GlassSphere extends SurfaceEntity {
    radius: number;
    refractiveIndex: number;

    constructor(pos: Vector) {
        super(pos);

        this.radius = 100;
        this.refractiveIndex = 1.666;

        this.surfaces = [new CurvedRefractiveSurface(pos, this.radius, new Vector(1, 0), Math.PI * 2, this.refractiveIndex)];

        this.updateBounds();
    }
}
