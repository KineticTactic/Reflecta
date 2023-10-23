import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import CurvedReflectiveSurface from "../primitives/CurvedReflectiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import { EntityOptions } from "../core/Entity";

export interface SphericalMirrorOptions extends EntityOptions {
    span?: number;
    radiusOfCurvature?: number;
}

export default class SphericalMirror extends SurfaceEntity {
    static entityData: EntityData = {
        name: "Spherical Mirror",
        desc: "A spherical mirror.",
        constructorFunc: SphericalMirror,
    };

    constructor(options: SphericalMirrorOptions) {
        super("Spherical Mirror", options);

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

        this.init();
    }

    init() {
        let l = this.attribs.radiusOfCurvature.value * Math.sin(this.attribs.span.value / 2);

        let centerOffset = Math.sqrt(this.attribs.radiusOfCurvature.value ** 2 - l ** 2);

        this.surfaces = [
            new CurvedReflectiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.attribs.radiusOfCurvature.value,
                Vector.right(),
                this.attribs.span.value
            ),
        ];
        this.updateBounds();
    }
}
