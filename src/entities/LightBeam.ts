import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";

export default class LightBeam extends Entity {
    size: number;
    numRays: number;

    static entityData: EntityData = {
        name: "Light Beam",
        desc: "A light beam.",
        constructorFunc: LightBeam,
    };

    constructor(pos: Vector) {
        super(pos, "Light Beam");

        this.size = 150;
        this.numRays = 100;

        this.init();

        // Attributes
        this.attributes.push({ name: "size", type: AttributeType.Number, min: 0, max: 10000, value: this.size });
        this.attributes.push({ name: "numRays", type: AttributeType.Number, min: 0, max: 10000, value: this.numRays });
    }

    init() {
        this.lightRays = [];
        for (let i = -this.size / 2; i <= this.size / 2; i += this.size / this.numRays) {
            this.lightRays.push(new LightRay(Vector.add(this.pos, new Vector(0, i).rotate(this.rot)), Vector.right().rotate(this.rot)));
        }
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

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);

        switch (attribute) {
            case "size":
                this.size = value as number;
                this.init();
                break;
            case "numRays":
                this.numRays = value as number;
                this.init();
                break;
        }
    }
}
