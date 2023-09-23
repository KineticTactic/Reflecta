import WebGL2Renderer from "./graphics/WebGL2Renderer";
import World from "./core/World";
import ConcaveLens from "./entities/ConcaveLens";
// import ConcaveLens from "./entities/ConcaveLens";
import Laser from "./entities/Laser";
// import LightRayEntity from "./entities/LightRayEntity";
// import PointLight from "./entities/PointLight";
import Prism from "./entities/Prism";
// import { RGBA } from "./lib/Color";
import Vector, { V } from "./lib/Vector";
import "./style.css";
// import { RGBA } from "./lib/Color";
// import CanvasRenderer from "./graphics/CanvasRenderer";

const renderer = new WebGL2Renderer();
// const renderer = new CanvasRenderer();

const w = new World(renderer);
const p = new Prism(V(-1520 / 2, 0));
w.addEntity(p);
const p2 = new Prism(V(200, -100));
w.addEntity(p2);
p2.rotate(1.87);
const l = new Laser(V(-100, -60));
l.rotate(-0.2);
w.addEntity(l);
const lens = new ConcaveLens(V(0, -50));
w.addEntity(lens);

let prevTouches: Vector[] = [];

renderer.canvas.addEventListener("mousedown", (e) => {
    w.handleMouseDown(V(e.clientX, e.clientY), e.button);
});

renderer.canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    console.log(e.targetTouches);

    if (e.touches.length > 1) {
        prevTouches = [V(e.touches[0].clientX, e.touches[0].clientY), V(e.touches[1].clientX, e.touches[1].clientY)];
        console.log("YAS");

        return;
    }
    w.handleMouseDown(V(e.touches[0].clientX, e.touches[0].clientY), 0);
});

renderer.canvas.addEventListener("mousemove", (e) => {
    w.handleMouseMove(V(e.clientX, e.clientY));
});

renderer.canvas.addEventListener("touchmove", (e) => {
    console.log(e.touches);

    ///TODO: This is kind of a hack
    if (e.touches.length > 1) {
        const newTouches = [V(e.touches[0].clientX, e.touches[0].clientY), V(e.touches[1].clientX, e.touches[1].clientY)];
        const prevDist = prevTouches[0].dist(prevTouches[1]);
        const newDist = newTouches[0].dist(newTouches[1]);
        const delta = newDist - prevDist;
        if (Math.abs(delta) > 10) w.handleMouseWheel(delta);
        prevTouches = newTouches;
        return;
    }
    w.handleMouseMove(V(e.touches[0].clientX, e.touches[0].clientY));
    e.preventDefault();
});

renderer.canvas.addEventListener("mouseup", (e) => {
    w.handleMouseUp(V(e.clientX, e.clientY));
});

renderer.canvas.addEventListener("touchend", (e) => {
    w.handleMouseUp(V(0, 0));
    e.preventDefault();
});

renderer.canvas.addEventListener("wheel", (e) => {
    w.handleMouseWheel(-e.deltaY);
});

let prevFrameTime = performance.now();

function draw() {
    requestAnimationFrame(draw);
    renderer.clear();

    const currentTime = performance.now();
    const delta = currentTime - prevFrameTime;
    prevFrameTime = currentTime;

    // Renderer.line(V(0, 0), V(0.8, 0.6), 0.1, new RGBA(120, 0, 255, 160));
    // Renderer.line(V(0, 0), V(0.8, -0.8), 0.1, new RGBA(0, 120, 200, 160));
    // renderer.path([V(0, 0), V(100, 100), V(100, 0), V(0, -100), V(-100, 0), V(-100, -100)], 10, RGBA(255, 0, 0, 160));
    // renderer.path([V(0, 0), V(100, 100), V(100, 0), V(0, -100), V(-100, 0), V(-100, -100)], 10, RGBA(255, 0, 0, 160));

    w.update(delta);
    w.render();

    renderer.render(w.camera);
}

requestAnimationFrame(draw);
