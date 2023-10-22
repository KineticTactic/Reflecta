import { Vector, Renderer, Color } from "polyly";

import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import SurfaceEntity from "./SurfaceEntity";
import Surface from "../primitives/Surface";
import { EntityOptions } from "../core/Entity";

const EQUILATERAL_PRISM_VERTICES = [new Vector(0, -Math.sqrt(3) / 3), new Vector(0.5, Math.sqrt(3) / 6), new Vector(-0.5, Math.sqrt(3) / 6)];

export interface PrismOptions extends EntityOptions {
    size?: number;
    refractiveIndex?: number;
}

export default class Prism extends SurfaceEntity {
    static entityData: EntityData = {
        name: "Prism",
        desc: "A prism.",
        constructorFunc: Prism,
    };

    constructor(options: PrismOptions) {
        super("Prism", options);

        this.attribs.size = {
            name: "size",
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            value: options.size || 200,
            onchange: () => this.init(),
        };
        this.attribs.refractiveIndex = {
            name: "refractiveIndex",
            type: AttributeType.Number,
            min: 0.1,
            max: 10,
            value: options.refractiveIndex || 1.5,
            onchange: () => {
                this.surfaces.forEach((surface) => {
                    (surface as PlaneRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
                });
            },
        };

        this.init();
    }

    init() {
        let v1 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[0].copy().mult(this.attribs.size.value).rotate(this.rot));
        let v2 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[1].copy().mult(this.attribs.size.value).rotate(this.rot));
        let v3 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[2].copy().mult(this.attribs.size.value).rotate(this.rot));

        this.surfaces = [
            new PlaneRefractiveSurface(v2.copy(), v1.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v3.copy(), v2.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v1.copy(), v3.copy(), this.attribs.refractiveIndex.value),
        ];

        this.updateBounds();
    }

    override render(renderer: Renderer, isSelected: boolean): void {
        renderer.beginPath();
        renderer.vertices(
            [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
            this.color
        );
        renderer.strokePath(Surface.surfaceRenderWidth, { closed: true });

        renderer.beginPath();
        renderer.vertices(
            [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
            new Color(this.color.r, this.color.g, this.color.b, 25)
        );
        renderer.fillPath();

        super.render(renderer, isSelected, false);
    }
}
