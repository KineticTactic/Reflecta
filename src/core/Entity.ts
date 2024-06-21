import { Vector, Color, Renderer } from "polyly";

import LightRay from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import { Attribute } from "./Attribute";
import AABB from "../util/AABB";
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
    disableColor: boolean = false;
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

    // Updates all the surfaces, light rays and draggables when entity is moved or rotated
    updateTransforms(deltaPos: Vector, deltaRot: number): void {
        // Update all the surfaces
        for (const s of this.surfaces) {
            s.translate(deltaPos);
            s.rotateAboutAxis(deltaRot, this.pos.copy());
        }

        // Update all the light rays
        for (const l of this.lightRays) {
            l.origin.add(deltaPos);
            l.origin.rotateAboutAxis(deltaRot, this.pos);
            l.dir.rotate(deltaRot);
        }

        // Update all the draggables
        for (const draggable of this.draggables) {
            let draggablePos = draggable.pos.copy();
            draggablePos.add(deltaPos);
            draggablePos = draggablePos.rotateAboutAxis(deltaRot, this.pos.copy());
            draggable.setWorldPos(draggablePos);
        }
    }

    updateBounds(): void {
        const aabbs: AABB[] = [];

        // Calculate surface AABBs
        for (const s of this.surfaces) {
            const aabb = s.calculateAABB();
            aabbs.push(aabb);
        }

        // Only considering first and last light ray for now
        if (this.lightRays.length > 0) {
            const min = this.lightRays[0].origin.copy();
            const max = this.lightRays[this.lightRays.length - 1].origin.copy();
            aabbs.push(AABB.fromPoints([min, max]));
        }

        this.bounds = AABB.fromAABBs(aabbs);
        this.bounds.setMinSize(25);
    }

    render(renderer: Renderer, isSelected: boolean, drawSurfaces: boolean = true): void {
        if (this.displayBounds) this.bounds.render(renderer, new Color(132, 36, 185, 200), 2);
        if (isSelected) this.bounds.render(renderer, new Color(132, 36, 185), 2);

        if (drawSurfaces) {
            for (const s of this.surfaces) s.render(renderer, this.color);
        }
    }
}
