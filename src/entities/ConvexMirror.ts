import { Renderer, Vec, Vector } from "polyly";

import CurvedReflectiveSurface, { CurvedReflectiveSurfaceType } from "../primitives/CurvedReflectiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";
import settings from "../core/Settings";

export interface ConvexMirrorOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
    showMarkings?: boolean;
}

export default class ConvexMirror extends Entity {
    static override entityData: EntityData = {
        name: "Convex Mirror",
        desc: "A convex mirror.",
        constructorFunc: ConvexMirror,
    };

    constructor(options: ConvexMirrorOptions) {
        super("Convex Mirror", options);

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

        this.attribs.doubleSided = {
            name: "double sided",
            value: false,
            type: AttributeType.Boolean,
            onchange: () => {
                (this.surfaces[0] as CurvedReflectiveSurface).surfaceType = this.attribs.doubleSided.value
                    ? CurvedReflectiveSurfaceType.DOUBLE_SIDED
                    : CurvedReflectiveSurfaceType.CONVEX;
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
            new CurvedReflectiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.attribs.radiusOfCurvature.value,
                Vector.right(),
                this.attribs.span.value,
                CurvedReflectiveSurfaceType.CONVEX
            ),
        ];
        this.rotate(this.rot);
        this.updateBounds();
    }

    override render(renderer: Renderer, isSelected: boolean, drawSurfaces?: boolean): void {
        let l = this.attribs.radiusOfCurvature.value * Math.sin(this.attribs.span.value / 2);
        let centerOffset = Math.sqrt(this.attribs.radiusOfCurvature.value ** 2 - l ** 2);
        let centerOffsetVector = new Vector(centerOffset, 0).rotate(this.rot);
        if (!this.attribs.doubleSided.value) {
            renderer.translate(Vector.sub(this.pos, centerOffsetVector));
            renderer.rotate(this.rot);
            renderer.beginPath();
            renderer.setColor(this.color);
            for (let theta = -this.attribs.span.value / 2; theta <= this.attribs.span.value / 2; theta += 0.1) {
                let start = Vec(this.attribs.radiusOfCurvature.value, 0).rotate(theta);
                let end = Vec(10, 0)
                    .rotate(theta + Math.PI / 4 + Math.PI / 2)
                    .add(start);
                renderer.vertex(start);
                renderer.vertex(end);
                renderer.splitPath();
            }
            renderer.stroke(settings.surfaceRenderWidth);
            renderer.transform.resetTransforms();
        }

        super.render(renderer, isSelected, drawSurfaces);

        if (!this.attribs.showMarkings.value) return;

        const focalLength = this.attribs.radiusOfCurvature.value / 2;
        const principalAxisSize = Math.max(this.attribs.radiusOfCurvature.value * 2, focalLength);
        renderer.transform.translate(this.pos);
        renderer.transform.rotate(this.rot);
        renderer.beginPath();
        renderer.setColor(settings.markingColor);
        renderer.vertex(new Vector(-principalAxisSize, 0));
        renderer.vertex(new Vector(principalAxisSize, 0));
        renderer.stroke(settings.surfaceRenderWidth, { dashed: true, dashLength: 13 });

        const poleOffset = this.attribs.radiusOfCurvature.value - centerOffset;
        renderer.beginPath();
        renderer.arc(new Vector(-focalLength + poleOffset, 0), 5, 0, Math.PI * 2);
        renderer.fill();
        renderer.beginPath();
        renderer.arc(new Vector(focalLength + poleOffset, 0), 5, 0, Math.PI * 2);
        renderer.fill();
        renderer.transform.resetTransforms();
    }
}
