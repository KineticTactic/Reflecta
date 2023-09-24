import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import EntityData from "../core/EntityData";
import { interpolate } from "../lib/math";
import { AttributeType } from "../ui/Attribute";

export default class Laser extends Entity {
    numRays: number;

    static entityData: EntityData = {
        name: "Laser",
        desc: "A laser.",
        constructorFunc: Laser,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Laser");

        this.numRays = 500;

        this.init();

        // Attributes
        this.attributes.push({ name: "numRays", type: AttributeType.Number, min: 0, max: 200, value: this.numRays });
    }

    init() {
        this.lightRays = [];
        for (let i = 0; i < this.numRays; i++) {
            let wavelength = interpolate(i, 0, this.numRays, 400, 700);
            this.lightRays.push(
                new LightRay({
                    origin: Vector.add(this.pos, new Vector(0, 1).rotate(this.rot)),
                    dir: Vector.right().rotate(this.rot),
                    monochromatic: true,
                    wavelength: wavelength,
                    intensity: 5,
                })
            );
        }
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

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);

        switch (attribute) {
            case "numRays":
                this.numRays = value as number;
                this.init();
                break;
        }
    }
}
