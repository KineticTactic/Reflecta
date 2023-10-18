import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import PlaneIdealLensSurface, { LensType } from "../primitives/PlaneIdealLensSurface";

export default class IdealConvexLens extends SurfaceEntity {
    size: number;

    static entityData: EntityData = {
        name: "Ideal Convex Lens",
        desc: "An ideal convex lens.",
        constructorFunc: IdealConvexLens,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Ideal Convex Lens");

        this.size = 200;

        this.init();

        // Attributes
        this.attributes.push({ name: "size", type: AttributeType.Number, min: 0, max: 1000, value: this.size });
    }

    init() {
        this.surfaces = [
            new PlaneIdealLensSurface(
                Vector.add(this.pos, new Vector(this.size / 2, 0).rotate(this.rot)),
                Vector.sub(this.pos, new Vector(this.size / 2, 0).rotate(this.rot)),
                LensType.Convex
            ),
        ];
        this.updateBounds();
    }

    override updateBounds(): void {
        super.updateBounds();
        this.bounds.setMinSize(30);
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);
        switch (attribute) {
            case "size":
                this.size = value as number;
                this.init();
                break;
        }
    }
}
