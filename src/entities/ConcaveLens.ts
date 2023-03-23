import Vector from "../lib/Vector";
import Entity from "./Entity";
import Draggable from "../util/Draggable";
import { World } from "../World";
import CurvedRefractiveSurface from "../primitives/CurvedRefractiveSurface";
import Surface from "../primitives/Surface";
import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";

export default class ConcaveLens extends Entity {
    angle: number;
    span: number;
    radiusOfCurvature: number;
    thickness: number;
    refractiveIndex: number;
    surfaces: Surface[];
    posDrag: Draggable;

    constructor(pos: Vector) {
        super(pos);

        this.span = 0.5;
        this.radiusOfCurvature = 400;
        this.thickness = 10;
        this.refractiveIndex = 1.666;
        this.angle = 0;

        // let l = this.radiusOfCurvature * Math.sin(this.span / 2);
        let centerOffset = this.radiusOfCurvature + this.thickness / 2;
        let h = this.radiusOfCurvature * Math.sin(this.span / 2);
        let x = this.radiusOfCurvature - Math.cos(this.span / 2) * this.radiusOfCurvature + this.thickness / 2;

        this.posDrag = new Draggable(pos);

        this.surfaces = [
            new CurvedRefractiveSurface(new Vector(pos.x - centerOffset, pos.y), this.radiusOfCurvature, new Vector(1, 0), this.span, this.refractiveIndex, -1),
            new CurvedRefractiveSurface(
                new Vector(pos.x + centerOffset, pos.y),
                this.radiusOfCurvature,
                new Vector(-1, 0),
                this.span,
                this.refractiveIndex,
                -1
            ),
            new PlaneRefractiveSurface(new Vector(pos.x - x, pos.y + h), new Vector(pos.x + x, pos.y + h), this.refractiveIndex),
            new PlaneRefractiveSurface(new Vector(pos.x + x, pos.y - h), new Vector(pos.x - x, pos.y - h), this.refractiveIndex),
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
