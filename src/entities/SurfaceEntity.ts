import Vector from "../lib/Vector";
import Surface from "../primitives/Surface";
import { AABB } from "../util/Bounds";
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
            s.rotateAboutAxis(deltaRot, this.pos.copy());
        }
    }

    override updateBounds(): void {
        // Calculate AABB of each surface, store them to an array, then calculate an AABB encompassing all of them.
        let aabbs: AABB[] = [];

        for (let s of this.surfaces) {
            const aabb = s.calculateAABB();
            aabbs.push(aabb);
        }

        this.bounds = AABB.fromAABBs(aabbs);
    }

    override addToWorld(world: World) {
        for (let s of this.surfaces) {
            world.addSurface(s);
        }
    }

    override render(ctx: CanvasRenderingContext2D, isSelected: boolean) {
        for (let s of this.surfaces) {
            s.render(ctx);
        }

        super.render(ctx, isSelected);
    }
}
