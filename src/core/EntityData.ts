import Entity, { EntityOptions } from "./Entity";

interface EntityData {
    name: string;
    desc: string;
    constructorFunc: { new (options: EntityOptions): Entity }; // This weird new thing refers to a "Class" type
    disableColor?: boolean; // Some entities don't need color, like all the light sources
}

export default EntityData;
