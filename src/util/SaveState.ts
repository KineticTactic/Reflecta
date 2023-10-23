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
        for (const entityData of data.entities) {
            const entityOptions: { [key: string]: any } = {};

            console.log(entityData);
            for (const [key, value] of Object.entries<any>(entityData)) {
                console.log(key, value);
                if (value.x !== undefined && value.y !== undefined) {
                    entityOptions[key] = new Vector(value.x, value.y);
                } else if (value.r !== undefined && value.g !== undefined && value.b !== undefined && value.a !== undefined) {
                    entityOptions[key] = new Color(value.r, value.g, value.b, value.a);
                } else {
                    entityOptions[key] = value;
                }
            }

            console.log("OPTIONS: ", entityOptions);

            const entity = new (entityList.find((e) => e.name === entityData.name)!.constructorFunc)(entityOptions);
            entities.push(entity);
        }

        world.entities = entities;

        for (const [key, value] of Object.entries(data.world)) {
            (Settings as any)[key] = value;
        }
    }
}
