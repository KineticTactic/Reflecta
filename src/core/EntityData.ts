import Vector from "../lib/Vector";
import Entity from "./Entity";

interface EntityData {
    name: string;
    desc: string;
    constructorFunc: { new (pos: Vector): Entity }; // This weird new thing refers to a "Class" type
}

export default EntityData;
