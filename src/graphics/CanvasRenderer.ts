import Camera from "./Camera";
import Color, { RGBA } from "../lib/Color";
import Vector, { V } from "../lib/Vector";
import Renderer from "./Renderer";

export default class CanvasRenderer extends Renderer {
    ctx: CanvasRenderingContext2D;
    lineWidth: number = 1;
    strokeStyle: Color = RGBA(255, 255, 255, 255);
    translation: Vector = V(0, 0);
    scale = 1;

    constructor() {
        super();

        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    line(v1: Vector, v2: Vector, w: number, color: Color): void {
        this.ctx.beginPath();
        this.ctx.moveTo(v1.x, v1.y);
        this.ctx.lineTo(v2.x, v2.y);
        if (this.lineWidth != w) {
            this.ctx.lineWidth = w;
            this.lineWidth = w;
        }
        if (this.strokeStyle != color) {
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            this.strokeStyle = color;
        }
        this.ctx.stroke();
    }

    path(vertices: Vector[], w: number, color: Color) {
        this.ctx.beginPath();
        this.ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            this.ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        if (this.lineWidth != w) {
            this.ctx.lineWidth = w;
            this.lineWidth = w;
        }
        if (this.strokeStyle != color) {
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            this.strokeStyle = color;
        }
        this.ctx.stroke();
    }

    arc(pos: Vector, radius: number, startAngle: number, endAngle: number, w: number, color: Color) {
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, startAngle, endAngle);
        if (this.lineWidth != w) {
            this.ctx.lineWidth = w;
            this.lineWidth = w;
        }
        if (this.strokeStyle != color) {
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            this.strokeStyle = color;
        }
        this.ctx.stroke();
    }

    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.translation.x, this.translation.y);
        this.ctx.scale(this.scale, this.scale);
    }

    render(camera: Camera) {
        this.translation = camera.pos.copy().mult(-1);
        this.scale = camera.zoom;
        this.ctx.restore();
    }

    getDisplaySize() {
        return V(this.canvas.width, this.canvas.height);
    }
}
