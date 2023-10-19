import lzstring from "lz-string";
import { Color, Vector } from "polyly";
import World from "../core/World";
import entityList from "../entities/entityList";

export class SaveState {
    static encodeWorld(world: World) {
        const entityDataList = world.entities.map((e) => {
            const entityData: { [key: string]: any } = {
                name: e.name,
            };
            for (let attrib of e.attributes) {
                const attribKey = attrib.key ? attrib.key : attrib.name;
                entityData[attribKey] = e[attribKey];
            }
            return entityData;
        });

        const str = JSON.stringify(entityDataList);
        console.log(entityDataList);

        const encoded = lzstring.compressToEncodedURIComponent(str);
        console.log(encoded);
        return encoded;
    }

    static restoreWorld(world: World, encoded: string) {
        const decoded = lzstring.decompressFromEncodedURIComponent(encoded);
        const data = JSON.parse(decoded);
        const entities = [];
        for (let obj of data) {
            const entity = new (entityList.find((e) => e.name === obj.name)!.constructorFunc)(new Vector(obj.pos.x, obj.pos.y), obj.rot);

            for (let attrib of entity.attributes) {
                entity[attrib.name] = obj[attrib.name];
            }
            entity.setPosition(new Vector(obj.pos.x, obj.pos.y));
            entity.setRotation(obj.rot);
            entity.color = new Color(obj.color.r, obj.color.g, obj.color.b, obj.color.a);
            entity.init();

            console.log(entity);

            entities.push(entity);
        }
        world.entities = entities;
    }
}
