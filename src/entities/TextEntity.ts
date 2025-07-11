import { Renderer, TextMeasurements, Vector } from "polyly";

import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";
import AABB from "../util/AABB";

export interface TextEntityOptions extends EntityOptions {
    text?: string;
    size?: number;
}

export default class TextEntity extends Entity {
    static override entityData: EntityData = {
        name: "Text",
        desc: "Text.",
        constructorFunc: TextEntity,
    };

    metrics: TextMeasurements | null = null;
    changed: boolean = true;

    constructor(options: TextEntityOptions) {
        super("Text", options);

        this.attribs.size = {
            name: "size",
            value: options.size || 100,
            type: AttributeType.Number,
            min: 1,
            max: 500,
            onchange: () => {
                this.changed = true;
            },
        };

        this.attribs.text = {
            name: "text",
            value: options.text || "Text",
            type: AttributeType.String,
            onchange: () => {
                this.changed = true;
            },
        };

        this.init();
    }

    override init() {
        this.updateBounds();
    }

    override updateBounds(): void {
        if (!this.metrics) return;
        this.bounds = AABB.fromPoints([
            this.pos.copy().add(new Vector(0, -(this.metrics.height - this.metrics.deltaY)).rotate(this.rot)),
            this.pos.copy().add(new Vector(this.metrics.width, -(this.metrics.height - this.metrics.deltaY)).rotate(this.rot)),
            this.pos.copy().add(new Vector(this.metrics.width, this.metrics.deltaY).rotate(this.rot)),
            this.pos.copy().add(new Vector(0, this.metrics.deltaY).rotate(this.rot)),
        ]);
        //super.updateBounds();
    }

    override render(renderer: Renderer, isSelected: boolean, drawSurfaces?: boolean): void {
        renderer.setFontFace("Nunito");
        renderer.setFontSize(this.attribs.size.value);
        renderer.setColor(this.color);
        renderer.resetTransforms();
        renderer.translate(this.pos);
        renderer.rotate(this.rot);
        renderer.fillText(this.attribs.text.value, Vector.zero());
        renderer.resetTransforms();

        super.render(renderer, isSelected, drawSurfaces);

        if (this.changed) {
            this.metrics = renderer.getTextMetrics(this.attribs.text.value);
            this.updateBounds();
            this.changed = false;
        }
    }
}
