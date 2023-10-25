import { Camera, Vector } from "polyly";
import World, { State } from "../core/World";

export class Draggable {
    pos: Vector;
    screenPos: Vector;
    elt: HTMLDivElement;
    camera: Camera;
    onMoveFunc: (newPos: Vector) => void;

    constructor(pos: Vector, world: World, onMoveFunc: (newPos: Vector) => void) {
        this.pos = pos;
        this.camera = world.camera;
        this.screenPos = this.camera.worldSpaceToScreenSpace(this.pos);
        this.onMoveFunc = onMoveFunc;

        this.elt = document.createElement("div");
        this.elt.classList.add("draggable");
        this.updateHTMLElementPos();
        document.getElementById("draggables")?.appendChild(this.elt);

        this.elt.addEventListener("mousedown", () => {
            world.selectedDraggable = this;
            world.state = State.MOVE_DRAGGABLE;
        });

        this.elt.addEventListener("mouseup", (e) => {
            world.handleMouseUp(new Vector(e.clientX, e.clientY));
        });
    }

    setWorldPos(worldPos: Vector) {
        this.pos = worldPos;
        this.screenPos = this.camera.worldSpaceToScreenSpace(this.pos);
        this.updateHTMLElementPos();
    }

    setScreenPos(screenPos: Vector) {
        this.screenPos = screenPos;
        this.pos = this.camera.screenSpaceToWorldSpace(this.screenPos);
        this.updateHTMLElementPos();
    }

    updateScreenPos() {
        this.screenPos = this.camera.worldSpaceToScreenSpace(this.pos);
        this.updateHTMLElementPos();
    }

    updateHTMLElementPos() {
        this.elt.style.left = `calc(${this.screenPos.x}px - 0.5rem)`;
        this.elt.style.top = `calc(${this.screenPos.y}px - 0.5rem)`;
    }

    dispose() {
        this.elt.remove();
    }
}
