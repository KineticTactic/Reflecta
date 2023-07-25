import { closestPointOnLine } from "../lib/intersections";
import Vector from "../lib/Vector";
import AABB from "../util/Bounds";
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
                // console.log(this.facing);

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

    override translate(delta: Vector): void {
        this.center.add(delta);
    }

    override rotateAboutAxis(theta: number, axis: Vector): void {
        this.center.rotateAboutAxis(theta, axis);
        this.facing.rotate(theta);
    }

    override calculateAABB(): AABB {
        /* THEORY: To calculate bounding points for a circular surface, first calculate the AXIAL points 
            (north, south, east west) on the circle. Then we check if those points actually lie within
            the part of our surface (cause our surface is only a part of a circle). Now along with those points,
            we also include the two end points of the surface, cause they could have min/max values of x
            and y too. With all those points, we can calculate the AABB.
        */

        const axialVectors = [Vector.up(), Vector.down(), Vector.left(), Vector.right()];

        const boundingPoints = [];

        for (const v of axialVectors) {
            // Check if point lies on our surface
            if (Math.abs(Vector.angleBetween(v, this.facing)) < this.span / 2) {
                boundingPoints.push(Vector.add(this.center, Vector.mult(v, this.radius)));
            }
        }

        // Add the two end points of our surface
        boundingPoints.push(Vector.add(this.center, Vector.mult(this.facing.copy().rotate(this.span / 2), this.radius)));
        boundingPoints.push(Vector.add(this.center, Vector.mult(this.facing.copy().rotate(-this.span / 2), this.radius)));

        return AABB.fromPoints(boundingPoints);
    }

    abstract handle(_origin: Vector, dir: Vector): Vector;

    render(ctx: CanvasRenderingContext2D, color: string = "#ffffff") {
        let angleStart = this.facing.heading() - this.span / 2;
        let angleEnd = this.facing.heading() + this.span / 2;

        // angleStart = 0;
        // angleEnd = Math.PI * 2;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.arc(this.center.x, this.center.y, this.radius, angleStart, angleEnd);
        ctx.stroke();
    }
}
