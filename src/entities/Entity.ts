import Vector from "../lib/Vector";
import { World } from "../World";

export default abstract class Entity {
    pos: Vector;

    constructor(pos: Vector) {
        this.pos = pos;
    }

    abstract addToWorld(_world: World): void;

    abstract handleClick(_mousePos: Vector): boolean;

    abstract render(_ctx: CanvasRenderingContext2D): void;
}
