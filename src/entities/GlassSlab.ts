import Vector from "../lib/Vector";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import SurfaceEntity from "./SurfaceEntity";

export default class GlassSlab extends SurfaceEntity {
    size: Vector;
    refractiveIndex: number;

    static entityData: EntityData = {
        name: "Glass Slab",
        desc: "A glass slab.",
        constructorFunc: GlassSlab,
    };

    constructor(pos: Vector) {
        super(pos, "Glass Slab");

        this.size = new Vector(200, 100);
        this.refractiveIndex = 1.5;

        this.init();

        // Attributes
        this.attributes.push({ name: "size", type: AttributeType.Number, min: 0, max: 1000, value: this.size });
        this.attributes.push({ name: "refractiveIndex", type: AttributeType.Number, min: 0.1, max: 10, value: this.refractiveIndex });
    }

    init() {
        const halfSize = this.size.copy().mult(0.5);

        const v1 = Vector.add(this.pos, new Vector(-halfSize.x, -halfSize.y));
        const v2 = Vector.add(this.pos, new Vector(halfSize.x, -halfSize.y));
        const v3 = Vector.add(this.pos, new Vector(halfSize.x, halfSize.y));
        const v4 = Vector.add(this.pos, new Vector(-halfSize.x, halfSize.y));

        this.surfaces = [
            new PlaneRefractiveSurface(v2.copy(), v1.copy(), this.refractiveIndex),
            new PlaneRefractiveSurface(v3.copy(), v2.copy(), this.refractiveIndex),
            new PlaneRefractiveSurface(v4.copy(), v3.copy(), this.refractiveIndex),
            new PlaneRefractiveSurface(v1.copy(), v4.copy(), this.refractiveIndex),
        ];

        this.updateBounds();
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);

        switch (attribute) {
            case "size":
                this.size = value as Vector;
                this.init();
                break;
            case "refractiveIndex":
                this.refractiveIndex = value as number;
                for (const surface of this.surfaces) {
                    (surface as PlaneRefractiveSurface).setRefractiveIndex(this.refractiveIndex);
                }
                break;
        }
    }
}
