import { Vector } from "polyly";

// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282

function lineRayIntersection(v1: Vector, v2: Vector, rayOrigin: Vector, rayDir: Vector) {
    let s = Vector.sub(v2, v1);
    let qMinusP = Vector.sub(v1, rayOrigin);
    let rCrossS = Vector.cross(rayDir, s);
    let t = Vector.cross(qMinusP, s) / rCrossS;
    let u = Vector.cross(qMinusP, rayDir) / rCrossS;

    if (t >= 0 && u >= 0 && u <= 1) {
        let i = Vector.add(rayOrigin, rayDir.mult(t));
        return i;
    }
    return null;
}

function linePointIntersection(v1: Vector, v2: Vector, point: Vector, margin: number = 0.1): boolean {
    let pointToV1 = Vector.sub(v1, point).mag();
    let pointToV2 = Vector.sub(v2, point).mag();
    let v1ToV2 = Vector.sub(v2, v1).mag();

    return Math.abs(pointToV1 + pointToV2 - v1ToV2) < margin;
}

function closestPointOnLine(lineOrigin: Vector, lineDir: Vector, point: Vector): Vector {
    let v = Vector.sub(point, lineOrigin);
    let t = Vector.dot(v, lineDir) / lineDir.magSq();
    return Vector.add(lineOrigin, lineDir.mult(t));
    // return Vector.add(rayOrigin, rayDir.mult(Math.max(t, 0)));
}

export { lineRayIntersection, linePointIntersection, closestPointOnLine };
