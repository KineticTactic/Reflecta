import { Renderer, Vector } from "polyly";

import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import PlaneReflectiveSurface from "../primitives/PlaneReflectiveSurface";
import Entity, { EntityOptions } from "../core/Entity";
import World from "../core/World";
import { Draggable } from "../util/Draggable";
import settings from "../core/Settings";

export interface PlaneMirrorOptions extends EntityOptions {
    size?: number;
}

export default class PlaneMirror extends Entity {
    static override entityData: EntityData = {
        name: "Plane Mirror",
        desc: "A plane mirror.",
        constructorFunc: PlaneMirror,
    };

    constructor(options: PlaneMirrorOptions) {
        super("Plane Mirror", options);

        this.attribs.size = {
            name: "size",
            value: options.size || 200,
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            onchange: () => this.init(),
        };

        this.init();
    }

    override init() {
        this.surfaces = [
            new PlaneReflectiveSurface(
                Vector.add(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)),
                Vector.sub(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot))
            ),
        ];
        this.updateBounds();
    }

    override createDraggables(world: World): void {
        this.draggables.push(
            new Draggable(new Vector(this.attribs.size.value / 2, 0).rotate(this.rot).add(this.pos), world, (newPos: Vector) => {
                this.attribs.size.value = Vector.sub(newPos, this.pos).mag() * 2;
                this.setRotation(Vector.sub(newPos, this.pos).heading());
                this.init();
            })
        );
    }

    override updateBounds(): void {
        super.updateBounds();
        this.bounds.setMinSize(30);
    }

    override render(renderer: Renderer, isSelected: boolean, drawSurfaces?: boolean): void {
        super.render(renderer, isSelected, drawSurfaces);

        renderer.translate(Vector.sub(this.pos, new Vector(this.attribs.size.value / 2, 0).rotate(this.rot)));
        renderer.rotate(this.rot);
        renderer.beginPath();
        renderer.setColor(this.color);
        for (let x = 0; x < this.attribs.size.value; x += 15) {
            renderer.vertex(new Vector(x, 0));
            renderer.vertex(new Vector(x + 10, 10));
            renderer.splitPath();
        }
        renderer.stroke(settings.surfaceRenderWidth);
        renderer.transform.resetTransforms();
    }
}
