export enum AttributeType {
    Number = "number",
    String = "text",
    Boolean = "checkbox",
    Color = "color",
    Vector = "vector",
}

export interface Attribute<Type> {
    name: string;
    key?: string;
    type: AttributeType;
    min?: number;
    max?: number;
    step?: number;
    value: Type;
    hide?: boolean;
    onchange?: (value: Type) => void;
}
