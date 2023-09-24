import Vector from "../lib/Vector";
import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";

export default class GlassSphere extends SurfaceEntity {
    radius: number;
    refractiveIndex: number;

    static entityData: EntityData = {
        name: "Glass Sphere",
        desc: "A glass sphere.",
        constructorFunc: GlassSphere,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Glass Sphere");

        this.radius = 100;
        this.refractiveIndex = 1.666;

        this.init();

        // Attributes
        this.attributes.push({ name: "radius", type: AttributeType.Number, min: 0, max: 1000, value: this.radius });
        this.attributes.push({ name: "refractiveIndex", type: AttributeType.Number, min: 0.1, max: 10, value: this.refractiveIndex });
    }

    init() {
        this.surfaces = [new CurvedRefractiveSurface(this.pos.copy(), this.radius, Vector.right(), Math.PI * 2, this.refractiveIndex)];
        this.updateBounds();
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);
        switch (attribute) {
            case "radius":
                this.radius = value as number;
                this.init();
                break;
            case "refractiveIndex":
                this.refractiveIndex = value as number;
                (this.surfaces[0] as CurvedRefractiveSurface).setRefractiveIndex(this.refractiveIndex);
                break;
        }
    }
}
