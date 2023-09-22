import * as twgl from "twgl.js";

import { plainText as vertexShader } from "../shaders/vertexShader.glsl";
import { plainText as fragmentShader } from "../shaders/fragmentShader.glsl";
import Color from "../lib/Color";
import Vector, { V } from "../lib/Vector";
import Camera from "../core/Camera";
import Renderer from "./Renderer";

const MAX_VERTICES = 20000;

export default class WebGL2Renderer extends Renderer {
    gl: WebGL2RenderingContext;
    shaderProgramInfo: twgl.ProgramInfo;
    bufferInfo: twgl.BufferInfo;
    numVertices = 0;
    numIndices = 0;
    positions = new Float32Array(MAX_VERTICES * 2);
    colors = new Uint8Array(MAX_VERTICES * 4);
    indices = new Uint16Array(MAX_VERTICES * 3);

    constructor() {
        super();

        this.gl = this.canvas.getContext("webgl2") as WebGL2RenderingContext;

        this.shaderProgramInfo = twgl.createProgramInfo(this.gl, [vertexShader, fragmentShader]);

        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
            position: { numComponents: 2, data: this.positions, drawType: this.gl.DYNAMIC_DRAW },
            color: { numComponents: 4, data: this.colors, drawType: this.gl.DYNAMIC_DRAW },
            indices: { numComponents: 3, data: this.indices, drawType: this.gl.DYNAMIC_DRAW },
        });

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE); // Additive Blending
        twgl.resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    line(v1: Vector, v2: Vector, w: number, color: Color) {
        this.addIndices([0, 1, 2, 0, 2, 3]);
        this.calculateSidewaysPoints(v1, v2, w);
        this.addVertices(this.calculateSidewaysPoints(v1, v2, w), color);
        this.addVertices(this.calculateSidewaysPoints(v2, v1, w), color);
    }

    path(vertices: Vector[], w: number, color: Color) {
        const v1 = vertices[0];
        const v2 = vertices[1];
        this.addVertices(this.calculateSidewaysPoints(v1, v2, w), color);
        for (let i = 0; i < vertices.length - 2; i++) {
            let x1 = vertices[i].x;
            let y1 = vertices[i].y;
            let x2 = vertices[i + 1].x;
            let y2 = vertices[i + 1].y;
            let x3 = vertices[i + 2].x;
            let y3 = vertices[i + 2].y;
            // const angle = Math.atan2(y2 - y1, x2 - x1) - Math.atan2(y3 - y2, x3 - x2);
            // if(angle  0.5)
            const a1 = y1 - y2;
            const b1 = x1 - x2;
            const c1 = y1 * (x1 - x2) - x1 * (y1 - y2);
            const a2 = y2 - y3;
            const b2 = x2 - x3;
            const c2 = y2 * (x2 - x3) - x2 * (y2 - y3);
            const d1 = (w / 2) * Math.sqrt(a1 * a1 + b1 * b1) - c1;
            const d2 = (w / 2) * Math.sqrt(a1 * a1 + b1 * b1) + c1;
            const d3 = (w / 2) * Math.sqrt(a2 * a2 + b2 * b2) - c2;
            const d4 = (w / 2) * Math.sqrt(a2 * a2 + b2 * b2) + c2;
            // a1x + b1y + d1 = 0
            // a2x + b2y + d3 = 0
            const x4 = (b1 * d3 - b2 * d1) / (a1 * b2 - a2 * b1);
            const y4 = (a2 * d1 - a1 * d3) / (a1 * b2 - a2 * b1);
            // console.log(d1);
            // a1x + b1y + d2 = 0
            // a2x + b2y + d4 = 0
            const x5 = (b1 * d4 - b2 * d2) / (a1 * b2 - a2 * b1);
            const y5 = (a2 * d2 - a1 * d4) / (a1 * b2 - a2 * b1);
            // indices.push(i + 0, i + 1, i + 2, i + 1, i + 2, i + 3);
            this.addIndices([-2, -1, 0, -1, 0, 1]);
            this.addVertices([V(-x4, y4), V(x5, -y5)], color);
        }
        // indices.push(i + 0, i + 1, i + 2, i + 0, i + 2, i + 3);
        this.addIndices([-2, -1, 0, -2, 0, 1]);
        this.addVertices(this.calculateSidewaysPoints(vertices[vertices.length - 1], vertices[vertices.length - 2], w), color);
    }

    fillPath(vertices: Vector[], color: Color) {
        const indicesList = [];
        for (let i = 1; i < vertices.length - 1; i++) {
            indicesList.push(0, i, i + 1);
        }
        console.log(indicesList, vertices);
        this.addIndices(indicesList);
        this.addVertices(vertices, color);

        // console.log("Hi");
    }

    arc(pos: Vector, radius: number, startAngle: number, endAngle: number, w: number, color: Color) {
        const numSegments = 20;
        const angleStep = (endAngle - startAngle) / numSegments;
        const vertices = [];
        for (let i = 0; i <= numSegments; i++) {
            const angle = startAngle + angleStep * i;
            vertices.push(V(pos.x + radius * Math.cos(angle), pos.y + radius * Math.sin(angle)));
        }
        this.path(vertices, w, color);
    }

    clear() {
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    render(camera: Camera) {
        this.updateBuffers();

        const uniforms = {
            resolution: [this.gl.canvas.width, this.gl.canvas.height],
            u_matrix: camera.getMatrix(),
        };

        this.gl.useProgram(this.shaderProgramInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.shaderProgramInfo, this.bufferInfo);
        twgl.setUniforms(this.shaderProgramInfo, uniforms);
        twgl.drawBufferInfo(this.gl, this.bufferInfo, this.gl.TRIANGLES, this.numIndices);
        // console.log(this.numIndices, this.bufferInfo.numElements);
        // console.log(this.numVertices, this.numIndices, this.bufferInfo.numElements);

        this.numVertices = 0;
        this.numIndices = 0;
    }

    private calculateSidewaysPoints(v1: Vector, v2: Vector, w: number) {
        const theta = Math.atan2(v2.y - v1.y, v2.x - v1.x);
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        const x3 = v1.x - (w / 2) * sinTheta;
        const y3 = v1.y + (w / 2) * cosTheta;

        const x4 = v1.x + (w / 2) * sinTheta;
        const y4 = v1.y - (w / 2) * cosTheta;

        return [new Vector(x3, y3), new Vector(x4, y4)];
    }

    private addVertex(v: Vector, color: Color) {
        this.positions[this.numVertices * 2 + 0] = v.x;
        this.positions[this.numVertices * 2 + 1] = v.y;
        for (let i = 0; i < 4; i++) this.colors[this.numVertices * 4 + i] = color.array()[i];
        this.numVertices++;
    }

    private addVertices(vertices: Vector[], color: Color) {
        for (let i = 0; i < vertices.length; i++) this.addVertex(vertices[i], color);
    }

    private addIndices(ind: number[]) {
        for (let i = 0; i < ind.length; i++) this.indices[this.numIndices + i] = ind[i] + this.numVertices;
        this.numIndices += ind.length;
    }

    private updateBuffers() {
        // Clear only the ones necessary
        for (let i = this.numVertices * 2; i < this.positions.length; i++) this.positions[i] = 0;
        for (let i = this.numVertices * 4; i < this.colors.length; i++) this.colors[i] = 0;
        for (let i = this.numIndices; i < this.indices.length; i++) this.indices[i] = 0;

        twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs!.position, this.positions);
        twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs!.color, this.colors);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferInfo.indices!);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
    }
}
