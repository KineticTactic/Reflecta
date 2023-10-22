import { Vector, Renderer, Color } from "polyly";

import Entity, { EntityOptions } from "../core/Entity";
import LightRay from "../primitives/LightRay";
import AABB from "../util/Bounds";
import EntityData from "../core/EntityData";
import { interpolate } from "../lib/math";
import { AttributeType } from "../ui/Attribute";
import Settings from "../core/Settings";

export interface LaserOptions extends EntityOptions {
    numRays?: number;
    polychromatic?: boolean;
    intensity?: number;
    white?: boolean;
    wavelength?: number;
}

export default class Laser extends Entity {
    // numRays: number;
    // polychromatic: boolean;
    // intensity: number;
    // white: boolean;
    // wavelength: number;

    static entityData: EntityData = {
        name: "Laser",
        desc: "A laser.",
        constructorFunc: Laser,
    };

    constructor(options: LaserOptions) {
        super("Laser", options);

        // this.polychromatic = options.polychromatic || false;
        // this.intensity = options.intensity || 255;
        // this.white = options.white || false;
        // this.wavelength = options.wavelength || 550;
        // this.numRays = options.numRays || 1;

        // if (!options.polychromatic) {
        //     this.numRays = options.numRays || Laser.NUMRAYS_IF_DISPERSABLE;
        // } else {
        //     this.numRays = options.numRays || Laser.NUMRAYS_IF_NOT_DISPERSABLE;
        // }

        // this.attributes.push({name: "white", type: AttributeType.Boolean, value: true, hide: true})
        this.attribs.numRays = {
            name: "numRays",
            value: options.numRays || 1,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            step: 1,
            onchange: () => this.init,
        };
        this.attribs.intensity = {
            name: "intensity",
            value: options.intensity || 255,
            type: AttributeType.Number,
            min: 1,
            max: 255,
            step: 0.1,
            onchange: () => {
                for (const ray of this.lightRays) ray.setIntensity(this.getEachRayIntensity());
            },
        };
        this.attribs.polychromatic = {
            name: "polychromatic",
            value: options.polychromatic || false,
            type: AttributeType.Boolean,
            onchange: () => {
                this.attribs.numRays.value = this.attribs.polychromatic.value ? 100 : 1;
                this.init();
            },
        };
        this.attribs.white = {
            name: "white",
            value: options.white || true,
            type: AttributeType.Boolean,
        };
        this.attribs.wavelength = {
            name: "wavelength",
            value: options.wavelength || 550,
            type: AttributeType.Number,
            min: 360,
            max: 830,
        };

        this.init();
    }

    init() {
        // if (this.dispersable) {
        //     // this.intensity = Laser.INTENSITY_IF_DISPERSABLE;
        //     this.numRays = Laser.NUMRAYS_IF_DISPERSABLE;
        // } else {
        //     // this.intensity = Laser.INTENSITY_IF_NOT_DISPERSABLE;
        //     this.numRays = Laser.NUMRAYS_IF_NOT_DISPERSABLE;
        // }

        this.lightRays = [];
        for (let i = 0; i < this.attribs.numRays.value; i++) {
            let wavelength = interpolate(i, 0, this.attribs.numRays.value, 400, 700);

            this.lightRays.push(
                new LightRay({
                    origin: Vector.add(this.pos, new Vector(0, 1).rotate(this.rot)),
                    dir: Vector.right().rotate(this.rot),
                    monochromatic: this.attribs.polychromatic.value,
                    wavelength: !this.attribs.polychromatic.value ? 550 : wavelength,
                    intensity: this.getEachRayIntensity(),
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
        this.bounds.setMinSize(40);
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

        renderer.strokePath(3, { closed: true });

        super.render(renderer, isSelected);
    }

    getEachRayIntensity() {
        return this.attribs.intensity.value / Math.sqrt(this.attribs.numRays.value);
    }
}
