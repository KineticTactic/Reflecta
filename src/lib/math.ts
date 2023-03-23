import Vector from "./Vector";

export function reflect(incident: Vector, normal: Vector): Vector {
    return Vector.sub(incident, normal.copy().mult((2 * Vector.dot(incident, normal)) / normal.magSq()));
}

export function refract(incident: Vector, normal: Vector, refractiveIndex: number, criticalAngle: number): Vector {
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

        // console.log(angleBetween);
        return incident.copy().rotate(angleOfDeviation);
    } else {
        // The ray is going from DENSER TO RARER

        let angleOfIncidence = angleBetween;
        if (angleOfIncidence > criticalAngle || angleOfIncidence < -criticalAngle) {
            // TOTAL INTERNAL REFLECTION!!
            return reflect(incident, normal);
        }
        let angleOfRefraction = Math.asin(Math.sin(angleOfIncidence) * refractiveIndex);
        let angleOfDeviation = angleOfIncidence - angleOfRefraction;

        return incident.copy().rotate(-angleOfDeviation);
    }
}
