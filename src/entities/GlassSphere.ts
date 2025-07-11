import { Color, Renderer, Vector } from "polyly";

import Entity from "../core/Entity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import { EntityOptions } from "../core/Entity";
import Surface from "../primitives/Surface";
import Settings from "../core/Settings";

export interface GlassSphereOptions extends EntityOptions {
    radius?: number;
    refractiveIndex?: number;
}

export default class GlassSphere extends Entity {
    static override entityData: EntityData = {
        name: "Glass Sphere",
        desc: "A glass sphere.",
        constructorFunc: GlassSphere,
    };

    constructor(options: GlassSphereOptions) {
        super("Glass Sphere", options);

        this.attribs.radius = {
            name: "radius",
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            value: options.radius || 50,
            onchange: () => this.init(),
        };
        this.attribs.refractiveIndex = {
            name: "refractive index",
            type: AttributeType.Number,
            min: 0.1,
            max: 10,
            value: options.refractiveIndex || 1.666,
            onchange: () => {
                this.surfaces.forEach((surface) => {
                    (surface as CurvedRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
                });
            },
        };

        this.init();
    }

    override init() {
        this.surfaces = [
            new CurvedRefractiveSurface(
                this.pos.copy(),
                this.attribs.radius.value,
                Vector.right(),
                Math.PI * 2,
                this.attribs.refractiveIndex.value
            ),
        ];
        this.updateBounds();
    }

    override render(renderer: Renderer, isSelected: boolean) {
        const s = this.surfaces[0] as CurvedRefractiveSurface;
        const angleStart = s.facing.heading() - s.span / 2;
        const angleEnd = s.facing.heading() + s.span / 2;

        renderer.beginPath();
        renderer.setColor(this.color);
        renderer.arc(s.center, s.radius, angleStart, angleEnd, 5);
        renderer.stroke(Surface.surfaceRenderWidth);

        renderer.beginPath();
        renderer.setColor(new Color(this.color.r, this.color.g, this.color.b, Settings.glassOpacity * 255));
        renderer.arc(s.center, s.radius, angleStart, angleEnd);
        renderer.fill();

        super.render(renderer, isSelected, false);
    }
}
