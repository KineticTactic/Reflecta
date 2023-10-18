import { Vector } from "polyly";

import Entity from "./Entity";

interface EntityData {
    name: string;
    desc: string;
    constructorFunc: { new (pos: Vector, rot: number): Entity }; // This weird new thing refers to a "Class" type
}

export default EntityData;
