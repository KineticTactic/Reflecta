import World from "../core/World";
import Entity from "../core/Entity";
import * as tp from "tweakpane";
import * as tpEssentials from "@tweakpane/plugin-essentials";

import examples from "../examples/examples";
import entities from "../entities/entityList";
import Settings, { resetSettings } from "../core/Settings";
import { SaveState } from "../util/SaveState";
import { CaptureCanvas } from "../util/CaptureCanvas";

export default class UI {
    selectedEntity: Entity | null = null;
    world: World;

    pane: tp.Pane;
    attribFolder: tp.FolderApi | null = null;

    constructor(world: World) {
        this.world = world;

        this.initHTMLElements();

        // Create a new pane instance
        this.pane = new tp.Pane({
            container: document.getElementById("tweakpane-container") as HTMLElement,
        });
        this.pane.registerPlugin(tpEssentials);

        this.createAddEntityFolder();
        this.createWorldFolder();
        this.createDebugFolder();
    }

    initHTMLElements() {
        document.getElementById("copy-link")!.addEventListener("click", () => {
            const encoded = SaveState.encodeWorld(this.world);
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?state=${encoded}`);
        });

        document.getElementById("capture")!.addEventListener("click", () => {
            CaptureCanvas.captureFlag = true;
        });

        const openLeftBarBtn = document.getElementById("open-left-bar-btn") as HTMLButtonElement;
        const closeLeftBarBtn = document.getElementById("close-left-bar-btn") as HTMLButtonElement;
        const leftBarDiv = document.getElementById("left-bar") as HTMLDivElement;

        openLeftBarBtn.addEventListener("click", () => {
            leftBarDiv.style.display = "block";
            openLeftBarBtn.style.display = "none";
        });

        closeLeftBarBtn.addEventListener("click", () => {
            leftBarDiv.style.display = "none";
            openLeftBarBtn.style.display = "block";
        });

        const exampleListDiv = document.getElementById("example-list") as HTMLDivElement;
        for (const example of examples) {
            const exampleDiv = document.createElement("div");
            exampleDiv.classList.add("example");

            const exampleImg = document.createElement("img");
            exampleImg.src = `./examples/${example.img}`;
            exampleImg.alt = example.name;
            exampleDiv.appendChild(exampleImg);

            const exampleName = document.createElement("div");
            exampleName.classList.add("name");
            exampleName.innerText = example.name;
            exampleDiv.appendChild(exampleName);

            exampleDiv.addEventListener("click", () => {
                this.world.reset();
                this.world.entities = [];
                resetSettings();
                example.init(this.world);
                this.deselectEntity();
                leftBarDiv.style.display = "none";
                openLeftBarBtn.style.display = "block";
            });

            exampleListDiv.appendChild(exampleDiv);
        }
    }

    createAddEntityFolder() {
        const addEntityFolder = this.pane.addFolder({
            title: "Add Entities",
            expanded: window.innerWidth > 800,
        });

        // Add all entities in a grid of buttons
        const buttonGrid = addEntityFolder.addBlade({
            view: "buttongrid",
            size: [2, Math.ceil(entities.length / 2)], // columns (2) x rows (as many required)
            // Convert x,y coordinates to index in entities array
            // If we have odd number of entities, index will be out of bounds, so in that case we return a dummy entity
            cells: (x: number, y: number) => ({ title: y * 2 + x < entities.length ? entities[y * 2 + x].name : "*" }),
        }) as tpEssentials.ButtonGridApi;

        buttonGrid.on("click", (ev) => {
            this.world.addEntity(new entities[ev.index[1] * 2 + ev.index[0]].constructorFunc({}));
        });
    }

    createWorldFolder() {
        const worldFolder = this.pane.addFolder({
            title: "World settings",
            expanded: false,
        });

        worldFolder.addBinding(Settings, "calculateReflectance", { label: "calculate reflectance" }).on("change", () => this.world.setDirty());
        worldFolder
            .addBinding(Settings, "reflectanceFactor", { label: "reflectance factor", min: 0.01, max: 10, step: 0.01 })
            .on("change", () => this.world.setDirty());
        worldFolder
            .addBinding(Settings, "secondaryLightIntensityLimit", { label: "secondary light intensity limit", min: 0.001, step: 0.1 })
            .on("change", () => this.world.setDirty());
        worldFolder
            .addBinding(Settings, "secondaryLightDepthLimit", { label: "secondary light depth limit", min: 1, max: 100, step: 1 })
            .on("change", () => this.world.setDirty());
        worldFolder
            .addBinding(Settings, "maxLightBounceLimit", { min: 0, max: 100, step: 1, label: "light bounce limit" })
            .on("change", () => this.world.setDirty());
        worldFolder
            .addBinding(Settings, "dispersionFactor", { min: 0, max: 1, step: 0.01, label: "dispersion factor" })
            .on("change", () => this.world.setDirty());
        worldFolder.addBinding(Settings, "lightRayRenderWidth", { min: 1, max: 10, step: 0.1, label: "light ray width" });
        worldFolder.addBinding(Settings, "surfaceRenderWidth", { min: 1, max: 10, step: 0.1, label: "surface width" });
    }

    createDebugFolder() {
        const debugFolder = this.pane.addFolder({
            title: "Debug stats",
            expanded: false,
        });
        debugFolder.addBinding(this.world.stats, "frameTime", { readonly: true, label: "frame time" });
        debugFolder.addBinding(this.world.stats, "entities", { readonly: true });
        debugFolder.addBinding(this.world.stats, "lightRays", { readonly: true, label: "light rays" });
        debugFolder.addBinding(this.world.stats, "surfaces", { readonly: true });
        debugFolder.addBinding(this.world.stats, "totalLightBounces", { readonly: true, label: "total bounces" });
        debugFolder.addBinding(this.world.stats, "maxLightBounces", { readonly: true, label: "max bounces" });
        debugFolder.addBinding(this.world.stats, "lightTraceTime", { readonly: true, label: "trace time(ms)" });
        debugFolder.addBinding(this.world.stats, "lightTraceTime", { readonly: true, label: " ", view: "graph" });
        debugFolder.addBinding(this.world.stats, "renderTime", { readonly: true, label: "render time(ms)" });
        debugFolder.addBinding(this.world.stats, "renderTime", { readonly: true, label: " ", view: "graph" });
        debugFolder.addBinding(this.world.stats, "numBuffers", { readonly: true, label: "buffer count" });
        debugFolder.addBinding(this.world.stats, "usedBuffers", { readonly: true, label: "used buffers" });
        debugFolder.addButton({ title: "Copy Scene Code" }).on("click", () => {
            const code = SaveState.getCurrentSceneCode(this.world);
            navigator.clipboard.writeText(code);
        });
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

        this.attribFolder.addBinding(entity, "pos", { label: "position" }).on("change", () => entity.updatePositionUI());

        this.attribFolder.addBinding(entity, "rot", { label: "rotation" }).on("change", () => entity.updateRotationUI());

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
