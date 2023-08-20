import Vector from "../lib/Vector";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import SurfaceEntity from "./SurfaceEntity";

export default class ConcaveLens extends SurfaceEntity {
    span: number;
    radiusOfCurvature: number;
    thickness: number;
    refractiveIndex: number;

    static entityData: EntityData = {
        name: "Concave Lens",
        desc: "A concave lens.",
        constructorFunc: ConcaveLens,
    };

    constructor(pos: Vector) {
        super(pos, "Concave Lens");

        this.span = 0.4;
        this.radiusOfCurvature = 500;
        this.thickness = 4;
        this.refractiveIndex = 1.666;

        this.init();

        // Attributes
        this.attributes.push({ name: "span", type: AttributeType.Number, min: 0, max: 1000 });
        this.attributes.push({ name: "radiusOfCurvature", type: AttributeType.Number, min: 0, max: 1000 });
        this.attributes.push({ name: "thickness", type: AttributeType.Number, min: 0, max: 1000 });
        this.attributes.push({ name: "refractiveIndex", type: AttributeType.Number, min: 0.1, max: 10 });
    }

    init() {
        let centerOffset = this.radiusOfCurvature + this.thickness / 2;
        let h = this.radiusOfCurvature * Math.sin(this.span / 2);
        let x = this.radiusOfCurvature - Math.cos(this.span / 2) * this.radiusOfCurvature + this.thickness / 2;

        this.surfaces = [
            new CurvedRefractiveSurface(
                new Vector(this.pos.x - centerOffset, this.pos.y),
                this.radiusOfCurvature,
                Vector.right(),
                this.span,
                this.refractiveIndex,
                -1
            ),
            new CurvedRefractiveSurface(
                new Vector(this.pos.x + centerOffset, this.pos.y),
                this.radiusOfCurvature,
                Vector.left(),
                this.span,
                this.refractiveIndex,
                -1
            ),
            new PlaneRefractiveSurface(new Vector(this.pos.x - x, this.pos.y + h), new Vector(this.pos.x + x, this.pos.y + h), this.refractiveIndex),
            new PlaneRefractiveSurface(new Vector(this.pos.x + x, this.pos.y - h), new Vector(this.pos.x - x, this.pos.y - h), this.refractiveIndex),
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
            case "thickness":
                this.thickness = value as number;
                this.init();
                break;
            case "refractiveIndex":
                this.refractiveIndex = value as number;
                this.surfaces.forEach((surface) => {
                    (surface as PlaneRefractiveSurface).refractiveIndex = this.refractiveIndex;
                });
                break;
        }
    }
}
