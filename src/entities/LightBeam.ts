import Entity from "./Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import { World } from "../World";

export default class LightBeam extends Entity {
    size: number;
    numRays: number;
    lightRays: LightRay[];

    constructor(pos: Vector) {
        super(pos);

        this.size = 100;
        this.numRays = 10000;

        this.lightRays = [];
        for (let i = -this.size / 2; i <= this.size / 2; i += this.size / this.numRays) {
            this.lightRays.push(new LightRay(Vector.add(this.pos, new Vector(0, i)), new Vector(1, 0)));
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

    render(_ctx: CanvasRenderingContext2D) {
        // for (let l of this.lightRays) {
        //     l.render(ctx);
        // }
    }
}
