import ConcaveLens from "../entities/ConcaveLens";
import ConvexLens from "../entities/ConvexLens";
import Entity from "../entities/Entity";
import Vector from "../lib/Vector";
import { Attribute, AttributeType } from "./Attribute";

const entities = [ConcaveLens, ConvexLens];

export default class UI {
    entityAddDiv: HTMLElement;
    entityAttributesDiv: HTMLElement;
    selectedEntity: Entity | null = null;

    constructor() {
        console.log(entities);

        this.entityAddDiv = document.getElementById("entity-creation")!;

        this.entityAttributesDiv = document.getElementById("entity-attributes")!;
    }

    selectEntity(entity: Entity): void {
        this.selectedEntity = entity;
        this.entityAttributesDiv.innerHTML = entity.name + "<br/>";
        this.createEntityAttributesDOM(entity);
    }

    createEntityAttributesDOM(entity: Entity) {
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
