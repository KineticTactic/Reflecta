import { Vector, Renderer, Color } from "polyly";

import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import SurfaceEntity from "./SurfaceEntity";
import Surface from "../primitives/Surface";
import { EntityOptions } from "../core/Entity";

export interface GlassSlabOptions extends EntityOptions {
    size?: Vector;
    refractiveIndex?: number;
}

export default class GlassSlab extends SurfaceEntity {
    static entityData: EntityData = {
        name: "Glass Slab",
        desc: "A glass slab.",
        constructorFunc: GlassSlab,
    };

    constructor(options: GlassSlabOptions) {
        super("Glass Slab", options);

        this.attribs.size = {
            name: "size",
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            value: options.size || new Vector(200, 100),
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
        const halfSize = this.attribs.size.value.copy().mult(0.5);

        const v1 = Vector.add(this.pos, new Vector(-halfSize.x, -halfSize.y));
        const v2 = Vector.add(this.pos, new Vector(halfSize.x, -halfSize.y));
        const v3 = Vector.add(this.pos, new Vector(halfSize.x, halfSize.y));
        const v4 = Vector.add(this.pos, new Vector(-halfSize.x, halfSize.y));

        this.surfaces = [
            new PlaneRefractiveSurface(v2.copy(), v1.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v3.copy(), v2.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v4.copy(), v3.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v1.copy(), v4.copy(), this.attribs.refractiveIndex.value),
        ];

        this.updateBounds();
    }

    override render(renderer: Renderer, isSelected: boolean): void {
        super.render(renderer, isSelected, false);

        renderer.beginPath();
        ///TODO: CHANGE TO RECT
        ///TODO: Probably stop taking colour in drawing functions.

        renderer.vertices(
            [
                (this.surfaces[0] as PlaneRefractiveSurface).v1,
                (this.surfaces[0] as PlaneRefractiveSurface).v2,
                (this.surfaces[3] as PlaneRefractiveSurface).v2,
                (this.surfaces[1] as PlaneRefractiveSurface).v1,
            ],
            this.color
        );
        renderer.strokePath(Surface.surfaceRenderWidth, { closed: true });

        renderer.beginPath();
        renderer.vertices(
            [
                (this.surfaces[0] as PlaneRefractiveSurface).v1,
                (this.surfaces[0] as PlaneRefractiveSurface).v2,
                (this.surfaces[3] as PlaneRefractiveSurface).v2,
                (this.surfaces[1] as PlaneRefractiveSurface).v1,
            ],
            new Color(this.color.r, this.color.g, this.color.b, 25)
        );
        renderer.fillPath();
    }
}
