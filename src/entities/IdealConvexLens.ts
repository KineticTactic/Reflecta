import { Renderer, Vector } from "polyly";

import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import PlaneIdealLensSurface, { LensType } from "../primitives/PlaneIdealLensSurface";
import Entity, { EntityOptions } from "../core/Entity";
import settings from "../core/Settings";

export interface IdealConvexLensOptions extends EntityOptions {
    size?: number;
    focalLength?: number;
    showMarkings?: boolean;
}

export default class IdealConvexLens extends Entity {
    static override entityData: EntityData = {
        name: "Ideal Convex Lens",
        desc: "An ideal convex lens.",
        constructorFunc: IdealConvexLens,
    };

    constructor(options: IdealConvexLensOptions) {
        super("Ideal Convex Lens", options);

        this.attribs.size = {
            name: "size",
            value: options.size || 100,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };
        this.attribs.focalLength = {
            name: "focal length",
            value: options.focalLength || 100,
            type: AttributeType.Number,
            min: 0.01,
            onchange: () => this.init(),
        };
        this.attribs.showMarkings = {
            name: "show markings",
            value: options.showMarkings || false,
            type: AttributeType.Boolean,
        };

        this.init();
    }

    override init() {
        this.surfaces = [
            new PlaneIdealLensSurface(
                Vector.add(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)),
                Vector.sub(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)),
                LensType.Convex,
                this.attribs.focalLength.value
            ),
        ];
        this.updateBounds();
    }

    override updateBounds(): void {
        super.updateBounds();
        this.bounds.setMinSize(15);
    }

    override render(renderer: Renderer, isSelected: boolean, drawSurfaces?: boolean): void {
        super.render(renderer, isSelected, drawSurfaces);

        // These are the tiny markers on both ends of the lens that symbolically represent that it is a convex lens
        const markerSize = this.attribs.size.value / 20;
        renderer.transform.translate(Vector.sub(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)));
        renderer.transform.rotate(this.rot);
        renderer.beginPath();
        renderer.vertex(new Vector(markerSize, -markerSize), this.color);
        renderer.vertex(new Vector(0, 0), this.color);
        renderer.vertex(new Vector(markerSize, markerSize), this.color);
        renderer.splitPath();
        renderer.stroke(settings.surfaceRenderWidth);
        renderer.transform.resetTransforms();

        renderer.transform.translate(Vector.add(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)));
        renderer.transform.rotate(this.rot);
        renderer.beginPath();
        renderer.vertex(new Vector(-markerSize, -markerSize), this.color);
        renderer.vertex(new Vector(0, 0), this.color);
        renderer.vertex(new Vector(-markerSize, markerSize), this.color);
        renderer.splitPath();
        renderer.stroke(settings.surfaceRenderWidth);
        renderer.transform.resetTransforms();

        if (!this.attribs.showMarkings.value) return;

        // Principal Axis
        const principalAxisSize = Math.max(this.attribs.size.value * 2, this.attribs.focalLength.value);
        renderer.transform.translate(this.pos);
        renderer.transform.rotate(this.rot);
        renderer.beginPath();
        renderer.setColor(settings.markingColor);
        renderer.vertex(new Vector(0, -principalAxisSize));
        renderer.vertex(new Vector(0, principalAxisSize));
        renderer.stroke(settings.surfaceRenderWidth, { dashed: true, dashLength: 13 });

        // Focal Points
        renderer.beginPath();
        renderer.arc(new Vector(0, this.attribs.focalLength.value), 5, 0, Math.PI * 2);
        renderer.fill();
        ///TODO: Why does combining the two arcs not work?
        renderer.beginPath();
        renderer.arc(new Vector(0, -this.attribs.focalLength.value), 5, 0, Math.PI * 2);
        renderer.fill();
        renderer.transform.resetTransforms();
    }
}
