import { Vector, Color, Renderer } from "polyly";

import LightRay from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import { Attribute } from "./Attribute";
import AABB from "../util/Bounds";
import EntityData from "./EntityData";
import { Draggable } from "../util/Draggable";
import World from "./World";

export interface EntityOptions {
    pos?: Vector;
    rot?: number;
    color?: Color;
}

export default abstract class Entity {
    pos: Vector;
    rot: number;
    bounds: AABB;
    name: string;
    color: Color;
    displayBounds: boolean = false;
    lastPos: Vector = new Vector(0, 0);
    lastRot: number = 0;
    draggables: Draggable[] = [];
    // [key: string]: any;

    attribs: {
        // pos: Attribute<Vector>;
        // rot: Attribute<number>;
        // color: Attribute<Color>;
        [key: string]: Attribute<any>;
    };

    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];

    isDirty: boolean = true;

    static entityData: EntityData;

    constructor(name: string, options: EntityOptions = {}) {
        this.name = name;

        this.pos = options.pos || new Vector(0, 0);
        this.rot = options.rot || 0;
        this.color = options.color || new Color(255, 255, 255, 255);

        this.bounds = new AABB(Vector.zero(), Vector.zero());

        this.attribs = {};

        this.lastPos = this.pos.copy();
        this.lastRot = this.rot;

        // this.draggables.push(new Draggable(this.pos, this));
    }

    init() {}

    createDraggables(_world: World) {}

    removeDraggables() {
        this.draggables.forEach((draggable) => draggable.elt.remove());
        this.draggables = [];
    }

    updateDraggables() {
        this.draggables.forEach((draggable) => draggable.updateScreenPos());
    }

    setPosition(p: Vector) {
        const deltaPos = Vector.sub(p, this.pos);
        this.pos = p.copy();
        this.updateTransforms(deltaPos, 0);
        this.updateBounds();
        this.isDirty = true;

        this.lastPos = this.pos.copy();
    }

    updatePositionUI() {
        const delta = Vector.sub(this.pos, this.lastPos);
        this.updateTransforms(delta, 0);
        this.updateBounds();
        this.isDirty = true;

        this.lastPos = this.pos.copy();
    }

    setRotation(r: number) {
        const deltaRot = r - this.rot;
        this.rot = r;
        this.updateTransforms(Vector.zero(), deltaRot);
        this.updateBounds();
        this.isDirty = true;

        this.lastRot = this.rot;
    }

    updateRotationUI() {
        const deltaRot = this.rot - this.lastRot;
        this.updateTransforms(Vector.zero(), deltaRot);
        this.updateBounds();
        this.isDirty = true;

        this.lastRot = this.rot;
    }

    translate(delta: Vector): void {
        this.pos.add(delta);
        this.updateTransforms(delta, 0);
        this.updateBounds();
        this.isDirty = true;

        this.lastPos = this.pos.copy();
    }

    rotate(theta: number): void {
        this.rot += theta;
        this.updateTransforms(Vector.zero(), theta);
        this.updateBounds();
        this.isDirty = true;

        this.lastRot = this.rot;
    }

    updateTransforms(_deltaPos: Vector, _deltaRot: number): void {}
    updateBounds(): void {}

    render(renderer: Renderer, isSelected: boolean): void {
        if (this.displayBounds) this.bounds.render(renderer, new Color(132, 36, 185, 200), 2);
        if (isSelected) this.bounds.render(renderer, new Color(132, 36, 185), 2);
    }
}
