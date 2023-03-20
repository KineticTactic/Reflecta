import Vector from "../lib/Vector";
import { World } from "../World";

export default class Entity {
    pos: Vector;

    constructor(pos: Vector) {
        this.pos = pos;
    }

    addToWorld(_world: World) {}

    render(_ctx: CanvasRenderingContext2D) {}
}
