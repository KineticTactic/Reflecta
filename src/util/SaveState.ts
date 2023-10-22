import lzstring from "lz-string";
import { Color, Vector } from "polyly";
import World from "../core/World";
import entityList from "../entities/entityList";
import Settings from "../core/Settings";

export class SaveState {
    static encodeWorld(world: World) {
        const entityDataList = world.entities.map((e) => {
            const entityData: { [key: string]: any } = {
                name: e.name,
                pos: e.pos,
                rot: e.rot,
                color: e.color,
            };
            for (let [key, attrib] of Object.entries(e.attribs)) {
                entityData[key] = attrib.value;
            }
            return entityData;
        });

        const dataJSON = {
            entities: entityDataList,
            world: Settings,
        };

        const str = JSON.stringify(dataJSON);
        console.log(dataJSON);

        const encoded = lzstring.compressToEncodedURIComponent(str);
        console.log(encoded);
        return encoded;
    }

    static restoreWorld(world: World, encoded: string) {
        const decoded = lzstring.decompressFromEncodedURIComponent(encoded);
        const data = JSON.parse(decoded);
        const entities = [];
        console.log(data);
        for (let obj of data.entities) {
            console.log(obj);

            const entityOptions: { [key: string]: any } = {};

            for (let attrib of Object.keys(obj)) {
                if (obj[attrib].x !== undefined && obj[attrib].y !== undefined) {
                    entityOptions[attrib] = new Vector(obj[attrib].x, obj[attrib].y);
                } else if (obj[attrib].r !== undefined && obj[attrib].g !== undefined && obj[attrib].b !== undefined && obj[attrib].a !== undefined) {
                    entityOptions[attrib] = new Color(obj[attrib].r, obj[attrib].g, obj[attrib].b, obj[attrib].a);
                } else {
                    entityOptions[attrib] = obj[attrib];
                }
            }

            const entity = new (entityList.find((e) => e.name === obj.name)!.constructorFunc)(entityOptions);
            entities.push(entity);
        }

        world.entities = entities;

        for (let [key, value] of Object.entries(data.world)) {
            (Settings as any)[key] = value;
        }
    }
}
