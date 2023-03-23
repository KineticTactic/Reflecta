import Vector from "../lib/Vector";
import { World } from "../World";

export default abstract class Entity {
    pos: Vector;
    rot: number;

    constructor(pos: Vector) {
        this.pos = pos;
        this.rot = 0;
    }

    setPosition(p: Vector) {
        const deltaPos = Vector.sub(p, this.pos);
        this.updateTransforms(deltaPos, 0);
    }

    translate(delta: Vector): void {
        this.pos.add(delta);
        this.updateTransforms(delta, 0);
    }

    rotate(theta: number): void {
        this.rot += theta;
        this.updateTransforms(Vector.ZERO, theta);
    }

    updateTransforms(_deltaPos: Vector, _deltaRot: number): void {}

    abstract addToWorld(_world: World): void;

    abstract handleClick(_mousePos: Vector): boolean;

    abstract render(_ctx: CanvasRenderingContext2D): void;
}
