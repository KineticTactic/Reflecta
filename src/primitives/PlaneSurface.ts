import Vector from "../lib/Vector";
import { lineRayIntersection } from "../lib/intersections";

export default class PlaneSurface {
    v1: Vector;
    v2: Vector;
    normal: Vector = new Vector(0, 0);

    constructor(v1: Vector, v2: Vector) {
        // Start and end point vectors
        this.v1 = v1;
        this.v2 = v2;

        this.calculateNormal();
    }

    handle(_intersection: Vector, _dir: Vector): Vector {
        throw Error("Not implemented");
    }

    // updateDraggables(mousePos) {
    //     this.draggableV1.update(mousePos, mouseDown);
    //     this.draggableV2.update(mousePos, mouseDown);
    //     this.v1 = this.draggableV1.pos;
    //     this.v2 = this.draggableV2.pos;
    //     this.normal = Vector.sub(this.v2, this.v1)
    //         .rotate(Math.PI / 2)
    //         .normalize();
    // }

    // Calculate normal
    calculateNormal() {
        this.normal = Vector.sub(this.v2, this.v1)
            .rotate(Math.PI / 2)
            .normalize();
    }

    intersects(rayOrigin: Vector, rayDir: Vector) {
        let intersection = lineRayIntersection(this.v1.copy(), this.v2.copy(), rayOrigin.copy(), rayDir.copy());
        return intersection;
    }

    // Render the surface
    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.v1.x, this.v1.y);
        ctx.lineTo(this.v2.x, this.v2.y);
        ctx.stroke();

        // Render normal
        const midPoint = Vector.add(this.v1, this.v2).mult(0.5);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(midPoint.x, midPoint.y);
        ctx.lineTo(midPoint.x + this.normal.x * 50, midPoint.y + this.normal.y * 50);
        ctx.stroke();

        // Render draggable points
        // this.draggableV1.render(ctx);
        // this.draggableV2.render(ctx);
    }
}
