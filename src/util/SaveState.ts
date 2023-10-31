import lzstring from "lz-string";
import { Color, Vector } from "polyly";
import World from "../core/World";
import entityList from "../entities/entityList";
import Settings from "../core/Settings";

export class SaveState {
    static createEntityDataList(world: World) {
        return world.entities.map((e) => {
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
    }

    static encodeWorld(world: World) {
        const entityDataList = SaveState.createEntityDataList(world);

        const dataJSON = {
            entities: entityDataList,
            world: Settings,
        };

        const str = JSON.stringify(dataJSON);
        const encoded = lzstring.compressToEncodedURIComponent(str);

        return encoded;
    }

    static restoreWorld(world: World, encoded: string) {
        const decoded = lzstring.decompressFromEncodedURIComponent(encoded);
        const data = JSON.parse(decoded);
        const entities = [];

        for (const entityData of data.entities) {
            const entityOptions: { [key: string]: any } = {};

            for (const [key, value] of Object.entries<any>(entityData)) {
                if (value.x !== undefined && value.y !== undefined) {
                    entityOptions[key] = new Vector(value.x, value.y);
                } else if (value.r !== undefined && value.g !== undefined && value.b !== undefined && value.a !== undefined) {
                    entityOptions[key] = new Color(value.r, value.g, value.b, value.a);
                } else {
                    entityOptions[key] = value;
                }
            }

            const entity = new (entityList.find((e) => e.name === entityData.name)!.constructorFunc)(entityOptions);
            entities.push(entity);
        }

        world.reset();
        world.entities = entities;

        for (const [key, value] of Object.entries(data.world)) {
            (Settings as any)[key] = value;
        }
    }

    static getCurrentSceneCode(world: World) {
        let code = "";
        const entityDataList = SaveState.createEntityDataList(world);
        for (const entity of entityDataList) {
            code += `this.world.addEntity(new ${entity.name}(${JSON.stringify(entity)}));\n`;
        }
        return code;
    }
}
