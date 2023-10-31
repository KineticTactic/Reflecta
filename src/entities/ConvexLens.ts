import { Vector } from "polyly";

import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";
// import Surface from "../primitives/Surface";

export interface ConvexLensOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
    refractiveIndex?: number;
}

export default class ConvexLens extends Entity {
    static override entityData: EntityData = {
        name: "Convex Lens",
        desc: "A convex lens.",
        constructorFunc: ConvexLens,
    };

    constructor(options: ConvexLensOptions) {
        super("Convex Lens", options);

        this.attribs.span = {
            name: "span",
            value: options.span || 1,
            type: AttributeType.Number,
            min: 0,
            max: Math.PI * 2,
            onchange: () => this.init(),
        };
        this.attribs.radiusOfCurvature = {
            name: "radiusOfCurvature",
            value: options.radiusOfCurvature || 200,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };
        this.attribs.refractiveIndex = {
            name: "refractiveIndex",
            value: options.refractiveIndex || 1.666,
            type: AttributeType.Number,
            min: 0.1,
            max: 10,
            onchange: () => {
                this.surfaces.forEach((surface) => {
                    (surface as CurvedRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
                });
            },
        };

        this.init();
    }

    override init() {
        let l = this.attribs.radiusOfCurvature.value * Math.sin(this.attribs.span.value / 2);
        let centerOffset = Math.sqrt(this.attribs.radiusOfCurvature.value ** 2 - l ** 2);

        this.surfaces = [
            new CurvedRefractiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.attribs.radiusOfCurvature.value,
                Vector.right(),
                this.attribs.span.value,
                this.attribs.refractiveIndex.value
            ),
            new CurvedRefractiveSurface(
                new Vector(this.pos.x + centerOffset, this.pos.y),
                this.attribs.radiusOfCurvature.value,
                Vector.left(),
                this.attribs.span.value,
                this.attribs.refractiveIndex.value
            ),
        ];

        this.rotate(this.rot);

        this.updateBounds();
    }

    // override render(renderer: Renderer, isSelected: boolean = false): void {
    //     renderer.beginPath();

    //     for (const surface of this.surfaces as CurvedRefractiveSurface[]) {
    //         let angleStart = surface.facing.heading() - this.attribs.span.value / 2;
    //         let angleEnd = surface.facing.heading() + this.attribs.span.value / 2;

    //         renderer.arc(surface.center, surface.radius, angleEnd, angleStart, this.color);
    //     }

    //     renderer.strokePath(Surface.surfaceRenderWidth, { closed: true });

    //     super.render(renderer, isSelected, false);
    // }
}
