import ConcaveLens from "./entities/ConcaveLens";
import ConvexLens from "./entities/ConvexLens";
import LightBeam from "./entities/LightBeam";
import PointLight from "./entities/PointLight";
import Prism from "./entities/Prism";
import Vector from "./lib/Vector";
import CurvedReflectiveSurface from "./primitives/CurvedReflectiveSurface";
import CurvedRefractiveSurface from "./primitives/CurvedRefractiveSurface";
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
w.addEntity(p);
const l = new PointLight(new Vector(700, 400));
// const l = new LightBeam(new Vector(300, 300));
w.addEntity(l);
w.addEntity(new ConvexLens(new Vector(800, 300)));
w.addEntity(new ConcaveLens(new Vector(500, 300)));

// const curve = new CurvedReflectiveSurface(new Vector(700, 300), 100, new Vector(-1, 0), 3);
// const curve2 = new CurvedRefractiveSurface(new Vector(400, 500), 100, new Vector(-1, 0), 3, 2);
// w.addSurface(curve);
// w.addSurface(curve2);

window.addEventListener("click", (e) => {
    w.handleClick(new Vector(e.clientX, e.clientY));
});

window.addEventListener("mousemove", (e) => {
    l.setPosition(new Vector(e.clientX, e.clientY));
});

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // p.rotate(-0.001);
    // curve.facing.rotate(0.005);
    // curve2.facing.rotate(-0.01);

    w.update();
    // curve.render(ctx);
    // curve2.render(ctx);
    w.render(ctx);
}

draw();
