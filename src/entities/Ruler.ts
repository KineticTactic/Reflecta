import { Renderer, TextMeasurements, Vector } from "polyly";

// import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Entity, { EntityOptions } from "../core/Entity";
import AABB from "../util/AABB";

export interface RulerOptions extends EntityOptions {
    text?: string;
    size?: number;
}

export default class Ruler extends Entity {
    static override entityData: EntityData = {
        name: "Ruler",
        desc: "Measuring distances.",
        constructorFunc: Ruler,
    };

    metrics: TextMeasurements | null = null;
    changed: boolean = true;

    constructor(options: RulerOptions) {
        super("Ruler", options);

        this.init();
    }

    override init() {
        this.updateBounds();
        alert("Not implemented yet");
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
        super.render(renderer, isSelected, drawSurfaces);
    }
}
