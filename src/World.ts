import Vector from "./lib/Vector";
import Entity from "./entities/Entity";
import LightRay from "./primitives/LightRay";
import Surface from "./primitives/Surface";

export class World {
    surfaces: Surface[] = [];
    lightRays: LightRay[] = [];
    entities: Entity[] = [];

    addSurface(surface: Surface) {
        this.surfaces.push(surface);
    }

    addLightRay(lightRay: LightRay) {
        this.lightRays.push(lightRay);
    }

    addEntity(entity: Entity) {
        this.entities.push(entity);
        entity.addToWorld(this);
    }

    update() {
        for (let l of this.lightRays) {
            l.trace(this.surfaces);
        }
    }

    handleClick(mousePos: Vector) {
        for (let e of this.entities) {
            e.handleClick(mousePos);
        }
    }

    // updateDraggables(mousePos, mouseDown) {
    //     for (let s of this.surfaces) {
    //         // s.updateDraggables(mousePos, mouseDown);
    //     }
    // }

    render(ctx: CanvasRenderingContext2D) {
        // for (let s of this.surfaces) {
        //     s.render(ctx);
        // }

        ctx.beginPath();
        for (let l of this.lightRays) {
            l.render(ctx);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;

        ctx.stroke();

        for (let e of this.entities) {
            e.render(ctx);
        }
    }
}
