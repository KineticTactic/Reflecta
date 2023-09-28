import Settings from "../core/Settings";
import Vector from "./Vector";

export interface LightRayResponseInfo {
    dir: Vector;
    newRay: boolean;
    terminate?: boolean;
    transmittance?: number;
    newRayDir?: Vector;
    newRayOrigin?: Vector;
}

export function reflect(incident: Vector, normal: Vector): LightRayResponseInfo {
    return {
        dir: Vector.sub(incident, normal.copy().mult((2 * Vector.dot(incident, normal)) / normal.magSq())),
        newRay: false,
    };
}

export function refract(incident: Vector, normal: Vector, refractiveIndex: number, criticalAngle: number): LightRayResponseInfo {
    // find angle between dir and normal
    let angleBetween = Math.atan2(incident.y, incident.x) - Math.atan2(normal.y, normal.x);

    /// I'll be honest, i don't exactly know why this works
    // Its just that i need to convert 0 to 2PI or -2PI to 0 to -PI to PI
    // I just messed around with these 2 if statements until it looked about right
    if (angleBetween > Math.PI) {
        angleBetween = -(Math.PI * 2 - angleBetween);
    }
    if (angleBetween < -Math.PI) {
        angleBetween = Math.PI * 2 + angleBetween;
    }

    if (angleBetween > Math.PI / 2 || angleBetween < -Math.PI / 2) {
        // The ray is going from RARER TO DENSER
        let angleOfIncidence = Math.PI - angleBetween;
        let angleOfRefraction = Math.asin(Math.sin(angleOfIncidence) / refractiveIndex);
        let angleOfDeviation = angleOfIncidence - angleOfRefraction;

        // Calculate reflectance (Fresnel's equations)
        if (Settings.calculateReflectance) {
            const reflectance =
                ((1 * Math.cos(angleOfIncidence) - refractiveIndex * Math.cos(angleOfRefraction)) /
                    (1 * Math.cos(angleOfIncidence) + refractiveIndex * Math.cos(angleOfRefraction))) **
                2;

            return {
                dir: incident.copy().rotate(angleOfDeviation),
                newRay: true,
                newRayDir: reflect(incident, normal).dir,
                transmittance: 1 - reflectance,
            };
        }

        return {
            dir: incident.copy().rotate(angleOfDeviation),
            newRay: false,
        };
    } else {
        // The ray is going from DENSER TO RARER

        let angleOfIncidence = angleBetween;

        /// There's this weird bug where for a very small window of angle of incidence, the sin of angle of refraction becomes >= 1
        /// Now the light ray could go parallel to the surface, but it looks weird so just reflect it when that happens

        const sinAngleOfRefraction = Math.sin(angleOfIncidence) * refractiveIndex;

        if (angleOfIncidence > criticalAngle || angleOfIncidence < -criticalAngle || sinAngleOfRefraction >= 1 || sinAngleOfRefraction <= -1) {
            // TOTAL INTERNAL REFLECTION!!
            return {
                dir: reflect(incident, normal).dir,
                newRay: false,
            };
        }

        let angleOfRefraction = Math.asin(sinAngleOfRefraction);
        let angleOfDeviation = angleOfIncidence - angleOfRefraction;

        // Calculate reflectance (Fresnel's equations)
        if (Settings.calculateReflectance) {
            const reflectance =
                ((refractiveIndex * Math.cos(angleOfIncidence) - 1 * Math.cos(angleOfRefraction)) /
                    (refractiveIndex * Math.cos(angleOfIncidence) + 1 * Math.cos(angleOfRefraction))) **
                2;

            return {
                dir: incident.copy().rotate(-angleOfDeviation),
                transmittance: 1 - reflectance,
                newRay: true,
                newRayDir: reflect(incident, normal).dir,
            };
        }

        return {
            dir: incident.copy().rotate(-angleOfDeviation),
            newRay: false,
        };
    }
}

export function calculateRefractiveIndexForWavelength(wavelength: number, standardWavelength: number, refractiveIndex: number) {
    /*      mu2 / mu1 = lambda1 / lambda2
        =>  mu2 = (lambda1/lambda2) * mu1

        Since we are dealing with pixels, the dispersion becomes too much, so to reduce it I've introduced a factor

        if (lambda1 / lambda2) is say 1.2, subtracting 1 gives 0.2, multiplying with the factor reduces it to say 0.05,
        then adding 1 to it again gives 1.05, essentially reducing the extent to which the refractive index is altered
    */

    const wavelengthRatio = standardWavelength / wavelength;
    const reducedWavelengthRatio = (wavelengthRatio - 1) * Settings.dispersionFactor + 1;
    const ri = reducedWavelengthRatio * refractiveIndex;
    return ri;
}

export function interpolate(x: number, x1: number, x2: number, y1: number, y2: number): number {
    return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
}

export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}
