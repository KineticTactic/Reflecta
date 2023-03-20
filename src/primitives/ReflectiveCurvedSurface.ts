import Vector from "../lib/Vector";
import { point } from "../util/debug";
import CurvedSurface from "./CurvedSurface";

export default class ReflectiveSurface extends CurvedSurface {
    constructor(center: Vector, radius: number, facing: Vector, span: number) {
        super(center, radius, facing, span);
    }

    handle(intersection: Vector, dir: Vector) {
        // Calculate reflection vector
        // r = d - (2(d.n)/|n|^2)n, where d is vector of incoming ray, n is normal vector

        let normal = Vector.sub(intersection, this.center).normalize();

        let r = Vector.sub(dir, normal.copy().mult((2 * Vector.dot(dir, normal)) / normal.magSq()));

        // point(Vector.add(intersection, r.copy().mult(100)));

        return r;
    }

    // render(ctx: CanvasRenderingContext2D) {
    //     super.render(ctx);

    //     let dir = Vector.sub(this.v2, this.v1);

    //     ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    //     ctx.lineWidth = 1;
    //     ctx.beginPath();

    //     for (let i = 0; i < dir.mag(); i += 10) {
    //         let p1 = Vector.add(this.v1, dir.copy().setMag(i));
    //         let p2 = Vector.add(
    //             p1,
    //             dir
    //                 .copy()
    //                 .rotate(-Math.PI / 4)
    //                 .setMag(10)
    //         );

    //         ctx.moveTo(p1.x, p1.y);
    //         ctx.lineTo(p2.x, p2.y);
    //     }
    //     ctx.stroke();
    // }
}
