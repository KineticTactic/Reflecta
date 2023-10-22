import Entity, { EntityOptions } from "./Entity";

interface EntityData {
    name: string;
    desc: string;
    constructorFunc: { new (options: EntityOptions): Entity }; // This weird new thing refers to a "Class" type
}

export default EntityData;
