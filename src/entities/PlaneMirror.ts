import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import PlaneReflectiveSurface from "../primitives/PlaneReflectiveSurface";

export default class PlaneMirror extends SurfaceEntity {
    size: number;

    static entityData: EntityData = {
        name: "Plane Mirror",
        desc: "A plane mirror.",
        constructorFunc: PlaneMirror,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Plane Mirror");

        this.size = 200;

        this.init();

        // Attributes
        this.attributes.push({ name: "size", type: AttributeType.Number, min: 0, max: 1000, value: this.size });
    }

    init() {
        this.surfaces = [
            new PlaneReflectiveSurface(
                Vector.add(this.pos, new Vector(this.size / 2, 0).rotate(this.rot)),
                Vector.sub(this.pos, new Vector(this.size / 2, 0).rotate(this.rot))
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
