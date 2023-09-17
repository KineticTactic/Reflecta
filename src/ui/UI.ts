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
            world.addEntity(new entities[ev.index[1] * 2 + ev.index[0]].constructorFunc(new Vector(0, 0)));
        });

        const statsFolder = this.pane.addFolder({
            title: "Stats",
            expanded: false,
        });
        statsFolder.addBinding(world.stats, "entities", { readonly: true });
        statsFolder.addBinding(world.stats, "lightRays", { readonly: true, label: "light rays" });
        statsFolder.addBinding(world.stats, "surfaces", { readonly: true });
        statsFolder.addBinding(world.stats, "totalLightBounces", { readonly: true, label: "total bounces" });
        statsFolder.addBinding(world.stats, "maxLightBounces", { readonly: true, label: "max bounces" });
        statsFolder.addBinding(world.stats, "lightTraceTime", { readonly: true, label: "trace time(ms)" });
        statsFolder.addBinding(world.stats, "lightTraceTime", { readonly: true, label: " ", view: "graph" });
        statsFolder.addBinding(world.stats, "renderTime", { readonly: true, label: "render time(ms)" });
        statsFolder.addBinding(world.stats, "renderTime", { readonly: true, label: " ", view: "graph" });
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
