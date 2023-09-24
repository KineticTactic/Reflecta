import Vector, { V } from "../lib/Vector";
import World from "./World";

export default class EventHandler {
    static prevTouches: Vector[] = [];

    static attachEventListeners(canvas: HTMLCanvasElement, world: World) {
        // Mouse down event
        canvas.addEventListener("mousedown", (e) => {
            world.handleMouseDown(V(e.clientX, e.clientY), e.button);
        });

        // Touch start event
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            console.log(e.targetTouches);

            if (e.touches.length > 1) {
                EventHandler.prevTouches = [V(e.touches[0].clientX, e.touches[0].clientY), V(e.touches[1].clientX, e.touches[1].clientY)];
                console.log("YAS");

                return;
            }
            world.handleMouseDown(V(e.touches[0].clientX, e.touches[0].clientY), 0);
        });

        // Mouse move event
        canvas.addEventListener("mousemove", (e) => {
            world.handleMouseMove(V(e.clientX, e.clientY));
        });

        // Touch move event
        canvas.addEventListener("touchmove", (e) => {
            console.log(e.touches);

            /// This is kind of a hack to implement pinch zooming
            if (e.touches.length > 1) {
                const newTouches = [V(e.touches[0].clientX, e.touches[0].clientY), V(e.touches[1].clientX, e.touches[1].clientY)];
                const prevDist = EventHandler.prevTouches[0].dist(EventHandler.prevTouches[1]);
                const newDist = newTouches[0].dist(newTouches[1]);
                const delta = newDist - prevDist;
                if (Math.abs(delta) > 10) world.handleMouseWheel(delta);
                EventHandler.prevTouches = newTouches;
                return;
            }
            world.handleMouseMove(V(e.touches[0].clientX, e.touches[0].clientY));
            e.preventDefault();
        });

        // Mouse up event
        canvas.addEventListener("mouseup", (e) => {
            world.handleMouseUp(V(e.clientX, e.clientY));
        });

        // Touch end event
        canvas.addEventListener("touchend", (e) => {
            world.handleMouseUp(V(0, 0));
            e.preventDefault();
        });

        // Mouse scroll event
        canvas.addEventListener("wheel", (e) => {
            world.handleMouseWheel(-e.deltaY);
        });

        window.addEventListener("resize", () => {
            world.renderer.resizeCanvas();
            world.camera.setDisplaySize(world.renderer.getDisplaySize());
        });
    }
}
