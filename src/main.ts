import ConcaveLens from "./entities/ConcaveLens";
import ConvexLens from "./entities/ConvexLens";
import GlassSphere from "./entities/GlassSphere";
// import LightBeam from "./entities/LightBeam";
// import LightRayEntity from "./entities/LightRayEntity";
// import LightBeam from "./entities/LightBeam";
// import LightBeam from "./entities/LightBeam";
// import PointLight from "./entities/PointLight";
import Prism from "./entities/Prism";
import Vector from "./lib/Vector";
import "./style.css";
import { setContext } from "./util/debug";
import World from "./core/World";
import GlassSlab from "./entities/GlassSlab";
import Laser from "./entities/Laser";
// import Color from "./lib/Color";

const canvas = document.getElementById("display") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

setContext(ctx);

// Fullscreen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const w = new World();
const p = new Prism(new Vector(500, 300));
w.addEntity(p);
// const l = new PointLight(new Vector(700, 400));
// const l = new LightRayEntity(new Vector(700, 400));
// const l = new LightBeam(new Vector(300, 300));
const l = new Laser(new Vector(300, 300));
l.rotate(-0.2);
w.addEntity(l);
let convex = new ConvexLens(new Vector(800, 300));
w.addEntity(convex);
let concave = new ConcaveLens(new Vector(200, 150));
w.addEntity(concave);

let sphere = new GlassSphere(new Vector(200, 500));
w.addEntity(sphere);

let slab = new GlassSlab(new Vector(1000, 500));
w.addEntity(slab);

// const curve = new CurvedReflectiveSurface(new Vector(700, 300), 100, new Vector(-1, 0), 3);
// const curve2 = new CurvedRefractiveSurface(new Vector(400, 500), 100, new Vector(-1, 0), 3, 2);
// w.addSurface(curve);
// w.addSurface(curve2);

canvas.addEventListener("mousedown", (e) => {
    w.handleMouseDown(new Vector(e.clientX, e.clientY), e.button);
});

canvas.addEventListener("mousemove", (e) => {
    w.handleMouseMove(new Vector(e.clientX, e.clientY));
});

canvas.addEventListener("mouseup", (e) => {
    w.handleMouseUp(new Vector(e.clientX, e.clientY));
});

canvas.addEventListener("wheel", (e) => {
    w.handleMouseWheel(-e.deltaY);
});

// w.selectedEntityIndex = 1;
// w.ui.selectEntity(w.entities[1]);
let prevFrameTime = performance.now();

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // p.translate(new Vector(0.5, 0));

    // l.rotate(0.02);
    // p.rotate(-0.001);
    // convex.rotate(-0.005);
    // concave.rotate(0.005);
    // curve.facing.rotate(0.005);
    // curve2.facing.rotate(-0.01);

    const currentTime = performance.now();
    const delta = currentTime - prevFrameTime;
    prevFrameTime = currentTime;

    w.update(delta);
    // curve.render(ctx);
    // curve2.render(ctx);
    w.render(ctx);

    // draw a spectrum for testing
    // for (let i = 380; i <= 830; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(i, 0);
    //     ctx.lineTo(i, 100);
    //     ctx.strokeStyle = Color.wavelengthToHex(i);
    //     ctx.stroke();
    // }
}

draw();
