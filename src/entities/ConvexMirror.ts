import { Vector } from "polyly";

import CurvedReflectiveSurface, { CurvedReflectiveSurfaceType } from "../primitives/CurvedReflectiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";

export interface ConvexMirrorOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
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
            name: "radiusOfCurvature",
            value: options.radiusOfCurvature || 100,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
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
}
