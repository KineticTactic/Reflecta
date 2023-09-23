import Camera from "../core/Camera";
import Color from "../lib/Color";
import Vector, { V } from "../lib/Vector";

export default abstract class Renderer {
    canvas: HTMLCanvasElement;

    constructor() {
        const dpi = Math.ceil(window.devicePixelRatio);
        this.canvas = document.getElementById("display") as HTMLCanvasElement;
        this.canvas.width = window.innerWidth * dpi;
        this.canvas.height = window.innerHeight * dpi;
        this.canvas.style.width = window.innerWidth + "px";
        this.canvas.style.height = window.innerHeight + "px";
        // alert(this.canvas.width + " " + this.canvas.height + " " + this.canvas.style.width + " " + this.canvas.style.height);
    }

    line(_v1: Vector, _v2: Vector, _w: number, _color: Color): void {}
    path(_vertices: Vector[], _w: number, _color: Color) {}
    fillPath(_vertices: Vector[], _color: Color) {}
    arc(_pos: Vector, _radius: number, _startAngle: number, _endAngle: number, _w: number, _color: Color) {}
    clear() {}
    render(_camera: Camera) {}

    getDisplaySize() {
        return V(this.canvas.width, this.canvas.height);
    }
}
