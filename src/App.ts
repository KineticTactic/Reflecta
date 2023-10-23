import { Renderer, Vector } from "polyly";

import EventHandler from "./core/EventHandler";
import World from "./core/World";
// import ConcaveLens from "./entities/ConcaveLens";
// import IdealConvexLens from "./entities/IdealConvexLens";
// import Laser from "./entities/Laser";
// import ConcaveLens from "./entities/ConcaveLens";
// import Prism from "./entities/Prism";
import { SaveState } from "./util/SaveState";
import { CaptureCanvas } from "./util/CaptureCanvas";
import ConvexLens from "./entities/ConvexLens";
// import PointLight from "./entities/PointLight";
import LightBeam from "./entities/LightBeam";
// import Prism from "./entities/Prism";

export default class App {
    world: World;
    renderer: Renderer;

    lastFrameTime: number = performance.now();

    constructor() {
        const canvas = document.getElementById("display") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.renderer = new Renderer({ webglVersion: 2, canvas });

        this.world = new World(this.renderer);

        EventHandler.attachEventListeners(this.renderer.canvas, this.world);
    }

    addEntities() {
        // this.world.addEntity(new Prism({ pos: new Vector(200, -100) }));
        this.world.addEntity(new ConvexLens({ pos: new Vector(-200, -50) }));
        this.world.addEntity(new LightBeam({ pos: new Vector(-0, -100), rot: Math.PI + 0.01 }));
        // this.world.addEntity(new ConvexLens({ pos: new Vector(50, 0), rot: Math.PI / 2 }));

        // Check if we have a state query param in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const encoded = urlParams.get("state");
        if (encoded) SaveState.restoreWorld(this.world, encoded);
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.world.update(deltaTime);
    }

    render() {
        this.renderer.clear();

        // this.renderer.beginShape();

        // // // Draw a square of side length 200
        // this.renderer.path([V(-100, -100), V(100, -100), V(100, 100), V(-100, 100)], RGBA(255, 0, 0, 255));
        // // this.renderer.stroke(30, true);
        // // this.renderer.stroke(20);

        // // // Draw a similar square but translated to the left by 300px
        // this.renderer.path([V(-400, -100), V(-200, -100), V(-200, 100), V(-400, 100), V(-400, -100)], RGBA(0, 255, 0, 255));

        // this.renderer.stroke(30);

        // this.renderer.line(V(-200, -200), V(300, 300), 100, RGBA(0, 255, 255, 255));

        this.world.render();
        this.renderer.render(this.world.camera);

        if (CaptureCanvas.captureFlag === true) {
            CaptureCanvas.capture(this.world);
        }

        // console.time();
        // for (let y = 0; y < 10000; y += 1) {
        //     this.renderer.line(new Vector(0, y), new Vector(window.innerWidth, y), 1, new Color(255, 255, 255, 255));
        // }

        // console.timeEnd();
        // this.renderer.render(this.world.camera);
    }
}
