import Vector from "../lib/Vector";

let ctx: CanvasRenderingContext2D;

export function setContext(context: CanvasRenderingContext2D) {
    ctx = context;
}

export function point(v: Vector) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(v.x, v.y, 5, 0, 2 * Math.PI);
    ctx.fill();
}
