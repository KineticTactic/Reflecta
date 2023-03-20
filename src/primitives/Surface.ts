import Vector from "../lib/Vector";

export default abstract class Surface {
    abstract canIntersectTwice: boolean;

    abstract intersects(origin: Vector, dir: Vector): Vector | null;
    abstract handle(origin: Vector, dir: Vector): Vector;
}
