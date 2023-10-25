import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import PlaneBlockerSurface from "../primitives/PlaneBlockerSurface";
import { EntityOptions } from "../core/Entity";

export interface BlockerOptions extends EntityOptions {
    size?: number;
}

export default class Blocker extends SurfaceEntity {
    static entityData: EntityData = {
        name: "Blocker",
        desc: "A blocker surface.",
        constructorFunc: Blocker,
    };

    constructor(options: BlockerOptions) {
        super("Blocker", options);

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
            new PlaneBlockerSurface(
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
