import Vector from "../lib/Vector";

enum DraggableState {
    Idle = 0,
    Hover,
    Dragging,
}

export default class Draggable {
    pos: Vector;
    radius: number;
    state: DraggableState;

    constructor(pos: Vector) {
        this.pos = pos;
        this.radius = 6;
        this.state = DraggableState.Idle;
    }

    /// TODO: FIX THIS SHIT
    update(mousePos: Vector, mouseDown: boolean) {
        if (!mouseDown) {
            this.state = DraggableState.Idle;
        }
        if (this.state === DraggableState.Dragging) {
            this.pos = mousePos.copy();
            if (!mouseDown) {
                this.state = DraggableState.Idle;
            }
        } else if (this.state === DraggableState.Hover) {
            if (mouseDown) {
                this.state = DraggableState.Dragging;
            }
        } else if (mousePos.dist(this.pos) < this.radius) {
            this.state = DraggableState.Hover;
        } else {
            this.state = DraggableState.Idle;
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        let r = this.state === DraggableState.Hover ? this.radius * 1.5 : this.radius;

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
    }
}
