import Vector from "../lib/Vector";
import PlaneSurface from "./PlaneSurface";

export default class LightRay {
    origin: Vector;
    dir: Vector;
    path: Vector[];

    constructor(origin: Vector, dir: Vector) {
        this.origin = origin;
        this.dir = dir.copy();

        this.path = [this.origin];
    }

    trace(surfaces: PlaneSurface[]) {
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
                // Check if the current surface intersects with the ray
                let intersection = surfaces[i].intersects(currentPoint, currentDir);

                // If there is no intersection, continue to the next surface
                if (!intersection) continue;

                // Calculate the distance between the current point and the intersection point
                // We can only use the squared magnitude because we don't need the actual distance
                let intersectionDistance = Vector.sub(intersection, currentPoint).magSq();

                // If the intersection point is closer than the closest intersection point, update the closest intersection point
                if (intersectionDistance < closestIntersectionDistance && i !== lastIntersectionIndex) {
                    closestIntersection = intersection;
                    closestIntersectionDistance = intersectionDistance;
                    closestIntersectionIndex = i;
                }
            }

            // If there is a closest intersection point, update the current point and direction
            if (closestIntersection && closestIntersectionIndex) {
                // Add the closest intersection point to the path
                this.path.push(closestIntersection);
                // Update the current point and direction
                currentPoint = closestIntersection;

                // surface.handle returns the new direction of the ray after it has been reflected or refracted
                let r = surfaces[closestIntersectionIndex].handle(closestIntersection, currentDir);
                currentDir = r.copy();

                // Update the last intersection
                lastIntersectionIndex = closestIntersectionIndex;
            } else {
                // console.log(k);
                break;
            }
        }
        // Add the last point to the path
        this.path.push(currentPoint.copy().add(currentDir.mult(2000)));
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.origin.x, this.origin.y);
        for (let p of this.path) {
            ctx.lineTo(p.x, p.y);
        }
        // ctx.lineTo(this.origin.x + this.dir.x * 100, this.origin.y + this.dir.y * 100);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";

        ctx.stroke();

        // for (let i = 0; i < this.path.length; i++) {
        //     ctx.beginPath();
        //     ctx.arc(this.path[i].x, this.path[i].y, 2, 0, Math.PI * 2);
        //     ctx.fillStyle = "rgba(255, 255, 255, " + (1 - i / this.path.length) + ")";
        //     ctx.fill();
        // }
    }
}
