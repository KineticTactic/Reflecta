import World from "../core/World";
import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import * as tp from "tweakpane";
import * as tpEssentials from "@tweakpane/plugin-essentials";

import entities from "../entities/entityList";

export default class UI {
    selectedEntity: Entity | null = null;
    world: World;

    pane: tp.Pane;
    attribFolder: tp.FolderApi | null = null;

    constructor(world: World) {
        this.world = world;

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
            world.addEntity(new entities[ev.index[1] * 2 + ev.index[0]].constructorFunc(new Vector(0, 0), 0));
        });

        const worldFolder = this.pane.addFolder({
            title: "World settings",
            expanded: false,
        });

        worldFolder
            .addBinding(world.settings, "maxLightBounceLimit", { min: 0, max: 100, step: 1, label: "light bounce limit" })
            .on("change", world.updateSettings);
        worldFolder.addBinding(world.settings, "dispersionFactor", { min: 0, max: 1, step: 0.01, label: "dispersion factor" }).on("change", () => {
            world.updateSettings();
        });
        worldFolder.addBinding(world.settings, "lightRayRenderWidth", { min: 1, max: 10, step: 0.1, label: "light ray width" }).on("change", () => {
            world.updateSettings();
        });
        worldFolder.addBinding(world.settings, "surfaceRenderWidth", { min: 1, max: 10, step: 0.1, label: "surface width" }).on("change", () => {
            world.updateSettings();
        });

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
        if (this.attribFolder) this.attribFolder.dispose();
    }

    createEntityAttributesFolder(entity: Entity) {
        this.attribFolder = this.pane.addFolder({
            title: entity.name,
            expanded: window.innerWidth > 800,
        });

        this.attribFolder
            .addButton({
                title: "Delete Entity",
            })
            .on("click", () => {
                this.world.removeEntity(entity);
                this.deselectEntity();
            });

        for (const attr of entity.attributes) {
            this.attribFolder
                .addBinding(attr, "value", {
                    label: attr.name,
                    min: attr.min,
                    max: attr.max,
                    step: attr.step,
                })
                .on("change", (ev) => {
                    console.log(ev);
                    entity.updateAttribute(attr.name, ev.value as any);
                });
        }
    }
}
