import { Vector } from "polyly";

import SurfaceEntity from "./SurfaceEntity";
import CurvedReflectiveSurface from "../primitives/CurvedReflectiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";

export default class SphericalMirror extends SurfaceEntity {
    span: number;
    radiusOfCurvature: number;

    static entityData: EntityData = {
        name: "Spherical Mirror",
        desc: "A spherical mirror.",
        constructorFunc: SphericalMirror,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Convex Lens");

        this.span = 1;
        this.radiusOfCurvature = 200;

        this.init();

        // Attributes
        this.attributes.push({ name: "span", type: AttributeType.Number, min: 0, max: 1000, value: this.span });
        this.attributes.push({ name: "radiusOfCurvature", type: AttributeType.Number, min: 0, max: 1000, value: this.radiusOfCurvature });
    }

    init() {
        let l = this.radiusOfCurvature * Math.sin(this.span / 2);

        let centerOffset = Math.sqrt(this.radiusOfCurvature ** 2 - l ** 2);

        this.surfaces = [new CurvedReflectiveSurface(new Vector(this.pos.x - centerOffset, this.pos.y), this.radiusOfCurvature, Vector.right(), this.span)];
        this.updateBounds();
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);
        switch (attribute) {
            case "span":
                this.span = value as number;
                this.init();
                break;
            case "radiusOfCurvature":
                this.radiusOfCurvature = value as number;
                this.init();
                break;
        }
    }
}
