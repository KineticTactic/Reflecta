import Vector from "./Vector";

export function reflect(incident: Vector, normal: Vector): Vector {
    return Vector.sub(incident, normal.copy().mult((2 * Vector.dot(incident, normal)) / normal.magSq()));
}
