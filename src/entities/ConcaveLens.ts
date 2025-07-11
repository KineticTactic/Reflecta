import { Vector, Renderer, Color } from "polyly";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";
import settings from "../core/Settings";

export interface ConcaveLensOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
    thickness?: number;
    refractiveIndex?: number;
    showMarkings?: boolean;
}

export default class ConcaveLens extends Entity {
    focalLength: number = 0;

    static override entityData: EntityData = {
        name: "Concave Lens",
        desc: "A concave lens.",
        constructorFunc: ConcaveLens,
    };

    constructor(options: ConcaveLensOptions) {
        super("Concave Lens", options);

        this.attribs.span = {
            name: "span",
            value: options.span || 0.4,
            type: AttributeType.Number,
            min: 0,
            max: Math.PI * 2,
            onchange: () => this.init(),
        };
        this.attribs.radiusOfCurvature = {
            name: "radius of curvature",
            value: options.radiusOfCurvature || 250,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };
        this.attribs.thickness = {
            name: "thickness",
            value: options.thickness || 2,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };
        this.attribs.refractiveIndex = {
            name: "refractive index",
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

        this.attribs.showMarkings = {
            name: "show markings",
            value: options.showMarkings || false,
            type: AttributeType.Boolean,
        };

        this.init();
    }

    override init() {
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
        this.calculateFocalLength();
    }

    calculateFocalLength() {
        const n = this.attribs.refractiveIndex.value;
        const r1 = this.attribs.radiusOfCurvature.value;
        const r2 = this.attribs.radiusOfCurvature.value;
        const d = this.attribs.thickness.value;

        const power = (n - 1) * (1 / r1 + 1 / r2 - ((n - 1) * d) / (n * r1 * r2));
        console.log(d, power);

        this.focalLength = 1 / power;
        console.log(this.focalLength);
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
        // renderer.transform.translate(new Vector(this.pos.x, this.pos.y));
        // renderer.transform.rotate(this.rot);

        // Since it is a concave shape, we need to fill the lens as a series of rectangles
        const s1 = this.surfaces[0] as CurvedRefractiveSurface;
        const s2 = this.surfaces[1] as CurvedRefractiveSurface;

        const detail = 0.01;

        for (let i = -s1.span / 2; i <= s1.span / 2; i += detail) {
            const p1 = s1.center.copy().add(s1.facing.copy().rotate(i).mult(s1.radius));
            const p2 = s2.center.copy().add(s2.facing.copy().rotate(-i).mult(s2.radius));
            const p3 = s2.center.copy().add(
                s2.facing
                    .copy()
                    .rotate(-i - detail)
                    .mult(s2.radius)
            );
            const p4 = s1.center.copy().add(
                s1.facing
                    .copy()
                    .rotate(i + detail)
                    .mult(s1.radius)
            );

            renderer.beginPath();
            renderer.setColor(new Color(this.color.r, this.color.g, this.color.b, settings.glassOpacity * 255));
            renderer.vertices([p1, p2, p3, p4]);
            renderer.fill();
        }

        super.render(renderer, isSelected, true);

        if (!this.attribs.showMarkings.value) return;

        // Principal Axis
        const principalAxisSize = this.attribs.radiusOfCurvature.value * 2;
        renderer.setColor(settings.markingColor);
        renderer.translate(this.pos);
        renderer.rotate(this.rot + Math.PI / 2);
        renderer.beginPath();
        renderer.vertex(new Vector(0, -principalAxisSize));
        renderer.vertex(new Vector(0, principalAxisSize));
        renderer.splitPath();
        renderer.stroke(settings.surfaceRenderWidth, { dashed: true, dashLength: 13 });

        // Focal Points
        console.log(this.focalLength);
        renderer.beginPath();
        renderer.arc(new Vector(0, this.focalLength), 5, 0, Math.PI * 2);
        renderer.fill();
        renderer.beginPath();
        renderer.arc(new Vector(0, -this.focalLength), 5, 0, Math.PI * 2);
        renderer.fill();
        renderer.resetTransforms();
    }
}
