import Entity from "./Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import { World } from "../World";
import { AABB } from "../util/Bounds";

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

        this.updateBounds();
    }

    override updateTransforms(_deltaPos: Vector, _deltaRot: number): void {
        for (let l of this.lightRays) {
            l.origin = this.pos;
        }
    }

    override updateBounds(): void {
        this.bounds = AABB.fromPoints([this.pos.copy(), this.pos.copy()]);
        this.bounds.setMinSize(50);
    }

    addToWorld(world: World) {
        for (let l of this.lightRays) {
            world.addLightRay(l);
        }
    }
}
