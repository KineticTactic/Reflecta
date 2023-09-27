import Vector, { V } from "../lib/Vector";
import SurfaceEntity from "./SurfaceEntity";
import { AttributeType } from "../ui/Attribute";
import EntityData from "../core/EntityData";
import PlaneBlockerSurface from "../primitives/PlaneBlockerSurface";

export default class Blocker extends SurfaceEntity {
    size: number;

    static entityData: EntityData = {
        name: "Blocker",
        desc: "A blocker surface.",
        constructorFunc: Blocker,
    };

    constructor(pos: Vector, rot: number = 0) {
        super(pos, rot, "Blocker");

        this.size = 200;

        this.init();

        // Attributes
        this.attributes.push({ name: "size", type: AttributeType.Number, min: 0, max: 1000, value: this.size });
    }

    init() {
        this.surfaces = [
            new PlaneBlockerSurface(Vector.add(this.pos, V(this.size / 2, 0).rotate(this.rot)), Vector.sub(this.pos, V(this.size / 2, 0).rotate(this.rot))),
        ];
        this.updateBounds();
    }

    override updateBounds(): void {
        super.updateBounds();
        this.bounds.setMinSize(30);
    }

    override updateAttribute(attribute: string, value: string | Vector | boolean | number): void {
        super.updateAttribute(attribute, value);
        switch (attribute) {
            case "size":
                this.size = value as number;
                this.init();
                break;
        }
    }
}
