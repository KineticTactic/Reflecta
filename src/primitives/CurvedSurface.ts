import { closestPointOnLine } from "../lib/intersections";
import Vector from "../lib/Vector";
import { point } from "../util/debug";
import Surface from "./Surface";

export default abstract class CurvedSurface extends Surface {
    center: Vector;
    radius: number;
    facing: Vector;
    span: number;
    canIntersectTwice = true;

    constructor(center: Vector, radius: number, facing: Vector, span: number) {
        super();
        this.center = center;
        this.radius = radius;
        this.facing = facing;
        this.span = span;
    }

    intersects(origin: Vector, dir: Vector): Vector | null {
        // Calculate the closest point on the ray to the center of the circle
        let closestPoint = closestPointOnLine(origin.copy(), dir.copy(), this.center);

        // Squared distance
        let closestPointDistSq = Vector.sub(closestPoint, this.center).magSq();

        // If the closest point is outside the circle, there is no intersection
        if (closestPointDistSq > this.radius * this.radius) {
            return null;
        }

        // We now know that the closest point is inside the circle

        // This is the distance we have to move along the ray on either side of the closest point to get the intersection points with the circle
        let k = Math.sqrt(this.radius * this.radius - closestPointDistSq);

        // Check if the origin is outside the circle
        // If it is, then there MAY be 2 intersections, one forward along the ray and another backward
        if (Vector.sub(origin, closestPoint).magSq() > k * k) {
            // Calculate backward intersection
            // If exists, it will be closer to the origin than the forward intersection

            let intersection = Vector.sub(closestPoint, dir.copy().normalize().mult(k));
            if (Math.abs(Vector.angleBetween(Vector.sub(intersection, origin), dir)) > 0.2) {
            } else {
                let centerToIntersectionVector = Vector.sub(intersection, this.center);
                let angleBetweenFacingAndIntersection = Math.abs(Vector.angleBetween(centerToIntersectionVector, this.facing));

                // point(intersection);

                // A buffer of 0.01 is added so that the ray doesn't intersect with the same point twice
                if (angleBetweenFacingAndIntersection <= this.span / 2 && origin.dist(intersection) > 0.01) {
                    // The intersection LIES WITHIN THE ARC
                    // point(intersection);
                    return intersection;
                }
            }
        }

        // Check for forward intersection now

        let intersection = Vector.add(closestPoint, dir.copy().normalize().mult(k));

        if (Math.abs(Vector.angleBetween(Vector.sub(intersection, origin), dir)) > 0.2) {
            // console.log(Vector.angleBetween(Vector.sub(closestPoint, origin), dir));
            // console.log(Math.abs(Vector.angleBetween(Vector.sub(closestPoint, origin), dir)));
        } else {
            let centerToIntersectionVector = Vector.sub(intersection, this.center);
            let angleBetweenFacingAndIntersection = Math.abs(Vector.angleBetween(centerToIntersectionVector, this.facing));

            // console.log(Vector.angleBetween(Vector.sub(closestPoint, origin), dir));

            // point(closestPoint);
            // point(origin);
            // console.log();

            // A buffer of 0.01 is added so that the ray doesn't intersect with the same point twice
            if (angleBetweenFacingAndIntersection <= this.span / 2 && origin.dist(intersection) > 0.01) {
                // point(intersection);
                // console.log(dir);

                // The intersection LIES WITHIN THE ARC
                // console.log(this.center);

                return intersection;
            }
        }

        return null;
    }

    abstract handle(_origin: Vector, dir: Vector): Vector;

    render(ctx: CanvasRenderingContext2D) {
        let angleStart = this.facing.heading() - this.span / 2;
        let angleEnd = this.facing.heading() + this.span / 2;

        // angleStart = 0;
        // angleEnd = Math.PI * 2;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.arc(this.center.x, this.center.y, this.radius, angleStart, angleEnd);
        ctx.stroke();
    }
}
