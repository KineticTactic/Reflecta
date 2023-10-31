import { Vector } from "polyly";

import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import PlaneReflectiveSurface from "../primitives/PlaneReflectiveSurface";
import Entity, { EntityOptions } from "../core/Entity";

export interface PlaneMirrorOptions extends EntityOptions {
    size?: number;
}

export default class PlaneMirror extends Entity {
    static override entityData: EntityData = {
        name: "Plane Mirror",
        desc: "A plane mirror.",
        constructorFunc: PlaneMirror,
    };

    constructor(options: PlaneMirrorOptions) {
        super("Plane Mirror", options);

        this.attribs.size = {
            name: "size",
            value: options.size || 200,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };

        this.init();
    }

    override init() {
        this.surfaces = [
            new PlaneReflectiveSurface(
                Vector.add(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)),
                Vector.sub(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot))
            ),
        ];
        this.updateBounds();
    }

    override updateBounds(): void {
        super.updateBounds();
        this.bounds.setMinSize(30);
    }
}
