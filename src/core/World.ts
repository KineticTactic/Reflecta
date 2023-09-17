import Vector from "../lib/Vector";
import Entity from "./Entity";
import LightRay from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import UI from "../ui/UI";

export default class World {
    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];
    entities: Entity[] = [];

    worldOffset = Vector.zero();
    worldScale = 1;

    selectedEntityIndex: number = -1;

    isMouseDown = false;
    lastMousePos: Vector = Vector.zero();
    isSelectedEntityBeingDragged = false;
    buttonDown: number = -1;

    ui: UI = new UI(this);

    // addSurface(surface: Surface) {
    //     // this.surfaces.push(surface);
    // }

    // addLightRay(lightRay: LightRay) {
    //     // this.lightRays.push(lightRay);
    // }

    addEntity(entity: Entity) {
        this.entities.push(entity);
        // entity.addToWorld(this);
    }

    removeEntity(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) this.entities.splice(index, 1);
        this.selectedEntityIndex = -1;
    }

    update() {
        this.surfaces = this.entities.map((e) => e.surfaces).flat();
        this.lightRays = this.entities.map((e) => e.lightRays).flat();

        for (let l of this.lightRays) {
            l.trace(this.surfaces);
        }
    }

    handleMouseDown(mousePos: Vector, button: MouseEvent["button"]) {
        const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);

        ///TODO: Objects on top of one another cant be selected, only the topmost one is selected

        // const previouslySelected = this.selectedEntityIndex;
        this.selectedEntityIndex = -1;
        this.ui.deselectEntity();
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].bounds.has(worldMousePos)) {
                console.log("Selected entity:", this.entities[i]);

                this.selectedEntityIndex = i;
                this.isSelectedEntityBeingDragged = true;

                this.ui.selectEntity(this.entities[i]);

                break;
            }
        }

        this.isMouseDown = true;
        this.buttonDown = button;
    }

    handleMouseMove(mousePos: Vector) {
        if (this.isMouseDown) {
            this.handleDrag(mousePos);
        } else {
            // Calculate mouse position in world space
            const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);
            // Check if mouse is hovering over an entity to draw AABBs
            for (let e of this.entities) {
                e.displayBounds = e.bounds.has(worldMousePos);
            }
        }
        this.lastMousePos = mousePos.copy();
    }

    handleDrag(mousePos: Vector) {
        const deltaMousePos = Vector.sub(mousePos, this.lastMousePos);

        // If no entity is selected then we are dragging the world space
        if (this.selectedEntityIndex === -1) {
            this.worldOffset.add(deltaMousePos);
            return;
        }

        // At this point some entity is selected

        const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);
        const lastWorldMousePos = Vector.sub(this.lastMousePos, this.worldOffset).div(this.worldScale);
        const worldDeltaMousePos = deltaMousePos.copy().div(this.worldScale);

        if (this.buttonDown === 2) {
            // Rotate with right mouse button
            const originToLastMousePos = Vector.sub(lastWorldMousePos, this.entities[this.selectedEntityIndex].pos);
            const originToMousePos = Vector.sub(worldMousePos, this.entities[this.selectedEntityIndex].pos);
            const angle = Vector.angleBetween(originToLastMousePos, originToMousePos);
            this.entities[this.selectedEntityIndex].rotate(angle);
        } else {
            // translate with left mouse button
            this.entities[this.selectedEntityIndex].translate(worldDeltaMousePos);
        }
        return;
    }

    handleMouseUp(_mousePos: Vector) {
        this.isMouseDown = false;
        this.isSelectedEntityBeingDragged = false;
        this.buttonDown = -1;
    }

    handleMouseWheel(delta: number) {
        let scaleFactor = 0.8;
        scaleFactor = delta > 0 ? 1 / scaleFactor : scaleFactor;

        this.worldScale *= scaleFactor;

        const dx = (this.lastMousePos.x - this.worldOffset.x) * (1 - scaleFactor);
        const dy = (this.lastMousePos.y - this.worldOffset.y) * (1 - scaleFactor);

        this.worldOffset.x += dx;
        this.worldOffset.y += dy;

        // Clamp world scale
        // TODO: Investigate rendering bug that happens on zooming in too much
        // this.worldScale = Math.max(Math.min(this.worldScale, 1), 0.1);
    }

    render(ctx: CanvasRenderingContext2D) {
        // Canvas transformations
        ctx.save();
        ctx.translate(this.worldOffset.x, this.worldOffset.y);
        ctx.scale(this.worldScale, this.worldScale);

        // Render light rays
        ctx.beginPath();
        for (let lightRay of this.lightRays) lightRay.render(ctx);
        const brightness = 150;
        ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 1)`;
        ctx.lineWidth = 0.2;
        // ctx.shadowBlur = 100;
        ctx.globalCompositeOperation = "lighter";
        // ctx.globalAlpha = 1;
        ctx.lineCap = "butt";
        ctx.stroke();
        ctx.closePath();

        // Render entities
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(ctx, this.selectedEntityIndex == i);
        }

        // Restore default canvas transformations
        ctx.restore();
    }
}
