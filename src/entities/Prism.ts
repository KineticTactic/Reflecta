import Vector from "../lib/Vector";
import Entity from "./Entity";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import Draggable from "../util/Draggable";
import { World } from "../World";

const EQUILATERAL_PRISM_VERTICES = [new Vector(0, -Math.sqrt(3) / 3), new Vector(0.5, Math.sqrt(3) / 6), new Vector(-0.5, Math.sqrt(3) / 6)];

export default class Prism extends Entity {
    angle: number;
    size: number;
    refractiveIndex: number;
    surfaces: PlaneRefractiveSurface[];
    posDrag: Draggable;

    constructor(pos: Vector) {
        super(pos);

        this.size = 200;
        this.refractiveIndex = 1.5;
        this.angle = 0;

        this.posDrag = new Draggable(pos);

        let v1 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[0].copy().mult(this.size).rotate(this.angle));
        let v2 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[1].copy().mult(this.size).rotate(this.angle));
        let v3 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[2].copy().mult(this.size).rotate(this.angle));

        this.surfaces = [
            new PlaneRefractiveSurface(v2, v1, this.refractiveIndex),
            new PlaneRefractiveSurface(v3, v2, this.refractiveIndex),
            new PlaneRefractiveSurface(v1, v3, this.refractiveIndex),
        ];

        this.recalculateVertices();
    }

    addToWorld(world: World) {
        for (let s of this.surfaces) {
            world.addSurface(s);
        }
    }

    rotate(theta: number) {
        this.angle += theta;
        this.recalculateVertices();
    }

    recalculateVertices() {
        let v1 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[0].copy().mult(this.size).rotate(this.angle));
        let v2 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[1].copy().mult(this.size).rotate(this.angle));
        let v3 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[2].copy().mult(this.size).rotate(this.angle));
        this.surfaces[0].setVertices(v2, v1);
        this.surfaces[1].setVertices(v3, v2);
        this.surfaces[2].setVertices(v1, v3);
    }

    handleClick(_mousePos: Vector): boolean {
        for (let s of this.surfaces) {
            if (s.intersectsPoint(_mousePos, 10)) {
                console.log("YEE");
                return true;
            }
        }
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        for (let s of this.surfaces) {
            s.render(ctx);
        }

        // this.posDrag.render(ctx);
    }
}
