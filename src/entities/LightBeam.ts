import Entity from "./Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import { World } from "../World";
import { AABB } from "../util/Bounds";

export default class LightBeam extends Entity {
    size: number;
    numRays: number;
    dir: Vector;
    lightRays: LightRay[];

    constructor(pos: Vector) {
        super(pos);

        this.size = 150;
        this.numRays = 100;
        this.dir = new Vector(1, 0);

        this.lightRays = [];
        for (let i = -this.size / 2; i <= this.size / 2; i += this.size / this.numRays) {
            this.lightRays.push(new LightRay(Vector.add(this.pos, new Vector(0, i)), this.dir));
        }

        this.updateBounds();
    }

    addToWorld(world: World) {
        for (let l of this.lightRays) {
            world.addLightRay(l);
        }
    }

    override updateTransforms(deltaPos: Vector, deltaRot: number): void {
        // this.pos.add(deltaPos);
        this.dir.rotate(deltaRot);

        for (let l of this.lightRays) {
            l.origin.add(deltaPos);
            l.origin.rotateAboutAxis(deltaRot, this.pos);
            l.dir = this.dir;
        }
    }

    override updateBounds() {
        const min = this.lightRays[0].origin.copy();
        const max = this.lightRays[this.lightRays.length - 1].origin.copy();
        this.bounds = AABB.fromPoints([min, max]);
        this.bounds.setMinSize(20);
    }
}
