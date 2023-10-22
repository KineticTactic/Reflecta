import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import { EntityOptions } from "../core/Entity";

export interface GlassSphereOptions extends EntityOptions {
    radius?: number;
    refractiveIndex?: number;
}

export default class GlassSphere extends SurfaceEntity {
    static entityData: EntityData = {
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
            value: options.radius || 100,
            onchange: () => this.init(),
        };
        this.attribs.refractiveIndex = {
            name: "refractiveIndex",
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

    init() {
        this.surfaces = [
            new CurvedRefractiveSurface(this.pos.copy(), this.attribs.radius.value, Vector.right(), Math.PI * 2, this.attribs.refractiveIndex.value),
        ];
        this.updateBounds();
    }
}
