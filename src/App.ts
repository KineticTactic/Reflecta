import EventHandler from "./core/EventHandler";
import World from "./core/World";
import ConcaveLens from "./entities/ConcaveLens";
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
        this.world.addEntity(new Prism(V(200, -100)));
        this.world.addEntity(new Laser(V(-100, -60), -0.2));
        // this.world.addEntity(new Prism(V(-1520 / 2, 0)));
        // this.world.addEntity(new Laser(V(-100, -60), -0.2));
        this.world.addEntity(new ConcaveLens(V(0, -50)));
    }

    update() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.world.update(deltaTime);
    }

    render() {
        this.renderer.clear();

        // // Draw a square of side length 200
        // this.renderer.path([V(-100, -100), V(100, -100), V(100, 100), V(-100, 100)], 40, RGBA(255, 0, 0, 255), true);

        // // Draw a similar square but translated to the left by 300px
        // this.renderer.path([V(-400, -100), V(-200, -100), V(-200, 100), V(-400, 100), V(-400, -100)], 40, RGBA(0, 255, 0, 255));

        this.world.render();
        this.renderer.render(this.world.camera);
    }
}
