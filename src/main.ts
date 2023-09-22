import WebGL2Renderer from "./graphics/WebGL2Renderer";
import World from "./core/World";
import ConcaveLens from "./entities/ConcaveLens";
// import ConcaveLens from "./entities/ConcaveLens";
import Laser from "./entities/Laser";
// import LightRayEntity from "./entities/LightRayEntity";
// import PointLight from "./entities/PointLight";
import Prism from "./entities/Prism";
// import { RGBA } from "./lib/Color";
import { V } from "./lib/Vector";
import "./style.css";
// import CanvasRenderer from "./graphics/CanvasRenderer";

const renderer = new WebGL2Renderer();
// const renderer = new CanvasRenderer();

const w = new World(renderer);
const p = new Prism(V(-1920 / 2, 0));
w.addEntity(p);
const p2 = new Prism(V(200, -100));
w.addEntity(p2);
p2.rotate(1.87);
const l = new Laser(V(-100, -60));
l.rotate(-0.2);
w.addEntity(l);
const lens = new ConcaveLens(V(0, -50));
w.addEntity(lens);

renderer.canvas.addEventListener("mousedown", (e) => {
    w.handleMouseDown(V(e.clientX, e.clientY), e.button);
});

renderer.canvas.addEventListener("mousemove", (e) => {
    w.handleMouseMove(V(e.clientX, e.clientY));
});

renderer.canvas.addEventListener("mouseup", (e) => {
    w.handleMouseUp(V(e.clientX, e.clientY));
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
    // Renderer.path([V(0, 0), V(0.8, 0.8), V(0.8, 0), V(0, -0.8), V(-0.8, 0), V(-0.7, -0.5)], 0.1, new RGBA(255, 0, 0, 160));

    w.update(delta);
    w.render();

    renderer.render(w.camera);
}

requestAnimationFrame(draw);
