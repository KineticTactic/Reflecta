import { Vector, Renderer } from "polyly";
// import Surface from "../primitives/Surface";
import AABB from "../util/Bounds";
import Entity, { EntityOptions } from "../core/Entity";

export type SurfaceEntityOptions = EntityOptions;

export default abstract class SurfaceEntity extends Entity {
    constructor(name: string, options: SurfaceEntityOptions = {}) {
        super(name, options);
    }

    override updateTransforms(deltaPos: Vector, deltaRot: number): void {
        for (const s of this.surfaces) {
            s.translate(deltaPos);
            s.rotateAboutAxis(deltaRot, this.pos.copy());
        }

        for (const draggable of this.draggables) {
            let draggablePos = draggable.pos.copy();
            draggablePos.add(deltaPos);
            draggablePos = draggablePos.rotateAboutAxis(deltaRot, this.pos.copy());
            draggable.setWorldPos(draggablePos);
        }
    }

    override updateBounds(): void {
        // Calculate AABB of each surface, store them to an array, then calculate an AABB encompassing all of them.
        const aabbs: AABB[] = [];

        for (const s of this.surfaces) {
            const aabb = s.calculateAABB();
            aabbs.push(aabb);
        }

        this.bounds = AABB.fromAABBs(aabbs);
    }

    override render(renderer: Renderer, isSelected: boolean, drawSurfaces: boolean = true) {
        if (drawSurfaces) {
            for (const s of this.surfaces) s.render(renderer, this.color);
        }

        super.render(renderer, isSelected);
    }
}
