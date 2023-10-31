import { Vector } from "polyly";

import Entity, { EntityOptions } from "../core/Entity";
import LightRay from "../primitives/LightRay";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import { clamp } from "../lib/math";

export interface PointLightOptions extends EntityOptions {
    numRays?: number;
    wavelength?: number;
    intensity?: number;
    monochromatic?: boolean;
}

export default class PointLight extends Entity {
    static override entityData: EntityData = {
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

        this.attribs.intensity = {
            name: "intensity",
            value: options.intensity || 255,
            type: AttributeType.Number,
            min: 1,
            max: 1000,
            onchange: () => {
                const eachRayIntensity = this.getEachRayIntensity();
                for (const ray of this.lightRays) ray.setIntensity(eachRayIntensity);
            },
        };

        this.attribs.monochromatic = {
            name: "monochromatic",
            value: options.monochromatic !== undefined ? options.monochromatic : false,
            type: AttributeType.Boolean,
            onchange: () => {
                for (const ray of this.lightRays) {
                    const eachRayIntensity = this.getEachRayIntensity();
                    ray.setMonochromatic(this.attribs.monochromatic.value);
                    ray.setIntensity(eachRayIntensity);
                }
                return true; // Return true cause we have to rebuild UI on change
            },
        };

        this.attribs.wavelength = {
            name: "wavelength",
            value: options.wavelength || 550,
            type: AttributeType.Number,
            min: 360,
            max: 830,
            onchange: () => {
                for (const ray of this.lightRays) ray.setWavelength(this.attribs.wavelength.value);
            },
            show: () => this.attribs.monochromatic.value,
        };

        this.init();
    }

    override init() {
        this.lightRays = [];

        const eachRayIntensity = this.getEachRayIntensity();

        for (let i = 0; i < this.attribs.numRays.value; i++) {
            this.lightRays.push(
                new LightRay({
                    origin: this.pos.copy(),
                    dir: new Vector(1, 0).rotate(((Math.PI * 2) / this.attribs.numRays.value) * i),
                    monochromatic: this.attribs.monochromatic.value,
                    intensity: eachRayIntensity,
                    wavelength: this.attribs.wavelength.value,
                })
            );
        }
        this.updateBounds();
    }

    getEachRayIntensity() {
        return clamp(this.attribs.intensity.value / Math.cbrt(this.attribs.numRays.value), 0, 255);
    }
}
