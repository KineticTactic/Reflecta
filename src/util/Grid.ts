import { Color, Renderer, Vector } from "polyly";
import World from "../core/World";

export default class Grid {
    static majorGridSize = 500;
    static minorGridSize = 100;

    static render(world: World, renderer: Renderer, gridSize: number, gridDivisions: number) {
        const screenBoundStart = world.camera.screenSpaceToWorldSpace(new Vector(0, 0));
        const screenBoundEnd = world.camera.screenSpaceToWorldSpace(new Vector(renderer.canvas.width, renderer.canvas.height));

        // Axes
        renderer.beginPath();
        const axesColor = new Color(220, 220, 220, 255);
        renderer.vertex(new Vector(screenBoundStart.x, 0), axesColor);
        renderer.vertex(new Vector(screenBoundEnd.x, 0), axesColor);
        renderer.splitPath();
        renderer.vertex(new Vector(0, screenBoundStart.y), axesColor);
        renderer.vertex(new Vector(0, screenBoundEnd.y), axesColor);
        renderer.splitPath();
        renderer.stroke(1 / renderer.camera.zoom);

        // Github Copilot wrote this line of code
        Grid.majorGridSize = gridSize * Math.pow(10, Math.floor(Math.log10(2 / renderer.camera.zoom)));
        Grid.minorGridSize = Grid.majorGridSize / gridDivisions;

        // Minor and Major grids
        this.drawGrid(renderer, Grid.minorGridSize, new Color(50, 50, 50, 255), screenBoundStart, screenBoundEnd);
        this.drawGrid(renderer, Grid.majorGridSize!, new Color(100, 100, 100, 255), screenBoundStart, screenBoundEnd);
    }

    private static drawGrid(renderer: Renderer, gridSize: number, color: Color, screenBoundStart: Vector, screenBoundEnd: Vector) {
        const start = new Vector(Math.floor(screenBoundStart.x / gridSize) * gridSize, Math.floor(screenBoundStart.y / gridSize) * gridSize);
        const end = new Vector(Math.ceil(screenBoundEnd.x / gridSize) * gridSize, Math.ceil(screenBoundEnd.y / gridSize) * gridSize);

        renderer.beginPath();
        renderer.setColor(color);
        for (let x = start.x; x < end.x; x += gridSize) {
            renderer.vertex(new Vector(x, start.y));
            renderer.vertex(new Vector(x, end.y));
            renderer.splitPath();
        }
        for (let y = start.y; y < end.y; y += gridSize) {
            renderer.vertex(new Vector(start.x, y));
            renderer.vertex(new Vector(end.x, y));
            renderer.splitPath();
        }

        renderer.stroke(0.5 / renderer.camera.zoom);
    }
}
