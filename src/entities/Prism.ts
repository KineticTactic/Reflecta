import Vector from "../lib/Vector";
import Entity from "../primitives/Entity";
import RefractiveSurface from "../primitives/RefractiveSurface";
import { World } from "../World";

export default class Prism extends Entity {
    size: number;
    refractiveIndex: number;
    surfaces: RefractiveSurface[];

    constructor(pos: Vector) {
        super(pos);

        this.size = 200;
        this.refractiveIndex = 1.5;

        let v1 = Vector.add(this.pos, new Vector(0, (-Math.sqrt(3) * this.size) / 3));
        let v2 = Vector.add(this.pos, new Vector(this.size / 2, (Math.sqrt(3) * this.size) / 6));
        let v3 = Vector.add(this.pos, new Vector(-this.size / 2, (Math.sqrt(3) * this.size) / 6));

        this.surfaces = [
            new RefractiveSurface(v2, v1, this.refractiveIndex),
            new RefractiveSurface(v3, v2, this.refractiveIndex),
            new RefractiveSurface(v1, v3, this.refractiveIndex),
        ];
    }

    addToWorld(world: World) {
        for (let s of this.surfaces) {
            world.addSurface(s);
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        for (let s of this.surfaces) {
            s.render(ctx);
        }
    }
}
