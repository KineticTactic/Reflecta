import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
// import Surface from "../primitives/Surface";

export default class ConvexLens extends SurfaceEntity {
    span: number;
    radiusOfCurvature: number;
    refractiveIndex: number;

    static entityData: EntityData = {
        name: "Convex Lens",
        desc: "A convex lens.",
        constructorFunc: ConvexLens,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Convex Lens");

        this.span = 1;
        this.radiusOfCurvature = 200;
        this.refractiveIndex = 1.666;

        this.init();

        // Attributes
        this.attributes.push({ name: "span", type: AttributeType.Number, min: 0, max: 1000, value: this.span });
        this.attributes.push({ name: "radiusOfCurvature", type: AttributeType.Number, min: 0, max: 1000, value: this.radiusOfCurvature });
        this.attributes.push({ name: "refractiveIndex", type: AttributeType.Number, min: 0.1, max: 10, value: this.refractiveIndex });
    }

    init() {
        let l = this.radiusOfCurvature * Math.sin(this.span / 2);
        let centerOffset = Math.sqrt(this.radiusOfCurvature ** 2 - l ** 2);

        this.surfaces = [
            new CurvedRefractiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.radiusOfCurvature,
                Vector.right(),
                this.span,
                this.refractiveIndex
            ),
            new CurvedRefractiveSurface(
                new Vector(this.pos.x + centerOffset, this.pos.y),
                this.radiusOfCurvature,
                Vector.left(),
                this.span,
                this.refractiveIndex
            ),
        ];

        this.rotate(this.rot);

        this.updateBounds();
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);
        switch (attribute) {
            case "span":
                this.span = value as number;
                this.init();
                break;
            case "radiusOfCurvature":
                this.radiusOfCurvature = value as number;
                this.init();
                break;
            case "refractiveIndex":
                this.refractiveIndex = value as number;
                this.surfaces.forEach((surface) => {
                    (surface as CurvedRefractiveSurface).setRefractiveIndex(this.refractiveIndex);
                });
                break;
        }
    }

    // override render(renderer: Renderer, isSelected: boolean = false): void {
    //     renderer.beginPath();

    //     for (const surface of this.surfaces as CurvedRefractiveSurface[]) {
    //         let angleStart = surface.facing.heading() - this.span / 2;
    //         let angleEnd = surface.facing.heading() + this.span / 2;

    //         renderer.arc(surface.center, surface.radius, angleEnd, angleStart, this.color);
    //     }

    //     renderer.strokePath(Surface.surfaceRenderWidth, { closed: true });

    //     super.render(renderer, isSelected, false);
    // }
}
