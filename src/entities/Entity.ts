import Vector from "../lib/Vector";
import { AABB } from "../util/Bounds";
import { World } from "../World";

export default abstract class Entity {
    pos: Vector;
    rot: number;
    bounds: AABB;

    displayBounds: boolean = false;

    constructor(pos: Vector) {
        this.pos = pos;
        this.rot = 0;

        this.bounds = new AABB(Vector.ZERO, Vector.ZERO);
    }

    setPosition(p: Vector) {
        const deltaPos = Vector.sub(p, this.pos);
        this.updateTransforms(deltaPos, 0);
        this.updateBounds();
    }

    translate(delta: Vector): void {
        this.pos.add(delta);

        this.updateTransforms(delta, 0);
        this.updateBounds();
    }

    rotate(theta: number): void {
        this.rot += theta;
        this.updateTransforms(Vector.ZERO, theta);
        this.updateBounds();
    }

    updateTransforms(_deltaPos: Vector, _deltaRot: number): void {}
    updateBounds(): void {}

    abstract addToWorld(_world: World): void;

    render(ctx: CanvasRenderingContext2D, isSelected: boolean): void {
        if (this.displayBounds) this.bounds.render(ctx);
        if (isSelected) this.bounds.render(ctx, "#8424b9", 2);
    }
}
