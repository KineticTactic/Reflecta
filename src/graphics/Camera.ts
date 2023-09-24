import Vector, { V } from "../lib/Vector";
import * as twgl from "twgl.js";
import { interpolate } from "../lib/math";

export default class Camera {
    zoom = 1;
    pos = V(0, 0);
    displaySize = V(0, 0);
    aspect = 1; // Aspect ratio
    matrix: twgl.m4.Mat4 = twgl.m4.identity();

    constructor(displaySize: Vector) {
        this.setDisplaySize(displaySize);
    }

    translate(delta: Vector) {
        this.pos = this.pos.add(delta);
        this.calculateMatrix();
    }

    setZoom(zoom: number) {
        this.zoom = zoom;
        this.calculateMatrix();
    }

    setDisplaySize(displaySize: Vector) {
        this.displaySize = displaySize;
        this.calculateAspectRatio();
        this.calculateMatrix();
    }

    calculateAspectRatio() {
        this.aspect = this.displaySize.x / this.displaySize.y;
    }

    calculateMatrix() {
        const factor = this.displaySize.y / this.zoom;
        this.matrix = twgl.m4.translate(
            twgl.m4.ortho(-this.aspect * factor, this.aspect * factor, 1 * factor, -1 * factor, -1, 1),
            twgl.v3.create(-this.pos.x, -this.pos.y)
        );
    }

    screenSpaceToWorldSpace(v: Vector) {
        const factor = window.innerHeight / this.zoom;

        const x = interpolate(v.x, 0, window.innerWidth, -this.aspect * factor, this.aspect * factor) + this.pos.x;
        const y = interpolate(v.y, 0, window.innerHeight, -1 * factor, 1 * factor) + this.pos.y;
        return V(x, y);
    }

    getMatrix() {
        return this.matrix;
    }
}
