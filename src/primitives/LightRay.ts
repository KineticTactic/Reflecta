import Renderer from "../graphics/Renderer";
import Color, { RGBA } from "../lib/Color";
import Vector from "../lib/Vector";
import Surface from "./Surface";

interface LightRayOptions {
    origin: Vector;
    dir: Vector;
    wavelength?: number;
    intensity?: number;
    monochromatic?: boolean;
    color?: Color;
}

export default class LightRay {
    origin: Vector;
    dir: Vector;
    path: Vector[];
    monochromatic: boolean = true;
    wavelength: number = 500;
    intensity: number = 100;
    color: Color = RGBA(1, 1, 1, 0);

    static maxBounceLimit = 50;
    static lightRayRenderWidth = 3;

    // constructor(origin: Vector, dir: Vector, wavelength = 550, intensity = 100) {
    constructor(options: LightRayOptions) {
        this.origin = options.origin;
        this.dir = options.dir.copy();

        if (options.monochromatic === true) {
            this.monochromatic = true;
            this.setWavelength(options.wavelength || 550);
            this.setIntensity(options.intensity || 100);
        } else {
            this.monochromatic = false;
            this.color = options.color || RGBA(255, 255, 255, options.intensity || 100);
        }
        this.path = [this.origin];
    }

    setWavelength(wavelength: number) {
        this.wavelength = wavelength;

        let c = Color.wavelengthToRGB(this.wavelength);
        this.color = RGBA(c.r, c.g, c.b, this.intensity);
    }

    setIntensity(intensity: number) {
        this.intensity = intensity;
        this.color.a = intensity;
    }

    trace(surfaces: Surface[]) {
        this.path = [this.origin];

        let currentPoint = this.path[0]; // Store the current intersection point (with any of the surfaces)
        let currentDir = this.dir.copy(); // Store the current direction of the ray
        let lastIntersectionIndex = null; // Store the index of the last surface that the ray intersected with

        for (let k = 0; k < LightRay.maxBounceLimit; k++) {
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
                let r = surfaces[closestIntersectionIndex].handle(closestIntersection.copy(), currentDir.copy(), this.wavelength);
                currentDir = r.copy();

                // Update the last intersection
                lastIntersectionIndex = closestIntersectionIndex;
            } else {
                // Since there is no intersection, exit out of the loop
                break;
            }
        }

        // Add the last point to the path
        this.path.push(currentPoint.copy().add(currentDir.mult(6000)));

        return this.path.length - 2;
    }

    render(renderer: Renderer) {
        ///TODO: Use fixed length array for the path
        // ctx.moveTo(this.origin.x, this.origin.y);
        // ctx.beginPath();
        // for (let p of this.path) {
        //     ctx.lineTo(p.x, p.y);
        // }
        // ctx.strokeStyle = this.color;
        // ctx.stroke();
        // console.log(this.path);
        renderer.path(this.path, LightRay.lightRayRenderWidth, this.color);
    }
}
