import PlaneSurface from "./PlaneSurface";
import Vector, { V } from "../lib/Vector";

export enum LensType {
    Convex = 1,
    Concave,
}

export default class PlaneIdealLensSurface extends PlaneSurface {
    type: LensType;
    focalLength: number;

    constructor(v1: Vector, v2: Vector, type: LensType) {
        super(v1, v2);

        this.type = type;

        this.focalLength = 200;
    }

    handle(intersection: Vector, dir: Vector, _wavelength: number) {
        // Coordinates of end points of lens
        const x1 = this.v1.x;
        const y1 = this.v1.y;
        const x2 = this.v2.x;
        const y2 = this.v2.y;

        // Coordinates of optical center
        const x3 = (x1 + x2) / 2;
        const y3 = (y1 + y2) / 2;

        // Using two points form to find equation of lens
        // x (y1 - y2) + y (x2 - x1) + y (x1 - x2) - x1 (y1 - y2) = 0
        //   ----a----     ----b----   --------------c-----------
        // Can be written as
        // ax + by + c = 0  ------ eqn (i)
        const a = y1 - y2;
        const b = x2 - x1;
        const c = y1 * (x1 - x2) - x1 * (y1 - y2);

        // To find the two focal plane equations which is parallel to the lens
        // Let the lines be ax + by + d1 = 0 and ax + by + d2 = 0
        // Distance between one of these parallel lines and lens is focal length
        // Using | c - d | / sqrt (a^2 + b^2) = f, distance between parallel lines formula,
        // d1 = c + f * sqrt(a * a + b * b)
        // d2 = c - f * sqrt(a * a + b * b)
        const d1 = c + this.focalLength * Math.sqrt(a * a + b * b);
        const d2 = c - this.focalLength * Math.sqrt(a * a + b * b);

        // So the focal planes are
        // ax + by + d1 = 0  ------ eqn (ii)
        // ax + by + d2 = 0  ------ eqn (iii)

        // Now the ray passing through the optical center and parallel to the incident ray
        // that we are dealing with, passes undeviated through the lens and passes through
        // a point on the focal plane.

        // The parametric form of this line passing through the optical center and parallel to
        // the incident ray is
        // (x3 + r cos theta, y3 + r sin theta)
        // Where tan theta is slope of the incident ray

        // Find theta first
        const theta = dir.heading();

        // Putting x = (x3 + r cos theta) and y = (y3 + r sin theta) in eqn (ii) and (iii),
        //  we can solve for the two values of r, r1 and r2
        const r1 = (-a * x3 - b * y3 - d1) / (a * Math.cos(theta) + b * Math.sin(theta));
        const r2 = (-a * x3 - b * y3 - d2) / (a * Math.cos(theta) + b * Math.sin(theta));

        // In a sense, a positive r means we are going "along" the direction of the incident ray
        // and negative means backwards. For convex lens, we only want the forward the intersection, so we
        // choose the positive value of r, and vice versa for concave
        const r = this.type === LensType.Convex ? Math.max(r1, r2) : Math.min(r1, r2);

        // So we can calculate the point where the ray hits the focal plane by advancing
        // from the intersection point on the lens by r units in the direction of the lens
        const focalPlaneIntersection = V(x3, y3).add(dir.copy().normalize().mult(r));

        // By the properties of ideal lens, parallel rays hit the same point on the focal plane,
        // So our incident ray will also hit the same point on the focal plane as the parallel ray
        // passing through the optical center.

        // So we can get the new direction of the incident ray by vector subtraction
        // For concave lens we have to do intersection - focalPlane cause focal plane is behind
        const newDir = (
            this.type === LensType.Convex ? Vector.sub(focalPlaneIntersection, intersection) : Vector.sub(intersection, focalPlaneIntersection)
        ).normalize();

        return {
            dir: newDir,
            newRay: false,
        };
    }
}
