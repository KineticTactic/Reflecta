import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import EntityData from "../core/EntityData";
import { interpolate } from "../lib/math";
import { AttributeType } from "../ui/Attribute";

export default class Laser extends Entity {
    numRays: number;
    dispersable: boolean;
    intensity: number = 5;

    static entityData: EntityData = {
        name: "Laser",
        desc: "A laser.",
        constructorFunc: Laser,
    };

    constructor(pos: Vector, rot: number = 0, dispersable: boolean = true) {
        super(pos, rot, "Laser");

        this.numRays = 500;

        this.dispersable = dispersable;
        this.intensity = 5;

        this.init();

        // Attributes
        this.attributes.push({ name: "numRays", type: AttributeType.Number, min: 0, max: 1000, value: this.numRays });
        this.attributes.push({ name: "dispersable", type: AttributeType.Boolean, value: this.dispersable });
        this.attributes.push({ name: "intensity", type: AttributeType.Number, min: 1, max: 100, step: 0.1, value: this.intensity });
    }

    init() {
        this.lightRays = [];
        for (let i = 0; i < this.numRays; i++) {
            let wavelength = interpolate(i, 0, this.numRays, 400, 700);
            this.lightRays.push(
                new LightRay({
                    origin: Vector.add(this.pos, new Vector(0, 1).rotate(this.rot)),
                    dir: Vector.right().rotate(this.rot),
                    monochromatic: this.dispersable,
                    wavelength: !this.dispersable ? 550 : wavelength,
                    intensity: !this.dispersable ? 1 : 5,
                })
            );
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
            case "numRays":
                this.numRays = value as number;
                this.init();
                break;
            case "dispersable":
                this.dispersable = value as boolean;
                this.init();
                break;
            case "intensity":
                this.intensity = value as number;
                for (let l of this.lightRays) {
                    l.setIntensity(this.intensity);
                }
                break;
        }
    }
}
