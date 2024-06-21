import { Renderer, Color, Vector } from "polyly";

export default class AABB {
    start: Vector;
    end: Vector;

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }

    has(p: Vector): boolean {
        if (p.x < this.start.x || p.x > this.end.x) return false;
        if (p.y < this.start.y || p.y > this.end.y) return false;
        return true;
    }

    setMinSize(size: number) {
        if (Math.abs(this.start.x - this.end.x) < size) {
            let diff = size - Math.abs(this.start.x - this.end.x);
            this.start.x -= diff / 2;
            this.end.x += diff / 2;
        }
        if (Math.abs(this.start.y - this.end.y) < size) {
            let diff = size - Math.abs(this.start.y - this.end.y);
            this.start.y -= diff / 2;
            this.end.y += diff / 2;
        }
    }

    expand(dx: number, dy: number) {
        this.start.x -= dx;
        this.start.y -= dy;
        this.end.x += dx;
        this.end.y += dy;
    }

    render(renderer: Renderer, _color: Color, _lineWidth: number = 1) {
        const color = new Color(255, 64, 0);
        const lineWidth = 2 / renderer.camera.zoom;
        const rectStart = Vector.sub(this.start, new Vector(2, 2));
        const rectEnd = Vector.add(this.end, new Vector(2, 2));
        renderer.beginPath();
        renderer.setColor(color);
        renderer.rect(rectStart, Vector.sub(rectEnd, rectStart));
        renderer.stroke(lineWidth, { closed: true, dashed: true, dashLength: 4 / renderer.camera.zoom });
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
