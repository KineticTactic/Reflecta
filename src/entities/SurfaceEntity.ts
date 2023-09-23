import Vector from "../lib/Vector";
// import Surface from "../primitives/Surface";
import AABB from "../util/Bounds";
import Entity from "../core/Entity";
import Renderer from "../graphics/Renderer";

export default abstract class SurfaceEntity extends Entity {
    constructor(pos: Vector, name: string) {
        super(pos, name);
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

    override render(renderer: Renderer, isSelected: boolean) {
        for (let s of this.surfaces) s.render(renderer, this.color);

        super.render(renderer, isSelected);
    }
}