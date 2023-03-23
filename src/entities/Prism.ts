import Vector from "../lib/Vector";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import SurfaceEntity from "./SurfaceEntity";

const EQUILATERAL_PRISM_VERTICES = [new Vector(0, -Math.sqrt(3) / 3), new Vector(0.5, Math.sqrt(3) / 6), new Vector(-0.5, Math.sqrt(3) / 6)];

export default class Prism extends SurfaceEntity {
    size: number;
    refractiveIndex: number;

    constructor(pos: Vector) {
        super(pos);

        this.size = 200;
        this.refractiveIndex = 1.5;

        let v1 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[0].copy().mult(this.size).rotate(this.rot));
        let v2 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[1].copy().mult(this.size).rotate(this.rot));
        let v3 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[2].copy().mult(this.size).rotate(this.rot));

        this.surfaces = [
            new PlaneRefractiveSurface(v2, v1, this.refractiveIndex),
            new PlaneRefractiveSurface(v3, v2, this.refractiveIndex),
            new PlaneRefractiveSurface(v1, v3, this.refractiveIndex),
        ];
    }

    // handleClick(_mousePos: Vector): boolean {
    //     for (let s of this.surfaces) {
    //         if (s.intersectsPoint(_mousePos, 10)) {
    //             console.log("YEE");
    //             return true;
    //         }
    //     }
    //     return false;
    // }
}
