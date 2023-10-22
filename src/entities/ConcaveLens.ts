import { Vector, Renderer } from "polyly";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import SurfaceEntity from "./SurfaceEntity";
import { EntityOptions } from "../core/Entity";

export interface ConcaveLensOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
    thickness?: number;
    refractiveIndex?: number;
}

export default class ConcaveLens extends SurfaceEntity {
    static entityData: EntityData = {
        name: "Concave Lens",
        desc: "A concave lens.",
        constructorFunc: ConcaveLens,
    };

    constructor(options: ConcaveLensOptions) {
        super("Concave Lens", options);

        this.attribs.span = {
            name: "span",
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            value: options.span || 0.4,
            onchange: () => this.init(),
        };
        this.attribs.radiusOfCurvature = {
            name: "radiusOfCurvature",
            value: options.radiusOfCurvature || 500,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };
        this.attribs.thickness = {
            name: "thickness",
            value: options.thickness || 4,
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
                    (surface as PlaneRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
                });
            },
        };

        this.init();
    }

    init() {
        let centerOffset = this.attribs.radiusOfCurvature.value + this.attribs.thickness.value / 2;
        let h = this.attribs.radiusOfCurvature.value * Math.sin(this.attribs.span.value / 2);
        let x =
            this.attribs.radiusOfCurvature.value -
            Math.cos(this.attribs.span.value / 2) * this.attribs.radiusOfCurvature.value +
            this.attribs.thickness.value / 2;

        this.surfaces = [
            new CurvedRefractiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.attribs.radiusOfCurvature.value,
                Vector.right(),
                this.attribs.span.value,
                this.attribs.refractiveIndex.value,
                -1
            ),
            new CurvedRefractiveSurface(
                new Vector(this.pos.x + centerOffset, this.pos.y),
                this.attribs.radiusOfCurvature.value,
                Vector.left(),
                this.attribs.span.value,
                this.attribs.refractiveIndex.value,
                -1
            ),
            new PlaneRefractiveSurface(
                new Vector(this.pos.x - x, this.pos.y + h),
                new Vector(this.pos.x + x, this.pos.y + h),
                this.attribs.refractiveIndex.value
            ),
            new PlaneRefractiveSurface(
                new Vector(this.pos.x + x, this.pos.y - h),
                new Vector(this.pos.x - x, this.pos.y - h),
                this.attribs.refractiveIndex.value
            ),
        ];

        this.rotate(this.rot);
        this.updateBounds();
    }

    // override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
    //     super.updateAttribute(attribute, value);
    //     switch (attribute) {
    //         case "span":
    //             this.attribs.span.value = value as number;
    //             this.init();
    //             break;
    //         case "radiusOfCurvature":
    //             this.attribs.radiusOfCurvature.value = value as number;
    //             this.init();
    //             break;
    //         case "thickness":
    //             this.attribs.thickness.value = value as number;
    //             this.init();
    //             break;
    //         case "refractiveIndex":
    //             this.attribs.refractiveIndex.value = value as number;
    //             this.surfaces.forEach((surface) => {
    //                 (surface as PlaneRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
    //             });
    //             break;
    //     }
    // }

    override render(renderer: Renderer, isSelected: boolean): void {
        super.render(renderer, isSelected, true);

        // let angleStart = this.facing.heading() - this.attribs.span.value / 2;
        // let angleEnd = this.facing.heading() + this.attribs.span.value / 2;

        // renderer.path(
        //     [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
        //     2,
        //     RGBA(255, 255, 255, 255),
        //     true
        // );

        // renderer.fillPath(
        //     [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
        //     RGBA(255, 255, 255, 20)
        // );
    }
}
