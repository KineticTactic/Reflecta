import { Color, Renderer, Vector } from "polyly";

import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";
import settings from "../core/Settings";
// import Surface from "../primitives/Surface";

export interface ConvexLensOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
    refractiveIndex?: number;
    showMarkings?: boolean;
}

export default class ConvexLens extends Entity {
    focalLength: number = 0;

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
            name: "radius of curvature",
            value: options.radiusOfCurvature || 100,
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
                    (surface as CurvedRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
                });
                this.calculateFocalLength();
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

        this.calculateFocalLength();
    }

    calculateFocalLength() {
        const n = this.attribs.refractiveIndex.value;
        const r1 = this.attribs.radiusOfCurvature.value;
        const r2 = this.attribs.radiusOfCurvature.value;
        const d =
            (this.attribs.radiusOfCurvature.value -
                Math.sqrt(
                    this.attribs.radiusOfCurvature.value ** 2 -
                        (this.attribs.radiusOfCurvature.value * Math.sin(this.attribs.span.value / 2)) ** 2
                )) *
            2;
        console.log(d);

        const power = (n - 1) * (1 / r1 + 1 / r2 - ((n - 1) * d) / (n * r1 * r2));
        console.log(d, power);

        this.focalLength = 1 / power;
        console.log(this.focalLength);
    }

    override render(renderer: Renderer, isSelected: boolean = false): void {
        renderer.beginPath();
        renderer.setColor(new Color(this.color.r, this.color.g, this.color.b, settings.glassOpacity * 255));
        for (const surface of this.surfaces as CurvedRefractiveSurface[]) {
            let angleStart = surface.facing.heading() - this.attribs.span.value / 2;
            let angleEnd = surface.facing.heading() + this.attribs.span.value / 2;

            renderer.arc(surface.center, surface.radius, angleEnd, angleStart);
        }

        renderer.fill();

        // renderer.beginPath();
        // renderer.setColor(new Color(0, 150, 250, 255));
        // renderer.arc(this.pos.copy().add(new Vector(this.focalLength, 0)), 10, 0, Math.PI * 2);
        // renderer.fill();

        super.render(renderer, isSelected, true);
        console.log(settings.markingColor);

        if (!this.attribs.showMarkings.value) return;

        // Principal Axis
        const principalAxisSize = this.attribs.radiusOfCurvature.value * 2;
        renderer.translate(this.pos);
        renderer.rotate(this.rot + Math.PI / 2);
        renderer.setColor(settings.markingColor);
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
