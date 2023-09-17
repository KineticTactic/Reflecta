import Vector from "../lib/Vector";
import LightRay from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import { Attribute, AttributeType } from "../ui/Attribute";
import AABB from "../util/Bounds";
import EntityData from "./EntityData";

export default abstract class Entity {
    pos: Vector;
    rot: number;
    bounds: AABB;
    name: string;
    color: string = "#ffffff";
    displayBounds: boolean = false;

    attributes: Attribute[];

    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];

    static entityData: EntityData;

    constructor(pos: Vector, name: string) {
        this.pos = pos;
        this.rot = 0;
        this.name = name;

        this.bounds = new AABB(Vector.zero(), Vector.zero());

        // Attributes
        this.attributes = [
            { name: "color", type: AttributeType.Color, value: this.color },
            { name: "displayBounds", type: AttributeType.Boolean, value: this.displayBounds },
            { name: "position", type: AttributeType.Vector, value: this.pos.copy() },
            { name: "rotation", type: AttributeType.Number, value: this.rot },
        ];
    }

    setPosition(p: Vector) {
        const deltaPos = Vector.sub(p, this.pos);
        this.pos = p.copy();
        this.updateTransforms(deltaPos, 0);
        this.updateBounds();
    }

    setRotation(r: number) {
        const deltaRot = r - this.rot;
        this.rot = r;
        this.updateTransforms(Vector.zero(), deltaRot);
        this.updateBounds();
    }

    translate(delta: Vector): void {
        this.pos.add(delta);
        console.log(delta);

        this.updateTransforms(delta, 0);
        this.updateBounds();
    }

    rotate(theta: number): void {
        this.rot += theta;
        this.updateTransforms(Vector.zero(), theta);
        this.updateBounds();
    }

    updateTransforms(_deltaPos: Vector, _deltaRot: number): void {}
    updateBounds(): void {}

    // abstract addToWorld(_world: World): void;

    updateAttribute(attribute: string, value: string | Vector | number | boolean): void {
        console.log("updating attribute", attribute, value);

        switch (attribute) {
            case "position":
                this.setPosition(value as Vector);
                break;
            case "rotation":
                this.setRotation(value as number);
                break;
            case "color":
                this.color = value as string;
                break;
            case "displayBounds":
                this.displayBounds = value as boolean;
                break;
        }
    }

    render(ctx: CanvasRenderingContext2D, isSelected: boolean): void {
        if (this.displayBounds) this.bounds.render(ctx);
        if (isSelected) this.bounds.render(ctx, "#8424b9", 2);
    }
}
