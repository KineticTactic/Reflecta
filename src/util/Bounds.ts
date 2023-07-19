import Vector from "../lib/Vector";

export class Bounds {}

export class AABB {
    start: Vector;
    end: Vector;

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "#8424b9";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.start.x, this.start.y, this.end.x - this.start.x, this.end.y - this.start.y);
    }

    static fromPoints(points: Vector[]): AABB {
        let min = points[0].copy();
        let max = points[0].copy();

        for (let p of points) {
            if (p.x < min.x) min.x = p.x;
            else if (p.x > max.x) max.x = p.x;

            if (p.y < min.y) min.y = p.y;
            else if (p.y > max.y) max.y = p.y;
        }

        return new AABB(min, max);
    }

    static fromAABBs(aabbs: AABB[]): AABB {
        const points: Vector[] = [];
        for (let aabb of aabbs) points.push(aabb.start, aabb.end);
        return AABB.fromPoints(points);
    }
}
