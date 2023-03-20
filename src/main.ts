import LightBeam from "./entities/LightBeam";
import Prism from "./entities/Prism";
import Vector from "./lib/Vector";
import CurvedSurface from "./primitives/CurvedSurface";
import ReflectiveCurvedSurface from "./primitives/ReflectiveCurvedSurface";
import "./style.css";
import { setContext } from "./util/debug";
import { World } from "./World";

const canvas = document.getElementById("display") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

setContext(ctx);

// Fullscreen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const w = new World();
const p = new Prism(new Vector(200, 150));
const p2 = new Prism(new Vector(200, 550));
w.addEntity(p);
// w.addEntity(p2);
w.addEntity(new LightBeam(new Vector(300, 300)));

const curve = new ReflectiveCurvedSurface(new Vector(700, 300), 100, new Vector(-1, 0), 3);
w.addSurface(curve);

window.addEventListener("click", (e) => {
    w.handleClick(new Vector(e.clientX, e.clientY));
});

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // w.lightRays[0].dir.rotate(0.0001);
    // console.log("");

    // w.updateDraggables(mousePos, mouseDown);

    p.rotate(-0.001);
    p2.rotate(-0.005);
    curve.facing.rotate(0.005);

    w.update();
    curve.render(ctx);
    w.render(ctx);
}

draw();
