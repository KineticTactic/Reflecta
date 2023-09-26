import Settings from "../core/Settings";
import Renderer from "../graphics/Renderer";
import Color, { RGBA } from "../lib/Color";
import Vector from "../lib/Vector";
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
    color: Color = RGBA(1, 1, 1, 0);

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
            this.setIntensity(options.intensity!);
        }
        this.path = [this.origin];
        this.pathColors = [this.color];
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

    trace(surfaces: Surface[]): LightRayTraceInfo {
        this.path = [this.origin];
        this.pathColors = [this.color];

        let currentPoint = this.path[0]; // Store the current intersection point (with any of the surfaces)
        let currentDir = this.dir.copy(); // Store the current direction of the ray
        let lastIntersectionIndex = null; // Store the index of the last surface that the ray intersected with

        const newRays = [];

        let currentIntensity = this.intensity;

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

                // surface.handle returns the new direction of the ray after it has been reflected or refracted
                let r: LightRayResponseInfo = surfaces[closestIntersectionIndex].handle(closestIntersection.copy(), currentDir.copy(), this.wavelength);
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
                this.pathColors.push(RGBA(this.color.r, this.color.g, this.color.b, currentIntensity));

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
        this.path.push(currentPoint.copy().add(currentDir.mult(6000)));
        this.pathColors.push(RGBA(this.color.r, this.color.g, this.color.b, currentIntensity));

        return {
            lightBounces: this.path.length - 2,
            newRays,
        };
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
        // console.log(this.path);

        // const colors = new Array(this.path.length);
        // console.log(this.intensities);

        // for (let i = 0; i < this.intensities.length; i++) {
        //     colors[i] = RGBA(this.color.r, this.color.g, this.color.b, this.intensities[i]);
        //     // colors[i].a = this.intensities[i];
        // }
        // console.log(colors);

        // console.log(this.intensities.length, this.path.length);
        for (let i = 0; i < this.path.length - 1; i++) {
            renderer.line(this.path[i], this.path[i + 1], Settings.lightRayRenderWidth, this.pathColors[i]);
        }
        // renderer.pathColoured(this.path, LightRay.lightRayRenderWidth, this.pathColors);

        // renderer.path(this.path, LightRay.lightRayRenderWidth, this.color);
    }
}
