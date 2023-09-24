import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";

export default class PointLight extends Entity {
    numRays: number;
    wavelength: number;
    intensity: number;

    static entityData: EntityData = {
        name: "Point Light",
        desc: "A point light.",
        constructorFunc: PointLight,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Point Light");
        this.numRays = 500;
        this.wavelength = 500;
        this.intensity = 20;

        this.init();

        // Attributes
        this.attributes.push({ name: "numRays", type: AttributeType.Number, min: 0, max: 10000, value: this.numRays });
        this.attributes.push({ name: "wavelength", type: AttributeType.Number, min: 360, max: 830, value: this.wavelength });
        this.attributes.push({ name: "intensity", type: AttributeType.Number, min: 1, max: 255, value: this.intensity });
    }

    init() {
        this.lightRays = [];
        for (let i = 0; i < this.numRays; i++) {
            this.lightRays.push(
                new LightRay({
                    origin: this.pos,
                    dir: new Vector(1, 0).rotate(((Math.PI * 2) / this.numRays) * i),
                    monochromatic: false,
                    intensity: this.intensity,
                })
            );
        }
        this.updateBounds();
    }

    override updateTransforms(_deltaPos: Vector, _deltaRot: number): void {
        for (let l of this.lightRays) l.origin = this.pos;
    }

    override updateBounds(): void {
        this.bounds = AABB.fromPoints([this.pos.copy(), this.pos.copy()]);
        this.bounds.setMinSize(50);
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);

        switch (attribute) {
            case "numRays":
                this.numRays = value as number;
                this.init();
                break;
            case "wavelength":
                this.wavelength = value as number;
                for (const ray of this.lightRays) ray.setWavelength(this.wavelength);
                break;
            case "intensity":
                this.intensity = value as number;
                for (const ray of this.lightRays) ray.setIntensity(this.intensity);
                break;
        }
    }
}
