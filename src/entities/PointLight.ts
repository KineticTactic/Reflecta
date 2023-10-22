import { Vector } from "polyly";

import Entity, { EntityOptions } from "../core/Entity";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";

export interface PointLightOptions extends EntityOptions {
    numRays?: number;
    wavelength?: number;
    intensity?: number;
}

export default class PointLight extends Entity {
    // monochromatic: boolean = false;

    static entityData: EntityData = {
        name: "Point Light",
        desc: "A point light.",
        constructorFunc: PointLight,
    };

    constructor(options: PointLightOptions) {
        super("Point Light", options);

        this.attribs.numRays = {
            name: "numRays",
            value: options.numRays || 500,
            type: AttributeType.Number,
            min: 0,
            max: 10000,
            step: 1,
            onchange: () => this.init(),
        };
        this.attribs.wavelength = {
            name: "wavelength",
            value: options.wavelength || 500,
            type: AttributeType.Number,
            min: 360,
            max: 830,
            onchange: () => {
                for (const ray of this.lightRays) ray.setWavelength(this.attribs.wavelength.value);
            },
        };
        this.attribs.intensity = {
            name: "intensity",
            value: options.intensity || 20,
            type: AttributeType.Number,
            min: 1,
            max: 255,
            onchange: () => {
                for (const ray of this.lightRays) ray.setIntensity(this.attribs.intensity.value);
            },
        };

        this.init();
    }

    init() {
        this.lightRays = [];
        for (let i = 0; i < this.attribs.numRays.value; i++) {
            this.lightRays.push(
                new LightRay({
                    origin: this.pos,
                    dir: new Vector(1, 0).rotate(((Math.PI * 2) / this.attribs.numRays.value) * i),
                    monochromatic: false,
                    intensity: this.attribs.intensity.value,
                    wavelength: this.attribs.wavelength.value,
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
}
