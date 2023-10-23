import { Vector } from "polyly";

import Entity, { EntityOptions } from "../core/Entity";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";

export interface LightBeamOptions extends EntityOptions {
    size?: number;
    numRays?: number;
    intensity?: number;
    wavelength?: number;
    monochromatic?: number;
}

export default class LightBeam extends Entity {
    static entityData: EntityData = {
        name: "Light Beam",
        desc: "A light beam.",
        constructorFunc: LightBeam,
    };

    constructor(options: LightBeamOptions) {
        super("Light Beam", options);

        this.attribs.size = {
            name: "size",
            value: options.size || 150,
            type: AttributeType.Number,
            min: 1,
            onchange: () => this.init(),
        };

        this.attribs.numRays = {
            name: "numRays",
            value: options.numRays || 100,
            type: AttributeType.Number,
            min: 1,
            step: 1,
            onchange: () => this.init(),
        };

        this.attribs.intensity = {
            name: "intensity",
            value: options.intensity || 50,
            type: AttributeType.Number,
            min: 1,
            max: 255,
            onchange: () => {
                const eachRayIntensity = this.getEachRayIntensity();
                for (let ray of this.lightRays) {
                    ray.setIntensity(eachRayIntensity);
                }
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

    init() {
        this.lightRays = [];
        for (let i = -this.attribs.size.value / 2; i < this.attribs.size.value / 2; i += this.attribs.size.value / this.attribs.numRays.value) {
            this.lightRays.push(
                new LightRay({
                    origin: Vector.add(this.pos, new Vector(0, i).rotate(this.rot)),
                    dir: Vector.right().rotate(this.rot),
                    monochromatic: false,
                    intensity: this.attribs.intensity.value,
                })
            );
        }
        console.log(this.lightRays.length);
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

    getEachRayIntensity() {
        const density = this.attribs.size.value / this.attribs.numRays.value;
        return this.attribs.intensity.value / density;
    }
}
