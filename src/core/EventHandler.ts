import { Vector } from "polyly";

import World from "./World";

export default class EventHandler {
    static prevTouches: Vector[] = [];

    static attachEventListeners(canvas: HTMLCanvasElement, world: World) {
        // Mouse down event
        canvas.addEventListener("mousedown", (e) => {
            world.handleMouseDown(new Vector(e.clientX, e.clientY), e.button);
        });

        // Touch start event
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            console.log(e.targetTouches);

            if (e.touches.length > 1) {
                EventHandler.prevTouches = [new Vector(e.touches[0].clientX, e.touches[0].clientY), new Vector(e.touches[1].clientX, e.touches[1].clientY)];
                console.log("YAS");

                return;
            }
            world.handleMouseDown(new Vector(e.touches[0].clientX, e.touches[0].clientY), 0);
        });

        // Mouse move event
        window.addEventListener("mousemove", (e) => {
            world.handleMouseMove(new Vector(e.clientX, e.clientY), e.ctrlKey);
        });

        // Touch move event
        window.addEventListener("touchmove", (e) => {
            console.log(e.touches);

            /// This is kind of a hack to implement pinch zooming
            if (e.touches.length > 1) {
                const newTouches = [new Vector(e.touches[0].clientX, e.touches[0].clientY), new Vector(e.touches[1].clientX, e.touches[1].clientY)];
                const prevDist = EventHandler.prevTouches[0].dist(EventHandler.prevTouches[1]);
                const newDist = newTouches[0].dist(newTouches[1]);
                const delta = newDist - prevDist;
                if (Math.abs(delta) > 10) world.handleMouseWheel(delta);
                EventHandler.prevTouches = newTouches;
                return;
            }
            world.handleMouseMove(new Vector(e.touches[0].clientX, e.touches[0].clientY), e.ctrlKey);
            e.preventDefault();
        });

        // Mouse up event
        canvas.addEventListener("mouseup", (e) => {
            world.handleMouseUp(new Vector(e.clientX, e.clientY));
        });

        // Touch end event
        canvas.addEventListener("touchend", (e) => {
            world.handleMouseUp(new Vector(0, 0));
            e.preventDefault();
        });

        // Mouse scroll event
        canvas.addEventListener("wheel", (e) => {
            world.handleMouseWheel(-e.deltaY);
        });

        window.addEventListener("resize", () => {
            world.renderer.resizeCanvas(window.innerWidth, window.innerHeight);
            world.camera.setDisplaySize(world.renderer.getDisplaySize());
            if (world.entities[world.selectedEntityIndex]) world.entities[world.selectedEntityIndex].updateDraggables();
        });
    }
}
