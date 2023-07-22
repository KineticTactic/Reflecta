import Vector from "./lib/Vector";
import Entity from "./entities/Entity";
import LightRay from "./primitives/LightRay";
import Surface from "./primitives/Surface";

export class World {
    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];
    entities: Entity[] = [];

    worldOffset = Vector.ZERO;
    worldScale = 1;

    selectedEntityIndex: number = -1;

    isMouseDown = false;
    lastMousePos: Vector = Vector.ZERO;
    isSelectedEntityBeingDragged = false;

    addSurface(surface: Surface) {
        this.surfaces.push(surface);
    }

    addLightRay(lightRay: LightRay) {
        this.lightRays.push(lightRay);
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
        entity.addToWorld(this);
    }

    update() {
        for (let l of this.lightRays) {
            l.trace(this.surfaces);
        }
    }

    handleMouseDown(mousePos: Vector) {
        const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);

        ///TODO: Objects on top of one another cant be selected, only the topmost one is selected

        // const previouslySelected = this.selectedEntityIndex;
        this.selectedEntityIndex = -1;
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].bounds.has(worldMousePos)) {
                console.log("Selected entity:", this.entities[i]);

                this.selectedEntityIndex = i;
                this.isSelectedEntityBeingDragged = true;
                break;
            }
        }

        this.isMouseDown = true;
    }

    handleMouseMove(mousePos: Vector) {
        const deltaMousePos = Vector.sub(mousePos, this.lastMousePos);
        const worldDeltaMousePos = deltaMousePos.copy().div(this.worldScale);
        this.lastMousePos = mousePos;

        if (this.isMouseDown) {
            if (this.isSelectedEntityBeingDragged) {
                this.entities[this.selectedEntityIndex].translate(worldDeltaMousePos);
                return;
            }

            if (this.selectedEntityIndex === -1) {
                this.worldOffset.add(deltaMousePos);
                return;
            }
        }

        // let worldMousePos = Vector.sub(mousePos, this.worldOffset);
        const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);

        for (let e of this.entities) {
            if (e.bounds.has(worldMousePos)) {
                e.displayBounds = true;
                continue;
            }
            e.displayBounds = false;
        }
    }

    handleMouseUp(_mousePos: Vector) {
        this.isMouseDown = false;
        this.isSelectedEntityBeingDragged = false;
    }

    handleMouseWheel(delta: number) {
        this.worldScale += delta / 1000;

        // Clamp world scale
        // TODO: Investigate rendering bug that happens on zooming in too much
        this.worldScale = Math.max(Math.min(this.worldScale, 1), 0.1);
    }

    render(ctx: CanvasRenderingContext2D) {
        // Canvas transformations
        ctx.save();
        ctx.translate(this.worldOffset.x, this.worldOffset.y);
        ctx.scale(this.worldScale, this.worldScale);

        // Render light rays
        ctx.beginPath();
        for (let lightRay of this.lightRays) lightRay.render(ctx);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Render entities
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(ctx, this.selectedEntityIndex == i);
        }

        // Restore default canvas transformations
        ctx.restore();
    }
}
