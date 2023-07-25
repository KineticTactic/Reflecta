import Entity from "../entities/Entity";
import Vector from "../lib/Vector";
import { Attribute, AttributeType } from "./Attribute";

export default class UI {
    baseElement: HTMLElement;
    selectedEntity: Entity | null = null;

    constructor() {
        this.baseElement = document.getElementById("sidebar")!;
    }

    selectEntity(entity: Entity): void {
        this.selectedEntity = entity;
        this.baseElement.innerHTML = entity.name + "<br/>";
        this.createEntityAttributesDOM(entity);
    }

    createEntityAttributesDOM(entity: Entity) {
        console.log(entity.attributes);

        for (const attr of entity.attributes) {
            const domElement = this.createAttributeDOM(entity, attr);
            this.baseElement.appendChild(domElement);
        }
    }

    createAttributeDOM(entity: Entity, attr: Attribute): HTMLDivElement {
        console.log(this.selectEntity);

        const div = document.createElement("div");

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

                let yInputElement: HTMLInputElement;
                yInputElement = document.createElement("input");
                yInputElement.type = "number";
                yInputElement.value = vector.y.toString();

                div.appendChild(xInputElement);
                div.appendChild(yInputElement);

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

                div.appendChild(checkboxElement);

                checkboxElement.addEventListener("input", (e) => {
                    entity.updateAttribute(attr.name, (e.target as HTMLInputElement).checked);
                });
                break;

            default:
                const inputElement = document.createElement("input");
                inputElement.type = attr.type;
                inputElement.value = entity[attr.name as keyof Entity].toString();
                div.appendChild(inputElement);

                inputElement.addEventListener("input", (e) => {
                    entity.updateAttribute(attr.name, (e.target as HTMLInputElement).value);
                });

                break;
        }

        // inputElement.addEventListener("input", (e) => {
        //     // type createEnumType<T> = { [K in keyof T]: K };
        //     // type FlagsObject = createEnumType<typeof Entity>;
        //     // type FlagsKeys = keyof FlagsObject;
        //     // const keys = Object.keys(Entity) as FlagsKeys[];

        //     // const keys = Object.keys(Entity) as keyof Entity;
        //     // (entity as Record<typeof attr.name, any>)[attr.name as keyof Entity] = (e.target as HTMLInputElement).value;
        //     entity.updateAttribute(attr.name, (e.target as HTMLInputElement).value);
        // });

        return div;
    }
}
