import { Vector, Renderer, Color } from "polyly";

import Entity, { EntityOptions } from "../core/Entity";
import LightRay from "../primitives/LightRay";
import EntityData from "../core/EntityData";
import { clamp, interpolate } from "../lib/math";
import { AttributeType } from "../core/Attribute";
import Settings from "../core/Settings";

export interface LaserOptions extends EntityOptions {
    numRays?: number;
    polychromatic?: boolean;
    intensity?: number;
    white?: boolean;
    wavelength?: number;
}

export default class Laser extends Entity {
    static override entityData: EntityData = {
        name: "Laser",
        desc: "A laser.",
        constructorFunc: Laser,
        disableColor: true,
    };

    constructor(options: LaserOptions) {
        super("Laser", options);

        const isPolychromatic = options.polychromatic !== undefined ? options.polychromatic : options.white !== undefined ? !options.white : false;

        this.attribs.numRays = {
            name: "numRays",
            value: options.numRays ? options.numRays : isPolychromatic ? 100 : 1,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            step: 1,
            onchange: () => this.init(),
        };

        this.attribs.intensity = {
            name: "intensity",
            value: options.intensity || 255,
            type: AttributeType.Number,
            min: 1,
            max: 1000,
            step: 0.1,
            onchange: () => {
                for (const ray of this.lightRays) ray.setIntensity(this.getEachRayIntensity());
            },
        };

        this.attribs.polychromatic = {
            name: "polychromatic",
            value: isPolychromatic,
            type: AttributeType.Boolean,
            onchange: () => {
                this.attribs.numRays.value = this.attribs.polychromatic.value ? 100 : 1;
                this.init();
                return true; // Return true cause we have to rebuild UI on change
            },
        };

        this.attribs.white = {
            name: "white",
            value: options.white !== undefined ? options.white : false,
            type: AttributeType.Boolean,
            onchange: () => {
                for (const ray of this.lightRays) {
                    ray.setMonochromatic(!this.attribs.white.value);
                }
                return true; // Return true cause we have to rebuild UI on change
            }, // Return true cause we have to rebuild UI on change
            show: () => !this.attribs.polychromatic.value, // If polychromatic is true, then white is hidden
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
            show: () => !this.attribs.polychromatic.value && !this.attribs.white.value,
            // If polychromatic and white both are false, then wavelength is hidden
        };

        this.init();
    }

    override init() {
        this.lightRays = [];
        for (let i = 0; i < this.attribs.numRays.value; i++) {
            let wavelength = interpolate(i, 0, this.attribs.numRays.value, 400, 700);

            const areRaysMonochromatic = this.attribs.polychromatic.value || !this.attribs.white.value;

            this.lightRays.push(
                new LightRay({
                    origin: Vector.add(this.pos, new Vector(0, 1).rotate(this.rot)),
                    dir: Vector.right().rotate(this.rot),
                    monochromatic: areRaysMonochromatic,
                    wavelength: this.attribs.polychromatic.value ? wavelength : 550,
                    intensity: this.getEachRayIntensity(),
                })
            );
        }

        this.updateBounds();
    }

    override updateBounds(): void {
        super.updateBounds();
        this.bounds.expand(10, 10); // Expand bounds for better selection
    }

    override render(renderer: Renderer, isSelected: boolean): void {
        const displaySize = new Vector(30, 8);

        const pos = this.pos;

        renderer.beginPath();
        renderer.vertices(
            [
                Vector.add(pos, new Vector(-displaySize.x, -displaySize.y).rotate(this.lightRays[0].dir.heading())),
                Vector.add(pos, new Vector(-displaySize.x, displaySize.y + Settings.lightRayRenderWidth).rotate(this.lightRays[0].dir.heading())),
                Vector.add(pos, new Vector(displaySize.x, displaySize.y + Settings.lightRayRenderWidth).rotate(this.lightRays[0].dir.heading())),
                Vector.add(pos, new Vector(displaySize.x, -displaySize.y).rotate(this.lightRays[0].dir.heading())),
            ],
            Color.WHITE
        );

        renderer.stroke(3, { closed: true });

        super.render(renderer, isSelected);
    }

    getEachRayIntensity() {
        return clamp(this.attribs.intensity.value / Math.sqrt(this.attribs.numRays.value), 0, 255);
    }
}
