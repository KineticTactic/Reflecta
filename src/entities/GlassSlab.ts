import { Vector, Renderer, Color } from "polyly";

import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Surface from "../primitives/Surface";
import Entity, { EntityOptions } from "../core/Entity";
import World from "../core/World";
import { Draggable } from "../util/Draggable";
import Settings from "../core/Settings";

export interface GlassSlabOptions extends EntityOptions {
    size?: Vector;
    refractiveIndex?: number;
}

export default class GlassSlab extends Entity {
    static override entityData: EntityData = {
        name: "Glass Slab",
        desc: "A glass slab.",
        constructorFunc: GlassSlab,
    };

    constructor(options: GlassSlabOptions) {
        super("Glass Slab", options);

        this.attribs.size = {
            name: "size",
            type: AttributeType.Number,
            value: options.size || new Vector(100, 50),
            onchange: () => {
                this.attribs.size.value.x = Math.abs(this.attribs.size.value.x);
                this.attribs.size.value.y = Math.abs(this.attribs.size.value.y);
                this.init();
                this.draggables[0].setWorldPos(Vector.add(this.pos, Vector.mult(this.attribs.size.value, 0.5).rotate(this.rot)));
            },
        };
        this.attribs.refractiveIndex = {
            name: "refractiveIndex",
            type: AttributeType.Number,
            min: 0.1,
            max: 10,
            value: options.refractiveIndex || 1.5,
            onchange: () => {
                this.surfaces.forEach((surface) => {
                    (surface as PlaneRefractiveSurface).setRefractiveIndex(this.attribs.refractiveIndex.value);
                });
            },
        };

        this.init();
    }

    override init() {
        const halfSize = this.attribs.size.value.copy().mult(0.5);

        const v1 = Vector.add(this.pos, new Vector(-halfSize.x, -halfSize.y).rotate(this.rot));
        const v2 = Vector.add(this.pos, new Vector(halfSize.x, -halfSize.y).rotate(this.rot));
        const v3 = Vector.add(this.pos, new Vector(halfSize.x, halfSize.y).rotate(this.rot));
        const v4 = Vector.add(this.pos, new Vector(-halfSize.x, halfSize.y).rotate(this.rot));

        this.surfaces = [
            new PlaneRefractiveSurface(v2.copy(), v1.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v3.copy(), v2.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v4.copy(), v3.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v1.copy(), v4.copy(), this.attribs.refractiveIndex.value),
        ];

        this.updateBounds();
    }

    override createDraggables(world: World): void {
        super.createDraggables(world);
        this.draggables.push(
            new Draggable(Vector.add(this.pos, Vector.mult(this.attribs.size.value, 0.5).rotate(this.rot)), world, (newPos: Vector) => {
                this.attribs.size.value = Vector.sub(newPos, this.pos).mult(2).rotate(-this.rot);
                this.attribs.size.value.x = Math.abs(this.attribs.size.value.x);
                this.attribs.size.value.y = Math.abs(this.attribs.size.value.y);
                this.init();
                this.isDirty = true;
            })
        );
    }

    override render(renderer: Renderer, isSelected: boolean): void {
        renderer.beginPath();
        ///TODO: CHANGE TO RECT
        renderer.setColor(this.color);
        renderer.vertices([
            (this.surfaces[0] as PlaneRefractiveSurface).v1,
            (this.surfaces[0] as PlaneRefractiveSurface).v2,
            (this.surfaces[3] as PlaneRefractiveSurface).v2,
            (this.surfaces[1] as PlaneRefractiveSurface).v1,
        ]);
        renderer.stroke(Surface.surfaceRenderWidth, { closed: true });

        renderer.beginPath();
        renderer.setColor(new Color(this.color.r, this.color.g, this.color.b, Settings.glassOpacity * 255));
        renderer.vertices([
            (this.surfaces[0] as PlaneRefractiveSurface).v1,
            (this.surfaces[0] as PlaneRefractiveSurface).v2,
            (this.surfaces[3] as PlaneRefractiveSurface).v2,
            (this.surfaces[1] as PlaneRefractiveSurface).v1,
        ]);
        renderer.fill();

        super.render(renderer, isSelected, false);
    }
}
