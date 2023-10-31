import { Vector } from "polyly";

import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import PlaneIdealLensSurface, { LensType } from "../primitives/PlaneIdealLensSurface";
import Entity, { EntityOptions } from "../core/Entity";

export interface IdealConvexLensOptions extends EntityOptions {
    size?: number;
    focalLength?: number;
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
            value: options.size || 200,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };
        this.attribs.focalLength = {
            name: "focalLength",
            value: options.focalLength || 200,
            type: AttributeType.Number,
            min: 0.01,
            onchange: () => this.init(),
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
        this.bounds.setMinSize(30);
    }
}
