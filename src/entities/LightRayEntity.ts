import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import EntityData from "../core/EntityData";

export default class LightRayEntity extends Entity {
    static entityData: EntityData = {
        name: "Light Ray",
        desc: "A light ray.",
        constructorFunc: LightRayEntity,
    };

    constructor(pos: Vector) {
        super(pos, "Light Beam");

        this.init();
    }

    init() {
        this.lightRays = [new LightRay(Vector.add(this.pos, new Vector(0, 1).rotate(this.rot)), Vector.right().rotate(this.rot))];
        console.log(this.lightRays[0]);

        this.updateBounds();
    }

    override updateTransforms(deltaPos: Vector, deltaRot: number): void {
        for (let l of this.lightRays) {
            l.origin.add(deltaPos);
            l.origin.rotateAboutAxis(deltaRot, this.pos);
            l.dir = Vector.right().rotate(this.rot);
        }
    }

    override updateBounds() {
        const min = this.lightRays[0].origin.copy();
        const max = this.lightRays[this.lightRays.length - 1].origin.copy();
        this.bounds = AABB.fromPoints([min, max]);
        this.bounds.setMinSize(20);
    }
}
