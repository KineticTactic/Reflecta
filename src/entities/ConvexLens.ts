import Vector from "../lib/Vector";
import Entity from "./Entity";
import Draggable from "../util/Draggable";
import { World } from "../World";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";

export default class ConvexLens extends Entity {
    angle: number;
    span: number;
    radiusOfCurvature: number;
    refractiveIndex: number;
    surfaces: CurvedRefractiveSurface[];
    posDrag: Draggable;

    constructor(pos: Vector) {
        super(pos);

        this.span = 0.5;
        this.radiusOfCurvature = 400;
        this.refractiveIndex = 1.666;
        this.angle = 0;

        let l = this.radiusOfCurvature * Math.sin(this.span / 2);
        let centerOffset = Math.sqrt(this.radiusOfCurvature ** 2 - l ** 2);

        this.posDrag = new Draggable(pos);

        this.surfaces = [
            new CurvedRefractiveSurface(new Vector(pos.x - centerOffset, pos.y), this.radiusOfCurvature, new Vector(1, 0), this.span, this.refractiveIndex),
            new CurvedRefractiveSurface(new Vector(pos.x + centerOffset, pos.y), this.radiusOfCurvature, new Vector(-1, 0), this.span, this.refractiveIndex),
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

    recalculateVertices() {}

    handleClick(_mousePos: Vector): boolean {
        // for (let s of this.surfaces) {
        //     if (s.intersectsPoint(_mousePos, 10)) {
        //         console.log("YEE");
        //         return true;
        //     }
        // }
        return false;
    }

    render(ctx: CanvasRenderingContext2D) {
        for (let s of this.surfaces) {
            s.render(ctx);
        }

        // this.posDrag.render(ctx);
    }
}
