import Vector from "../lib/Vector";
import Surface from "../primitives/Surface";
import { World } from "../World";
import Entity from "./Entity";

export default abstract class SurfaceEntity extends Entity {
    surfaces: Surface[];

    constructor(pos: Vector) {
        super(pos);

        this.surfaces = [];
    }

    override updateTransforms(deltaPos: Vector, deltaRot: number): void {
        for (let s of this.surfaces) {
            s.translate(deltaPos);
            s.rotateAboutAxis(deltaRot, this.pos);
        }
    }

    override addToWorld(world: World) {
        for (let s of this.surfaces) {
            world.addSurface(s);
        }
    }

    override handleClick(_mousePos: Vector): boolean {
        return false;
    }

    override render(ctx: CanvasRenderingContext2D) {
        for (let s of this.surfaces) {
            s.render(ctx);
        }
    }
}
