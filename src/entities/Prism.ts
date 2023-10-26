import { Vector, Renderer, Color } from "polyly";

import PlaneRefractiveSurface from "../primitives/PlaneRefractiveSurface";
import { AttributeType } from "../core/Attribute";
import EntityData from "../core/EntityData";
import Surface from "../primitives/Surface";
import Entity, { EntityOptions } from "../core/Entity";
import World from "../core/World";
import { Draggable } from "../util/Draggable";

const EQUILATERAL_PRISM_VERTICES = [new Vector(0, -Math.sqrt(3) / 3), new Vector(0.5, Math.sqrt(3) / 6), new Vector(-0.5, Math.sqrt(3) / 6)];

export interface PrismOptions extends EntityOptions {
    size?: number;
    refractiveIndex?: number;
}

export default class Prism extends Entity {
    static entityData: EntityData = {
        name: "Prism",
        desc: "A prism.",
        constructorFunc: Prism,
    };

    constructor(options: PrismOptions) {
        super("Prism", options);

        this.attribs.size = {
            name: "size",
            type: AttributeType.Number,
            min: 0,
            max: 1000,
            value: options.size || 200,
            onchange: () => {
                this.init();
                this.draggables[0].setWorldPos(new Vector((this.attribs.size.value * Math.sqrt(3) * 2) / 6, 0).rotate(Math.PI / 6 + this.rot));
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

    init() {
        let v1 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[0].copy().mult(this.attribs.size.value).rotate(this.rot));
        let v2 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[1].copy().mult(this.attribs.size.value).rotate(this.rot));
        let v3 = Vector.add(this.pos, EQUILATERAL_PRISM_VERTICES[2].copy().mult(this.attribs.size.value).rotate(this.rot));

        this.surfaces = [
            new PlaneRefractiveSurface(v2.copy(), v1.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v3.copy(), v2.copy(), this.attribs.refractiveIndex.value),
            new PlaneRefractiveSurface(v1.copy(), v3.copy(), this.attribs.refractiveIndex.value),
        ];
        // console.log("PRISM INIT", this.rot);

        this.updateBounds();
    }

    override createDraggables(world: World): void {
        super.createDraggables(world);
        this.draggables.push(
            new Draggable(
                Vector.add(this.pos, new Vector((this.attribs.size.value * Math.sqrt(3) * 2) / 6, 0).rotate(Math.PI / 6 + this.rot)),
                world,
                (newPos: Vector) => {
                    this.attribs.size.value = (Vector.sub(newPos, this.pos).mag() * 6) / (2 * Math.sqrt(3));
                    this.setRotation(Vector.sub(newPos, this.pos).heading() - Math.PI / 6);
                    this.init();
                    this.isDirty = true;
                }
            )
        );
    }

    override render(renderer: Renderer, isSelected: boolean): void {
        renderer.beginPath();
        renderer.vertices(
            [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
            new Color(this.color.r, this.color.g, this.color.b, 255)
        );

        renderer.strokePath(Surface.surfaceRenderWidth, { closed: true });

        renderer.beginPath();
        renderer.vertices(
            [(this.surfaces[0] as PlaneRefractiveSurface).v1, (this.surfaces[0] as PlaneRefractiveSurface).v2, (this.surfaces[1] as PlaneRefractiveSurface).v1],
            new Color(this.color.r, this.color.g, this.color.b, 25)
        );
        renderer.fillPath();

        super.render(renderer, isSelected, false);

        // console.log((this.surfaces[0] as PlaneRefractiveSurface).v2);
    }
}
