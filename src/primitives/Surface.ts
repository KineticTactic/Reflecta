import Vector from "../lib/Vector";
import AABB from "../util/Bounds";

export default abstract class Surface {
    abstract canIntersectTwice: boolean;

    abstract intersects(origin: Vector, dir: Vector): Vector | null;
    abstract handle(origin: Vector, dir: Vector): Vector;

    abstract calculateAABB(): AABB;

    abstract translate(_delta: Vector): void;
    abstract rotateAboutAxis(_theta: number, _axis: Vector): void;

    abstract render(ctx: CanvasRenderingContext2D, color?: string): void;
}
