import { Renderer, Vector, Color, RGBA } from "polyly";

import { lineRayIntersection } from "../lib/intersections";
import AABB from "../util/AABB";
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

    override translate(delta: Vector): void {
        this.v1.add(delta);
        this.v2.add(delta);
        this.calculateNormal();
    }

    override rotateAboutAxis(theta: number, axis: Vector) {
        this.v1.rotateAboutAxis(theta, axis);
        this.v2.rotateAboutAxis(theta, axis);
        this.calculateNormal();
    }

    override intersects(rayOrigin: Vector, rayDir: Vector): Vector | null {
        return lineRayIntersection(this.v1.copy(), this.v2.copy(), rayOrigin.copy(), rayDir.copy());
    }

    override calculateAABB(): AABB {
        return AABB.fromPoints([this.v1, this.v2]);
    }

    override render(renderer: Renderer, color: Color = RGBA(255, 255, 255, 1)) {
        renderer.beginPath();
        renderer.setColor(color);
        renderer.line(this.v1, this.v2);
        renderer.stroke(Surface.surfaceRenderWidth);
    }

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
}
