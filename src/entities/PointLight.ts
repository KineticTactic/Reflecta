import Entity from "./Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import { World } from "../World";

export default class PointLight extends Entity {
    numRays: number;
    lightRays: LightRay[];

    constructor(pos: Vector) {
        super(pos);

        this.numRays = 1000;

        this.lightRays = [];
        for (let i = 0; i < this.numRays; i++) {
            this.lightRays.push(new LightRay(this.pos, new Vector(1, 0).rotate(((Math.PI * 2) / this.numRays) * i)));
        }
    }

    addToWorld(world: World) {
        for (let l of this.lightRays) {
            world.addLightRay(l);
        }
    }

    handleClick(_mousePos: Vector): boolean {
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        // for (let l of this.lightRays) {
        //     l.render(ctx);
        // }
    }
}
