import Vector, { V } from "../lib/Vector";
import Entity from "./Entity";
import LightRay from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import UI from "../ui/UI";
import Renderer from "../graphics/Renderer";
import Camera from "./Camera";
import WebGL2Renderer from "../graphics/WebGL2Renderer";

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

    stats = {
        frameTime: 0,
        entities: 0,
        lightRays: 0,
        surfaces: 0,
        totalLightBounces: 0,
        maxLightBounces: 0,
        lightTraceTime: 0,
        renderTime: 0,
        numBuffers: 0,
        usedBuffers: 0,
    };

    ui: UI = new UI(this);
    renderer: Renderer;
    camera: Camera;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.camera = new Camera(this.renderer.getDisplaySize());
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    removeEntity(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) this.entities.splice(index, 1);
        this.selectedEntityIndex = -1;
    }

    update(delta: number) {
        this.surfaces = this.entities.map((e) => e.surfaces).flat();
        this.lightRays = this.entities.map((e) => e.lightRays).flat();

        let totalLightBounces = 0;
        let maxLightBounces = 0;

        const timerStart = performance.now();

        for (let l of this.lightRays) {
            const lightBounces = l.trace(this.surfaces);

            if (lightBounces > maxLightBounces) maxLightBounces = lightBounces;
            totalLightBounces += lightBounces;
        }

        const timerEnd = performance.now();
        const lightTraceTime = timerEnd - timerStart;

        // Update stats
        this.stats.frameTime = delta;
        this.stats.entities = this.entities.length;
        this.stats.lightRays = this.lightRays.length;
        this.stats.surfaces = this.surfaces.length;
        this.stats.totalLightBounces = totalLightBounces;
        this.stats.maxLightBounces = maxLightBounces;
        this.stats.lightTraceTime = lightTraceTime;
    }

    handleMouseDown(mousePos: Vector, button: MouseEvent["button"]) {
        // const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);
        const worldMousePos = this.camera.screenSpaceToWorldSpace(mousePos);

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
        this.lastMousePos = mousePos.copy();
    }

    handleMouseMove(mousePos: Vector) {
        if (this.isMouseDown) {
            this.handleDrag(mousePos);
        } else {
            // Calculate mouse position in world space
            // const worldMousePos = Vector.sub(mousePos, this.worldOffset).div(this.worldScale);
            const worldMousePos = this.camera.screenSpaceToWorldSpace(mousePos);
            // Check if mouse is hovering over an entity to draw AABBs
            for (let e of this.entities) {
                e.displayBounds = e.bounds.has(worldMousePos);
            }
        }
        this.lastMousePos = mousePos.copy();
    }

    handleDrag(mousePos: Vector) {
        const worldMousePos = this.camera.screenSpaceToWorldSpace(mousePos);
        const lastWorldMousePos = this.camera.screenSpaceToWorldSpace(this.lastMousePos);
        const worldDeltaMousePos = Vector.sub(worldMousePos, lastWorldMousePos);

        // If no entity is selected then we are dragging the world space
        if (this.selectedEntityIndex === -1) {
            this.camera.translate(worldDeltaMousePos.mult(-1));
            return;
        }

        // At this point some entity is selected
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

        this.camera.setZoom(this.camera.zoom * scaleFactor);

        const worldMousePos = this.camera.screenSpaceToWorldSpace(this.lastMousePos);
        const dx = (worldMousePos.x - this.camera.pos.x) * (scaleFactor - 1);
        const dy = (worldMousePos.y - this.camera.pos.y) * (scaleFactor - 1);

        this.camera.translate(V(dx, dy));
    }

    render() {
        const timerStart = performance.now();

        // Canvas transformations
        // ctx.save();
        // ctx.translate(this.worldOffset.x, this.worldOffset.y);
        // ctx.scale(this.worldScale, this.worldScale);

        // ctx.lineWidth = 2;
        // ctx.globalCompositeOperation = "lighter";
        // Render light rays
        // ctx.beginPath();
        for (let lightRay of this.lightRays) lightRay.render(this.renderer);
        // const brightness = 150;
        // ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 1)`;
        // ctx.closePath();

        // Render entities
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(this.renderer, this.selectedEntityIndex == i);
        }

        // Restore default canvas transformations
        // ctx.restore();

        const timerEnd = performance.now();
        this.stats.renderTime = timerEnd - timerStart;
        this.stats.usedBuffers = (this.renderer as WebGL2Renderer).currentBufferIndex + 1;
        this.stats.numBuffers = (this.renderer as WebGL2Renderer).buffers.length;
    }
}
