import LightBeam from "./entities/LightBeam";
import Prism from "./entities/Prism";
import Vector from "./lib/Vector";
import "./style.css";
import { World } from "./World";

const canvas = document.getElementById("display") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Fullscreen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const w = new World();
w.addEntity(new Prism(new Vector(600, 300)));
w.addEntity(new LightBeam(new Vector(300, 300)));

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // w.lightRays[0].dir.rotate(0.0001);
    // console.log("");

    // w.updateDraggables(mousePos, mouseDown);

    w.update();
    w.render(ctx);
}

draw();
