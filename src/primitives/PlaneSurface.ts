import Vector from "../lib/Vector";
import { linePointIntersection, lineRayIntersection } from "../lib/intersections";
import Surface from "./Surface";

export default abstract class PlaneSurface extends Surface {
    v1: Vector;
    v2: Vector;
    normal: Vector = new Vector(0, 0);
    canIntersectTwice = false;

    constructor(v1: Vector, v2: Vector) {
        super();
        // Start and end point vectors
        this.v1 = v1;
        this.v2 = v2;

        this.calculateNormal();
    }

    abstract handle(_intersection: Vector, _dir: Vector): Vector;

    // Calculate normal
    calculateNormal() {
        this.normal = Vector.sub(this.v2, this.v1)
            .rotate(Math.PI / 2)
            .normalize();
    }

    setVertices(v1: Vector, v2: Vector) {
        this.v1 = v1.copy();
        this.v2 = v2.copy();
        this.calculateNormal();
    }

    intersects(rayOrigin: Vector, rayDir: Vector): Vector | null {
        let intersection = lineRayIntersection(this.v1.copy(), this.v2.copy(), rayOrigin.copy(), rayDir.copy());
        return intersection;
    }

    intersectsPoint(point: Vector, margin: number = 0.1): boolean {
        return linePointIntersection(this.v1.copy(), this.v2.copy(), point.copy(), margin);
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
    }
}
