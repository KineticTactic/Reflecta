import { closestPointOnRay } from "../lib/intersections";
import Vector from "../lib/Vector";
import { point } from "../util/debug";
import Surface from "./Surface";

export default class CurvedSurface extends Surface {
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
        let closestPoint = closestPointOnRay(origin.copy(), dir.copy(), this.center);

        // Squared distance
        let closestPointDistSq = Vector.sub(closestPoint, this.center).magSq();

        // If the closest point is outside the circle, there is no intersection
        if (closestPointDistSq > this.radius * this.radius) {
            return null;
        }

        // This is the distance we have to move along the ray on either side of the closest point to get the intersection points with the circle
        let k = Math.sqrt(this.radius * this.radius - closestPointDistSq);

        if (Vector.sub(origin, closestPoint).magSq() > k * k) {
            // BACKWARD INTERSECTION EXISTS
            // Obviously, it will be closer to the origin than the forward intersection

            let intersection = Vector.sub(closestPoint, dir.copy().normalize().mult(k));

            let centerToIntersectionVector = Vector.sub(intersection, this.center);
            let angleBetweenFacingAndIntersection = Math.abs(Vector.angleBetween(centerToIntersectionVector, this.facing));

            if (angleBetweenFacingAndIntersection <= this.span / 2 && origin.dist(intersection) > 0.01) {
                // The intersection LIES WITHIN THE ARC
                // point(intersection);
                return intersection;
            }
        }
        // ONLY FORWARD Intersection exists

        let intersection = Vector.add(closestPoint, dir.copy().normalize().mult(k));

        let centerToIntersectionVector = Vector.sub(intersection, this.center);
        let angleBetweenFacingAndIntersection = Math.abs(Vector.angleBetween(centerToIntersectionVector, this.facing));

        if (angleBetweenFacingAndIntersection <= this.span / 2 && origin.dist(intersection) > 0.01) {
            // The intersection LIES WITHIN THE ARC
            // point(intersection);

            return intersection;
        }

        // // TWO intersections exist
        // // Because the origin is OUTSIDE the circle

        // let intersection1 = Vector.add(closestPoint, dir.copy().normalize().mult(k));
        // let intersection2 = Vector.sub(closestPoint, dir.copy().normalize().mult(k));

        // let centerToIntersection1Vector = Vector.sub(intersection1, this.center);
        // let centerToIntersection2Vector = Vector.sub(intersection2, this.center);

        // let angleBetweenFacingAndIntersection1 = Math.abs(Vector.angleBetween(centerToIntersection1Vector, this.facing));
        // let angleBetweenFacingAndIntersection2 = Math.abs(Vector.angleBetween(centerToIntersection2Vector, this.facing));

        // if (angleBetweenFacingAndIntersection1 <= this.span / 2) {
        //     // First intersection LIES WITHIN THE ARC
        //     point(intersection1);
        // }

        // if (angleBetweenFacingAndIntersection2 <= this.span / 2) {
        //     // Second intersection LIES WITHIN THE ARC

        //     point(intersection2);
        // }

        return null;
    }

    handle(origin: Vector, dir: Vector): Vector {
        return dir.copy();
    }

    render(ctx: CanvasRenderingContext2D) {
        // this.facing.rotate(0.01);

        let angleStart = this.facing.heading() - this.span / 2;
        let angleEnd = this.facing.heading() + this.span / 2;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.arc(this.center.x, this.center.y, this.radius, angleStart, angleEnd);
        ctx.stroke();
    }
}
