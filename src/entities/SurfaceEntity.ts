import { Vector, Renderer } from "polyly";
// import Surface from "../primitives/Surface";
import AABB from "../util/Bounds";
import Entity from "../core/Entity";

export default abstract class SurfaceEntity extends Entity {
    constructor(pos: Vector, rot: number, name: string) {
        super(pos, rot, name);
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

    override render(renderer: Renderer, isSelected: boolean, drawSurfaces: boolean = true) {
        if (drawSurfaces) {
            for (let s of this.surfaces) s.render(renderer, this.color);
        }

        super.render(renderer, isSelected);
    }
}
