import { Vector, Renderer, Color } from "polyly";

import { wavelengthToRGB } from "../lib/color";
import Settings from "../core/Settings";
import { LightRayResponseInfo } from "../lib/math";
import Surface from "./Surface";

export interface LightRayOptions {
    origin: Vector;
    dir: Vector;
    wavelength?: number;
    intensity?: number;
    monochromatic?: boolean;
    color?: Color;
}

export interface LightRayTraceInfo {
    lightBounces: number;
    newRays: LightRay[];
}

export default class LightRay {
    origin: Vector;
    dir: Vector;
    path: Vector[];
    pathColors: Color[];
    monochromatic: boolean = true;
    wavelength: number = 500;
    intensity: number = 100;
    color: Color = new Color(1, 1, 1, 0);

    constructor(options: LightRayOptions) {
        this.origin = options.origin;
        this.dir = options.dir.copy();

        if (options.monochromatic === true) {
            this.monochromatic = true;
            this.setWavelength(options.wavelength || 550);
            this.setIntensity(options.intensity || 100);
        } else {
            this.monochromatic = false;
            this.color = options.color || new Color(255, 255, 255, options.intensity || 100);
            this.setIntensity(options.intensity!);
        }
        this.path = [this.origin];
        this.pathColors = [this.color];
    }

    setMonochromatic(monochromatic: boolean) {
        this.monochromatic = monochromatic;
        if (monochromatic) {
            this.setWavelength(this.wavelength);
        } else {
            this.setColor(Color.WHITE);
        }
    }

    setColor(color: Color) {
        this.color = color;
    }

    setWavelength(wavelength: number) {
        this.wavelength = wavelength;

        let c = wavelengthToRGB(this.wavelength);
        this.color = new Color(c.r, c.g, c.b, this.intensity);
    }

    setIntensity(intensity: number) {
        this.intensity = intensity;
        this.color.a = intensity;
    }

    // The main tracing function
    trace(surfaces: Surface[]): LightRayTraceInfo {
        this.path = [this.origin];
        this.pathColors = [this.color];

        let currentPoint = this.path[0]; // Store the current intersection point (with any of the surfaces)
        let currentDir = this.dir.copy(); // Store the current direction of the ray
        let lastIntersectionIndex = null; // Store the index of the last surface that the ray intersected with
        let currentIntensity = this.intensity;
        let isTerminated = false;

        const newRays = [];

        for (let k = 0; k < Settings.maxLightBounceLimit; k++) {
            let closestIntersection = null; // Store the closest intersection point after checking all surfaces
            let closestIntersectionIndex = null; // Store the index of the closest surface that the ray intersected with
            let closestIntersectionDistance = Infinity; // Store the distance between the current point and the closest intersection point

            // Loop over all surfaces to check intersections
            for (let i = 0; i < surfaces.length; i++) {
                // If the current surface is the last surface that the ray intersected with, continue to the next surface (to prevent the ray from intersecting with the same surface twice
                // UNLESS, it is a curved surface, in which case it can intersect with the same surface twice
                if (i === lastIntersectionIndex && !surfaces[i].canIntersectTwice) continue;

                // Check if the current surface intersects with the ray
                const intersection = surfaces[i].intersects(currentPoint.copy(), currentDir.copy());

                // If there is no intersection, continue to the next surface
                if (!intersection) continue;

                // Calculate the distance between the current point and the intersection point
                // We can only use the squared magnitude because we don't need the actual distance
                const intersectionDistance = Vector.sub(intersection, currentPoint).magSq();

                // If the intersection point is closer than the closest intersection point, update the closest intersection point
                if (intersectionDistance < closestIntersectionDistance) {
                    closestIntersection = intersection;
                    closestIntersectionDistance = intersectionDistance;
                    closestIntersectionIndex = i;
                }
            }

            // If there is a closest intersection point, update the current point and direction
            if (closestIntersection && closestIntersectionIndex !== null) {
                // Add the closest intersection point to the path

                // surface.handle returns the new direction of the ray after it has been reflected or refracted
                const r: LightRayResponseInfo = surfaces[closestIntersectionIndex].handle(closestIntersection.copy(), currentDir.copy(), this.wavelength);

                currentDir = r.dir.copy();

                // If new rays are to be added (due to reflectance), then this
                if (r.newRay && r.newRayDir && r.newRayOrigin && r.transmittance) {
                    // intensity of reflected ray = (1 - transmittance) * intensity of this ray
                    const newRayIntensity = currentIntensity * (1 - r.transmittance) * Settings.reflectanceFactor;

                    // If the reflected light instensity is too dim, dont add it
                    if (newRayIntensity > Settings.secondaryLightIntensityLimit) {
                        newRays.push(
                            new LightRay({
                                origin: r.newRayOrigin.add(r.newRayDir.copy().mult(0.1)),
                                dir: r.newRayDir,
                                wavelength: this.wavelength,
                                intensity: newRayIntensity,
                                monochromatic: this.monochromatic,
                            })
                        );
                    }

                    currentIntensity *= r.transmittance;
                }

                this.path.push(closestIntersection);
                this.pathColors.push(new Color(this.color.r, this.color.g, this.color.b, currentIntensity));

                if (r.terminate) {
                    isTerminated = true;
                    break;
                }

                // Update the current point and direction
                currentPoint = closestIntersection;

                // Update the last intersection
                lastIntersectionIndex = closestIntersectionIndex;
            } else {
                // Since there is no intersection, exit out of the loop
                break;
            }
        }

        // Add the last point to the path
        if (!isTerminated) {
            this.path.push(currentPoint.copy().add(currentDir.mult(6000)));
            this.pathColors.push(new Color(this.color.r, this.color.g, this.color.b, currentIntensity));
        }

        return {
            lightBounces: this.path.length - (isTerminated ? 1 : 2),
            newRays,
        };
    }

    render(renderer: Renderer) {
        for (let i = 0; i < this.path.length - 1; i++) {
            renderer.line(this.path[i], this.path[i + 1], Settings.lightRayRenderWidth, this.pathColors[i]);
        }
    }
}
