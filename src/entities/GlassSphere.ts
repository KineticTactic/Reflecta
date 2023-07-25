import Vector from "../lib/Vector";
import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../ui/Attribute";

export default class GlassSphere extends SurfaceEntity {
    radius: number;
    refractiveIndex: number;

    constructor(pos: Vector) {
        super(pos, "Glass Sphere");

        this.radius = 100;
        this.refractiveIndex = 1.666;

        this.init();

        // Attributes
        this.attributes.push({ name: "radius", type: AttributeType.Number, min: 0, max: 1000 });
    }

    init() {
        this.surfaces = [new CurvedRefractiveSurface(this.pos.copy(), this.radius, Vector.right(), Math.PI * 2, this.refractiveIndex)];
        this.updateBounds();
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        switch (attribute) {
            case "radius":
                this.radius = value as number;
                this.init();
                break;
        }
    }
}
