import Vector from "../lib/Vector";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import SurfaceEntity from "./SurfaceEntity";
import Renderer from "../graphics/Renderer";
import { RGBA } from "../lib/Color";
import Surface from "../primitives/Surface";

const EQUILATERAL_PRISM_VERTICES = [new Vector(0, -Math.sqrt(3) / 3), new Vector(0.5, Math.sqrt(3) / 6), new Vector(-0.5, Math.sqrt(3) / 6)];

export default class Prism extends SurfaceEntity {
    size: number;
    refractiveIndex: number;

    static entityData: EntityData = {
        name: "Prism",
        desc: "A prism.",
        constructorFunc: Prism,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Prism");

        this.size = 200;
        this.refractiveIndex = 1.5;

        this.init();

        // Attributes
        this.attributes.push({ name: "size", type: AttributeType.Number, min: 0, max: 1000, value: this.size });
        this.attributes.push({ name: "refractiveIndex", type: AttributeType.Number, min: 0.1, max: 10, value: this.refractiveIndex });
    }

    init() {
        let v1 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[0].copy().mult(this.size).rotate(this.rot));
        let v2 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[1].copy().mult(this.size).rotate(this.rot));
        let v3 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[2].copy().mult(this.size).rotate(this.rot));

        this.surfaces = [
            new PlaneRefractiveSurface(v2.copy(), v1.copy(), this.refractiveIndex),
            new PlaneRefractiveSurface(v3.copy(), v2.copy(), this.refractiveIndex),
            new PlaneRefractiveSurface(v1.copy(), v3.copy(), this.refractiveIndex),
        ];

        this.updateBounds();
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);

        switch (attribute) {
            case "size":
                this.size = value as number;
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

    override render(renderer: Renderer, isSelected: boolean): void {
        super.render(renderer, isSelected, false);

        renderer.path(
            [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
            Surface.surfaceRenderWidth,
            this.color,
            true
        );

        renderer.fillPath(
            [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
            RGBA(this.color.r, this.color.b, this.color.g, 20)
        );
    }
}
