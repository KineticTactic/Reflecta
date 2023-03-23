import Vector from "../lib/Vector";
import Surface from "./Surface";

export default class LightRay {
    origin: Vector;
    dir: Vector;
    path: Vector[];

    constructor(origin: Vector, dir: Vector) {
        this.origin = origin;
        this.dir = dir.copy();

        this.path = [this.origin];
    }

    trace(surfaces: Surface[]) {
        // Reset its path
        this.path = [this.origin];

        let currentPoint = this.path[0]; // Store the current intersection point (with any of the surfaces)
        let currentDir = this.dir.copy(); // Store the current direction of the ray
        let lastIntersectionIndex = null; // Store the index of the last surface that the ray intersected with

        for (let k = 0; k < 500; k++) {
            let closestIntersection = null; // Store the closest intersection point after checking all surfaces
            let closestIntersectionIndex = null; // Store the index of the closest surface that the ray intersected with
            let closestIntersectionDistance = Infinity; // Store the distance between the current point and the closest intersection point

            // Loop over all surfaces to check intersections
            for (let i = 0; i < surfaces.length; i++) {
                // If the current surface is the last surface that the ray intersected with, continue to the next surface (to prevent the ray from intersecting with the same surface twice
                // UNLESS, it is a curved surface, in which case it can intersect with the same surface twice
                if (i === lastIntersectionIndex && !surfaces[i].canIntersectTwice) continue;

                // Check if the current surface intersects with the ray
                let intersection = surfaces[i].intersects(currentPoint.copy(), currentDir.copy());

                // If there is no intersection, continue to the next surface
                if (!intersection) continue;

                // Calculate the distance between the current point and the intersection point
                // We can only use the squared magnitude because we don't need the actual distance
                let intersectionDistance = Vector.sub(intersection, currentPoint).magSq();

                // If the intersection point is closer than the closest intersection point, update the closest intersection point
                if (intersectionDistance < closestIntersectionDistance) {
                    //&& i !== lastIntersectionIndex) {
                    closestIntersection = intersection;
                    closestIntersectionDistance = intersectionDistance;
                    closestIntersectionIndex = i;
                }
            }

            // If there is a closest intersection point, update the current point and direction
            if (closestIntersection && closestIntersectionIndex !== null) {
                // Add the closest intersection point to the path
                this.path.push(closestIntersection);
                // Update the current point and direction
                currentPoint = closestIntersection;

                // surface.handle returns the new direction of the ray after it has been reflected or refracted
                let r = surfaces[closestIntersectionIndex].handle(closestIntersection.copy(), currentDir.copy());
                currentDir = r.copy();

                // Update the last intersection
                lastIntersectionIndex = closestIntersectionIndex;
            } else {
                // if (k > 10) console.log(k);
                break;
            }
        }
        // console.log(this.path);

        // Add the last point to the path
        this.path.push(currentPoint.copy().add(currentDir.mult(3000)));
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this.origin.x, this.origin.y);
        for (let p of this.path) {
            ctx.lineTo(p.x, p.y);
        }
        // ctx.lineTo(this.origin.x + this.dir.x * 100, this.origin.y + this.dir.y * 100);

        // for (let i = 0; i < this.path.length; i++) {
        //     ctx.beginPath();
        //     ctx.arc(this.path[i].x, this.path[i].y, 5, 0, Math.PI * 2);
        //     ctx.fillStyle = "rgba(255, 255, 255, " + (1 - i / this.path.length) + ")";
        //     ctx.fill();
        // }
    }
}
