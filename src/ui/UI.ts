import { Color } from "polyly";
import World from "../core/World";
import Entity from "../core/Entity";
import * as tp from "tweakpane";
import * as tpEssentials from "@tweakpane/plugin-essentials";

import examples from "../examples/examples";
import entities from "../entities/entityList";
import Settings, { resetSettings } from "../core/Settings";
import { SaveState } from "../util/SaveState";
import { CaptureCanvas } from "../util/CaptureCanvas";
import Surface from "../primitives/Surface";

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
        this.createSimulationOptionsFolder();
        this.createDisplayOptionsFolder();
        this.createDebugFolder();
    }

    initHTMLElements() {
        document.getElementById("copy-link")!.addEventListener("click", () => {
            const encoded = SaveState.encodeWorld(this.world);
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?state=${encoded}`);
            document.getElementById("copy-link")!.children[0].classList.add("copied");
            document.getElementById("copy-link")!.children[0].innerHTML = "Copied to clipboard!";
            setTimeout(() => {
                document.getElementById("copy-link")!.children[0].classList.remove("copied");
                document.getElementById("copy-link")!.children[0].innerHTML = "Share Current Scene";
            }, 2000);
        });

        document.getElementById("capture")!.addEventListener("click", () => {
            CaptureCanvas.captureFlag = true;
        });

        const openLeftBarBtn = document.getElementById("open-left-bar-btn") as HTMLButtonElement;
        const closeLeftBarBtn = document.getElementById("close-left-bar-btn") as HTMLButtonElement;
        const leftBarDiv = document.getElementById("left-bar") as HTMLDivElement;

        openLeftBarBtn.addEventListener("click", () => {
            // leftBarDiv.style.display = "block";
            leftBarDiv.classList.toggle("hidden");
            openLeftBarBtn.style.display = "none";
        });

        closeLeftBarBtn.addEventListener("click", () => {
            leftBarDiv.classList.toggle("hidden");
            // leftBarDiv.style.display = "none";
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
                this.pane.refresh();
                leftBarDiv.classList.toggle("hidden");
                openLeftBarBtn.style.display = "block";
            });

            exampleListDiv.appendChild(exampleDiv);
        }

        const entityButtons = document.querySelectorAll(".entity-list-container button");
        for (const button of entityButtons) {
            button.addEventListener("click", () => {
                const entityData = entities.find((dat) => dat.name === (button as HTMLElement).dataset.name);

                if (!entityData) {
                    console.error("Entity not found");
                    alert("Entity not found");
                    return;
                }

                const entity = new entityData.constructorFunc({});
                this.world.addEntity(entity);
            });
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

    createSimulationOptionsFolder() {
        const simOptionsFolder = this.pane.addFolder({
            title: "Simulation Options",
            expanded: false,
        });

        simOptionsFolder
            .addBinding(Settings, "calculateReflectance", { label: "calculate reflectance" })
            .on("change", () => this.world.setDirty());
        simOptionsFolder
            .addBinding(Settings, "reflectanceFactor", { label: "reflectance factor", min: 0.01, max: 10, step: 0.01 })
            .on("change", () => this.world.setDirty());
        simOptionsFolder
            .addBinding(Settings, "secondaryLightIntensityLimit", { label: "secondary light intensity limit", min: 0.001, step: 0.1 })
            .on("change", () => this.world.setDirty());
        simOptionsFolder
            .addBinding(Settings, "secondaryLightDepthLimit", { label: "secondary light depth limit", min: 1, max: 100, step: 1 })
            .on("change", () => this.world.setDirty());
        simOptionsFolder
            .addBinding(Settings, "maxLightBounceLimit", { min: 0, max: 100, step: 1, label: "light bounce limit" })
            .on("change", () => this.world.setDirty());
        simOptionsFolder
            .addBinding(Settings, "dispersionFactor", { min: 0, max: 1, step: 0.01, label: "dispersion factor" })
            .on("change", () => this.world.setDirty());
    }

    createDisplayOptionsFolder() {
        const displayOptionsFolder = this.pane.addFolder({
            title: "Display Options",
            expanded: false,
        });

        displayOptionsFolder.addBinding(Settings, "showGrid", { label: "show grid" });
        displayOptionsFolder.addBinding(Settings, "gridSize", { min: 1, max: 1000, step: 10, label: "grid size" });
        displayOptionsFolder.addBinding(Settings, "gridDivisions", { min: 1, max: 20, step: 1, label: "grid divisions" });
        displayOptionsFolder.addBinding(Settings, "lightRayRenderWidth", { min: 1, max: 10, step: 0.1, label: "light ray width" });
        displayOptionsFolder
            .addBinding(Settings, "surfaceRenderWidth", { min: 1, max: 10, step: 0.1, label: "surface width" })
            .on("change", () => (Surface.surfaceRenderWidth = Settings.surfaceRenderWidth));
        displayOptionsFolder.addBinding(Settings, "glassOpacity", { min: 0, max: 1, step: 0.01, label: "glass opacity" });
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
            entity.removeDraggables();
            this.world.removeEntity(entity);
            this.deselectEntity();
        });

        this.attribFolder.addBinding(entity, "pos", { label: "position" }).on("change", () => entity.updatePositionUI());

        this.attribFolder.addBinding(entity, "rot", { label: "rotation" }).on("change", () => entity.updateRotationUI());

        // Certain entities like light sources dont need colour attribute
        if (!(entity.constructor as typeof Entity).entityData?.disableColor) {
            this.attribFolder
                .addBinding(entity, "color", { label: "color" })
                .on("change", () => (entity.color = new Color(entity.color.r, entity.color.g, entity.color.b, 255)));
        }

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
        // console.log("Refresh");

        this.attribFolder?.refresh();
    }
}
