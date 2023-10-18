import { Vector, Color, Renderer } from "polyly";

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
    color: Color = new Color(255, 255, 255, 255);
    displayBounds: boolean = false;

    attributes: Attribute[];

    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];

    isDirty: boolean = true;

    static entityData: EntityData;

    constructor(pos: Vector, rot: number, name: string) {
        this.pos = pos;
        this.rot = rot;
        this.name = name;

        this.bounds = new AABB(Vector.zero(), Vector.zero());

        // Attributes
        this.attributes = [
            { name: "color", type: AttributeType.Color, value: this.color },
            { name: "position", type: AttributeType.Vector, value: this.pos.copy() },
            { name: "rotation", type: AttributeType.Number, value: this.rot },
        ];
    }

    setPosition(p: Vector) {
        const deltaPos = Vector.sub(p, this.pos);
        this.pos = p.copy();
        this.updateTransforms(deltaPos, 0);
        this.updateBounds();
        this.isDirty = true;
    }

    setRotation(r: number) {
        const deltaRot = r - this.rot;
        this.rot = r;
        this.updateTransforms(Vector.zero(), deltaRot);
        this.updateBounds();
        this.isDirty = true;
    }

    translate(delta: Vector): void {
        this.pos.add(delta);

        this.updateTransforms(delta, 0);
        this.updateBounds();
        this.isDirty = true;
    }

    rotate(theta: number): void {
        this.rot += theta;
        this.updateTransforms(Vector.zero(), theta);
        this.updateBounds();
        this.isDirty = true;
    }

    updateTransforms(_deltaPos: Vector, _deltaRot: number): void {}
    updateBounds(): void {}

    // abstract addToWorld(_world: World): void;

    updateAttribute(attribute: string, value: string | Vector | number | boolean | Color): void {
        console.log("updating attribute", attribute, value);
        this.isDirty = true;

        switch (attribute) {
            case "position":
                this.setPosition(value as Vector);
                break;
            case "rotation":
                this.setRotation(value as number);
                break;
            case "color":
                const c = value as Color;
                this.color = new Color(c.r, c.g, c.b, Math.ceil(c.a * 255));
                break;
        }
    }

    render(renderer: Renderer, isSelected: boolean): void {
        if (this.displayBounds) this.bounds.render(renderer, new Color(132, 36, 185, 200), 2);
        if (isSelected) this.bounds.render(renderer, new Color(132, 36, 185), 2);
    }
}
