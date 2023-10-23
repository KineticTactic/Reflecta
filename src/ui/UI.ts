import World from "../core/World";
import Entity from "../core/Entity";
import * as tp from "tweakpane";
import * as tpEssentials from "@tweakpane/plugin-essentials";

import entities from "../entities/entityList";
import Settings from "../core/Settings";
import { SaveState } from "../util/SaveState";
import { CaptureCanvas } from "../util/CaptureCanvas";

export default class UI {
    selectedEntity: Entity | null = null;
    world: World;

    pane: tp.Pane;
    attribFolder: tp.FolderApi | null = null;

    copyLinkBtn: HTMLButtonElement;
    captureBtn: HTMLButtonElement;

    constructor(world: World) {
        this.world = world;

        // HTML Elements
        this.copyLinkBtn = document.getElementById("copy-link") as HTMLButtonElement;
        this.captureBtn = document.getElementById("capture") as HTMLButtonElement;
        this.copyLinkBtn.addEventListener("click", () => {
            const encoded = SaveState.encodeWorld(this.world);
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?state=${encoded}`);
        });
        this.captureBtn.addEventListener("click", () => {
            CaptureCanvas.captureFlag = true;
        });

        // Create a new pane instance
        this.pane = new tp.Pane({
            container: document.getElementById("tweakpane-container") as HTMLElement,
        });
        this.pane.registerPlugin(tpEssentials);

        const addEntityFolder = this.pane.addFolder({
            title: "Add Entities",
            expanded: window.innerWidth > 800,
        });

        // Add all entities in a grid of buttons
        (
            addEntityFolder.addBlade({
                view: "buttongrid",
                size: [2, Math.ceil(entities.length / 2)], // columns (2) x rows (as many required)
                // Conver x,y coordinates to index in entities array
                // If we have odd number of entities, index will be out of bounds, so in that case we return a dummy entity
                cells: (x: number, y: number) => ({ title: y * 2 + x < entities.length ? entities[y * 2 + x].name : "*" }),
            }) as tpEssentials.ButtonGridApi
        ).on("click", (ev) => {
            world.addEntity(new entities[ev.index[1] * 2 + ev.index[0]].constructorFunc({}));
        });

        const worldFolder = this.pane.addFolder({
            title: "World settings",
            expanded: false,
        });

        worldFolder.addBinding(Settings, "calculateReflectance", { label: "calculate reflectance" }).on("change", () => {
            world.setDirty();
        });
        worldFolder.addBinding(Settings, "reflectanceFactor", { label: "reflectance factor", min: 0.01, max: 10, step: 0.01 }).on("change", () => {
            world.setDirty();
        });
        worldFolder
            .addBinding(Settings, "secondaryLightIntensityLimit", { label: "secondary light intensity limit", min: 0.001, step: 0.1 })
            .on("change", () => {
                world.setDirty();
            });
        worldFolder.addBinding(Settings, "secondaryLightDepthLimit", { label: "secondary light depth limit", min: 1, max: 100, step: 1 }).on("change", () => {
            world.setDirty();
        });
        worldFolder.addBinding(Settings, "maxLightBounceLimit", { min: 0, max: 100, step: 1, label: "light bounce limit" }).on("change", () => {
            world.setDirty();
        });
        worldFolder.addBinding(Settings, "dispersionFactor", { min: 0, max: 1, step: 0.01, label: "dispersion factor" }).on("change", () => {
            world.setDirty();
        });
        worldFolder.addBinding(Settings, "lightRayRenderWidth", { min: 1, max: 10, step: 0.1, label: "light ray width" });
        worldFolder.addBinding(Settings, "surfaceRenderWidth", { min: 1, max: 10, step: 0.1, label: "surface width" });

        const statsFolder = this.pane.addFolder({
            title: "Debug stats",
            expanded: false,
        });
        statsFolder.addBinding(world.stats, "frameTime", { readonly: true, label: "frame time" });
        statsFolder.addBinding(world.stats, "entities", { readonly: true });
        statsFolder.addBinding(world.stats, "lightRays", { readonly: true, label: "light rays" });
        statsFolder.addBinding(world.stats, "surfaces", { readonly: true });
        statsFolder.addBinding(world.stats, "totalLightBounces", { readonly: true, label: "total bounces" });
        statsFolder.addBinding(world.stats, "maxLightBounces", { readonly: true, label: "max bounces" });
        statsFolder.addBinding(world.stats, "lightTraceTime", { readonly: true, label: "trace time(ms)" });
        statsFolder.addBinding(world.stats, "lightTraceTime", { readonly: true, label: " ", view: "graph" });
        statsFolder.addBinding(world.stats, "renderTime", { readonly: true, label: "render time(ms)" });
        statsFolder.addBinding(world.stats, "renderTime", { readonly: true, label: " ", view: "graph" });
        statsFolder.addBinding(world.stats, "numBuffers", { readonly: true, label: "buffer count" });
        statsFolder.addBinding(world.stats, "usedBuffers", { readonly: true, label: "used buffers" });
    }

    selectEntity(entity: Entity): void {
        this.selectedEntity = entity;
        this.createEntityAttributesFolder(entity);
    }

    deselectEntity() {
        this.selectedEntity = null;
        console.log("YAS");

        if (this.attribFolder) this.attribFolder.dispose();
    }

    createEntityAttributesFolder(entity: Entity) {
        if (this.attribFolder) this.pane.remove(this.attribFolder);

        this.attribFolder = this.pane.addFolder({
            title: entity.name,
            expanded: window.innerWidth > 800,
        });

        this.attribFolder.addButton({ title: "Delete Entity" }).on("click", () => {
            this.world.removeEntity(entity);
            this.deselectEntity();
        });

        this.attribFolder.addBinding(entity, "pos", { label: "position" }).on("change", () => {
            entity.updatePositionUI();
        });

        this.attribFolder.addBinding(entity, "rot", { label: "rotation" }).on("change", () => {
            entity.updateRotationUI();
        });

        this.attribFolder.addBinding(entity, "color", { label: "color" });

        for (const [_, attr] of Object.entries(entity.attribs)) {
            if (attr.show && !attr.show()) {
                continue;
            }

            this.attribFolder
                .addBinding(attr, "value", {
                    label: attr.name,
                    min: attr.min,
                    max: attr.max,
                    step: attr.step,
                })
                .on("change", (ev) => {
                    entity.isDirty = true;

                    if (attr.onchange) {
                        const ret = attr.onchange(ev.value);

                        // If it returns a true value, we refresh the UI
                        if (ret) {
                            this.createEntityAttributesFolder(entity);
                            return;
                        }
                    }
                    this.refresh();
                });
        }
    }

    refresh() {
        this.attribFolder?.refresh();
    }
}
