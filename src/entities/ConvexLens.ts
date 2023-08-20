import Vector from "../lib/Vector";
import SurfaceEntity from "./SurfaceEntity";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";

export default class ConvexLens extends SurfaceEntity {
    span: number;
    radiusOfCurvature: number;
    refractiveIndex: number;

    static entityData: EntityData = {
        name: "Convex Lens",
        desc: "A convex lens.",
        constructorFunc: ConvexLens,
    };

    constructor(pos: Vector) {
        super(pos, "Convex Lens");

        this.span = 1;
        this.radiusOfCurvature = 200;
        this.refractiveIndex = 1.666;

        this.init();

        // Attributes
        this.attributes.push({ name: "span", type: AttributeType.Number, min: 0, max: 1000 });
        this.attributes.push({ name: "radiusOfCurvature", type: AttributeType.Number, min: 0, max: 1000 });
        this.attributes.push({ name: "refractiveIndex", type: AttributeType.Number, min: 0.1, max: 10 });
    }

    init() {
        let l = this.radiusOfCurvature * Math.sin(this.span / 2);
        let centerOffset = Math.sqrt(this.radiusOfCurvature ** 2 - l ** 2);

        this.surfaces = [
            new CurvedRefractiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.radiusOfCurvature,
                Vector.right(),
                this.span,
                this.refractiveIndex
            ),
            new CurvedRefractiveSurface(
                new Vector(this.pos.x + centerOffset, this.pos.y),
                this.radiusOfCurvature,
                Vector.left(),
                this.span,
                this.refractiveIndex
            ),
        ];

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
            case "refractiveIndex":
                this.refractiveIndex = value as number;
                this.surfaces.forEach((surface) => {
                    (surface as CurvedRefractiveSurface).refractiveIndex = this.refractiveIndex;
                });
                break;
        }
    }
}
