import World from "../core/World";
import Entity from "../core/Entity";
import Vector from "../lib/Vector";
import { Attribute, AttributeType } from "./Attribute";

import entities from "../entities/entityList";

export default class UI {
    entityAddDiv: HTMLElement;
    entityAttributesDiv: HTMLElement;
    selectedEntity: Entity | null = null;
    world: World;

    constructor(world: World) {
        this.world = world;

        this.entityAddDiv = document.getElementById("entity-creation")!;

        this.entityAttributesDiv = document.getElementById("entity-attributes")!;

        for (const entity of entities) {
            const button = document.createElement("button");
            button.innerText = entity.name;
            button.addEventListener("click", () => {
                world.addEntity(new entity.constructorFunc(new Vector(0, 0)));
            });
            this.entityAddDiv.appendChild(button);
        }
    }

    selectEntity(entity: Entity): void {
        console.log("Yes");
        console.trace();

        this.selectedEntity = entity;
        this.entityAttributesDiv.innerHTML = entity.name + "<br/>";

        this.createEntityAttributesDOM(entity);
    }

    deselectEntity() {
        this.selectedEntity = null;
        this.entityAttributesDiv.innerHTML = "";
    }

    createEntityAttributesDOM(entity: Entity) {
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => {
            this.world.removeEntity(this.selectedEntity!);
            this.deselectEntity();
        });
        this.entityAttributesDiv.appendChild(deleteButton);

        console.log(entity.attributes);

        for (const attr of entity.attributes) {
            const domElement = this.createAttributeDOM(entity, attr);
            this.entityAttributesDiv.appendChild(domElement);
        }
    }

    createAttributeDOM(entity: Entity, attr: Attribute): HTMLDivElement {
        console.log(this.selectEntity);

        const div = document.createElement("div");
        div.className = "attribute";

        const label = document.createElement("label");
        label.innerText = attr.name;
        div.appendChild(label);

        switch (attr.type) {
            case AttributeType.Vector:
                const vector = entity[attr.name as keyof Entity] as Vector;
                console.log(attr.name);

                let xInputElement: HTMLInputElement;
                xInputElement = document.createElement("input");
                xInputElement.type = "number";
                xInputElement.value = vector.x.toString();

                const xInputContainerElement = document.createElement("div");
                xInputContainerElement.className = "input-container vector-x";
                xInputContainerElement.appendChild(xInputElement);

                let yInputElement: HTMLInputElement;
                yInputElement = document.createElement("input");
                yInputElement.type = "number";
                yInputElement.value = vector.y.toString();

                const yInputContainerElement = document.createElement("div");
                yInputContainerElement.className = "input-container vector-y";
                yInputContainerElement.appendChild(yInputElement);

                div.appendChild(xInputContainerElement);
                div.appendChild(yInputContainerElement);

                xInputElement.addEventListener("input", (e) => {
                    const vectorValue = new Vector(parseFloat((e.target as HTMLInputElement).value), parseFloat(yInputElement.value));
                    entity.updateAttribute(attr.name, vectorValue);
                });

                yInputElement.addEventListener("input", (e) => {
                    const vectorValue = new Vector(parseFloat((e.target as HTMLInputElement).value), parseFloat(yInputElement.value));
                    entity.updateAttribute(attr.name, vectorValue);
                });

                break;

            case AttributeType.Boolean:
                const checkboxElement = document.createElement("input");
                checkboxElement.type = "checkbox";
                checkboxElement.checked = entity[attr.name as keyof Entity] as boolean;

                const checkboxContainerElement = document.createElement("div");
                checkboxContainerElement.className = "input-container";
                checkboxContainerElement.appendChild(checkboxElement);

                div.appendChild(checkboxContainerElement);

                checkboxElement.addEventListener("input", (e) => {
                    entity.updateAttribute(attr.name, (e.target as HTMLInputElement).checked);
                });
                break;

            default:
                const inputElement = document.createElement("input");
                inputElement.type = attr.type;
                inputElement.value = entity[attr.name as keyof Entity].toString();

                const inputContainerElement = document.createElement("div");
                inputContainerElement.className = "input-container";
                inputContainerElement.appendChild(inputElement);

                div.appendChild(inputContainerElement);

                inputElement.addEventListener("input", (e) => {
                    entity.updateAttribute(attr.name, (e.target as HTMLInputElement).value);
                });

                break;
        }

        return div;
    }
}
