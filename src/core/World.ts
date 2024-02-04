import { Vector, Renderer, Camera } from "polyly";

import Entity from "./Entity";
import LightRay, { LightRayTraceInfo } from "../primitives/LightRay";
import Surface from "../primitives/Surface";
import UI from "../ui/UI";
import Settings from "./Settings";
import { Draggable } from "../util/Draggable";
import Grid from "../util/Grid";

export enum State {
    NONE,
    MOVE_CAMERA,
    MOVE_ENTITY,
    ROTATE_ENTITY,
    MOVE_DRAGGABLE,
}

export default class World {
    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];
    entities: Entity[] = [];

    selectedEntityIndex: number = -1;
    selectedDraggable: Draggable | null = null;

    draggingEntityPos: Vector = Vector.zero();
    draggingEntityRot: number = 0;

    lastMousePos: Vector = Vector.zero();

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
    state: State = State.NONE;

    isDirty: boolean = true;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.camera = new Camera(this.renderer.getDisplaySize());
        this.renderer.camera = this.camera; ///TODO: Uset setCamera or something
        this.setDirty();
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    removeEntity(entity: Entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) this.entities.splice(index, 1);
        this.selectedEntityIndex = -1;
        this.setDirty();
    }

    update(delta: number) {
        this.isDirty = this.isDirty || this.entities.reduce((prev, curr) => prev || curr.isDirty, false);

        // We only update the Light rays and retrace them IF anything in the world has changed
        if (this.isDirty) {
            const timerStart = performance.now();

            // All the surfaces and light rays from each entity are pooled into one big array
            this.surfaces = this.entities.map((e) => e.surfaces).flat();
            this.lightRays = this.entities.map((e) => e.lightRays).flat();

            // Keep track of these to show them in the stats window
            let totalLightBounces = 0;
            let maxLightBounces = 0;

            /* Here's how the ray tracing works:
                1. Loop over all the "primary" rays (those present in entities) and trace them
                2. The trace function returns a list of "newRays" which are secondary light rays
                    which are to be added after the primary rays are traced. These are stored in 
                    "bufferLightRays"
                3. Keep track of the current length of lightRays
                4. Add the contents of the bufferLightRays to the main lightRays array and clear 
                    the buffer array
                5. Now trace the rays present in the main lightRays array starting from "startIndex"
                6. Repeat from step 2 onwards UNTIL no new rays are added (bufferLightRays.length == 0)
                    OR we have looped more than the limit Settings.secondaryLightDepthLimit
                7. At the end the lightRays array will be populated with every single light ray
            */

            let startIndex = 0;
            let traceDepth = 0;
            let bufferLightRays: LightRay[] = [];

            do {
                traceDepth++;

                this.lightRays.push(...bufferLightRays);
                bufferLightRays = [];

                for (let i = startIndex; i < this.lightRays.length; i++) {
                    const lightTraceInfo: LightRayTraceInfo = this.lightRays[i].trace(this.surfaces);

                    if (lightTraceInfo.newRays.length > 0) bufferLightRays.push(...lightTraceInfo.newRays);

                    if (lightTraceInfo.lightBounces > maxLightBounces) maxLightBounces = lightTraceInfo.lightBounces;
                    totalLightBounces += lightTraceInfo.lightBounces;
                }

                startIndex = this.lightRays.length;
            } while (bufferLightRays.length > 0 && traceDepth < Settings.secondaryLightDepthLimit && Settings.calculateReflectance);

            const timerEnd = performance.now();
            const lightTraceTime = timerEnd - timerStart;

            // Update stats
            this.stats.entities = this.entities.length;
            this.stats.lightRays = this.lightRays.length;
            this.stats.surfaces = this.surfaces.length;
            this.stats.totalLightBounces = totalLightBounces;
            this.stats.maxLightBounces = maxLightBounces;
            this.stats.lightTraceTime = lightTraceTime;
        }

        for (let e of this.entities) e.isDirty = false;
        this.isDirty = false;

        this.stats.frameTime = delta;
    }

    handleMouseDown(mousePos: Vector, button: MouseEvent["button"]) {
        this.lastMousePos = mousePos.copy();

        const worldMousePos = this.camera.screenSpaceToWorldSpace(mousePos);

        ///TODO: Objects on top of one another cant be selected, only the topmost one is selected

        // If we are clicking on a previously selected entity, then we are dragging it
        if (this.selectedEntityIndex !== -1) {
            if (this.entities[this.selectedEntityIndex].bounds.has(worldMousePos)) {
                // We clicked on the already selected entity
                this.state = button === 0 ? State.MOVE_ENTITY : State.ROTATE_ENTITY;
                return;
            }

            // We clicked somewhere else, so deselect currently selected entity and remove its draggables
            this.entities[this.selectedEntityIndex].removeDraggables();
            this.entities[this.selectedEntityIndex].displayBounds = false;
            this.ui.deselectEntity();
        }

        this.selectedEntityIndex = -1;

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].bounds.has(worldMousePos)) {
                // We selected some entity
                this.selectedEntityIndex = i;
                this.entities[i].createDraggables(this);
                this.ui.selectEntity(this.entities[i]);

                this.state = button === 0 ? State.MOVE_ENTITY : State.ROTATE_ENTITY;
                this.draggingEntityPos = this.entities[i].pos.copy();
                this.draggingEntityRot = this.entities[i].rot;
                return;
            }
        }

        // If we didnt select any entity, then we are dragging the world space
        this.state = State.MOVE_CAMERA;
    }

    handleMouseMove(mousePos: Vector, ctrlKey: boolean) {
        const worldMousePos = this.camera.screenSpaceToWorldSpace(mousePos);
        const lastWorldMousePos = this.camera.screenSpaceToWorldSpace(this.lastMousePos);
        const worldDeltaMousePos = Vector.sub(worldMousePos, lastWorldMousePos);

        switch (this.state) {
            case State.MOVE_DRAGGABLE:
                if (!this.selectedDraggable) return;
                this.selectedDraggable.setScreenPos(mousePos);
                this.selectedDraggable.onMoveFunc(this.selectedDraggable.pos);
                this.ui.refresh();
                break;

            case State.MOVE_CAMERA:
                this.camera.translate(worldDeltaMousePos.mult(-1));
                break;

            case State.MOVE_ENTITY:
                this.draggingEntityPos.add(worldDeltaMousePos);
                if (ctrlKey) {
                    this.entities[this.selectedEntityIndex].pos = new Vector(
                        Math.ceil(this.draggingEntityPos.x / Grid.minorGridSize) * Grid.minorGridSize,
                        Math.ceil(this.draggingEntityPos.y / Grid.minorGridSize) * Grid.minorGridSize
                    );
                } else {
                    this.entities[this.selectedEntityIndex].translate(worldDeltaMousePos);
                }
                this.ui.refresh();
                break;

            case State.ROTATE_ENTITY:
                const originToLastMousePos = Vector.sub(lastWorldMousePos, this.entities[this.selectedEntityIndex].pos);
                const originToMousePos = Vector.sub(worldMousePos, this.entities[this.selectedEntityIndex].pos);
                let angle = Vector.angleBetween(originToLastMousePos, originToMousePos);

                this.draggingEntityRot += angle;
                if (ctrlKey) {
                    const angleSnap = Math.PI / 24;
                    this.entities[this.selectedEntityIndex].setRotation(Math.ceil(this.draggingEntityRot / angleSnap) * angleSnap);
                } else {
                    this.entities[this.selectedEntityIndex].rotate(angle);
                }
                this.ui.refresh();
                break;

            case State.NONE: // Draw bounding boxes if mouse is over any entity
                if (this.selectedEntityIndex !== -1 && this.entities[this.selectedEntityIndex].bounds.has(worldMousePos)) break;
                for (let e of this.entities) {
                    e.displayBounds = e.bounds.has(worldMousePos);
                    if (e.displayBounds) break;
                }
        }

        this.lastMousePos = mousePos.copy();
    }

    handleMouseUp(_mousePos: Vector) {
        this.state = State.NONE;
        this.selectedDraggable = null;
    }

    handleMouseWheel(delta: number) {
        let scaleFactor = 0.8;
        scaleFactor = delta > 0 ? 1 / scaleFactor : scaleFactor;
        this.camera.setZoom(this.camera.zoom * scaleFactor);

        const worldMousePos = this.camera.screenSpaceToWorldSpace(this.lastMousePos);
        const dx = (worldMousePos.x - this.camera.pos.x) * (scaleFactor - 1);
        const dy = (worldMousePos.y - this.camera.pos.y) * (scaleFactor - 1);
        this.camera.translate(new Vector(dx, dy));

        if (this.selectedEntityIndex !== -1) this.entities[this.selectedEntityIndex].updateDraggables();
    }

    render() {
        const timerStart = performance.now();

        Grid.render(this, this.renderer);

        for (let lightRay of this.lightRays) lightRay.render(this.renderer);

        // Render entities
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(this.renderer, this.selectedEntityIndex == i);
        }

        const timerEnd = performance.now();
        this.stats.renderTime = timerEnd - timerStart;

        ///TODO: UNCOMMENT
        // this.stats.usedBuffers = this.renderer.currentBufferIndex + 1;
        // this.stats.numBuffers = this.renderer.buffers.length;
    }

    setDirty() {
        this.isDirty = true;
    }

    reset() {
        for (const e of this.entities) e.removeDraggables();
        this.entities = [];
        this.lightRays = [];
        this.surfaces = [];
        this.selectedEntityIndex = -1;
        this.selectedDraggable = null;
        this.state = State.NONE;
        this.setDirty();
    }
}
