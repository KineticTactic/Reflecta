import EventHandler from "./core/EventHandler";
import World from "./core/World";
import ConcaveLens from "./entities/ConcaveLens";
import IdealConvexLens from "./entities/IdealConvexLens";
import Laser from "./entities/Laser";
import Prism from "./entities/Prism";
import Renderer from "./graphics/Renderer";
import WebGLRenderer from "./graphics/WebGLRenderer";
import { V } from "./lib/Vector";

export default class App {
    world: World;
    renderer: Renderer;

    lastFrameTime: number = performance.now();

    constructor() {
        this.renderer = new WebGLRenderer();
        this.world = new World(this.renderer);

        EventHandler.attachEventListeners(this.renderer.canvas, this.world);
    }

    addEntities() {
        // this.world.addEntity(new Prism(V(200, -100)));
        // this.world.addEntity(new ConcaveLens(V(0, -50)));
        this.world.addEntity(new Laser(V(-0, -100), Math.PI / 2, false));
        this.world.addEntity(new IdealConvexLens(V(0, 0), 0));
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
    }
}
