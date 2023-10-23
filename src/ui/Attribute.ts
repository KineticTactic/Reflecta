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
    onchange?: (value: Type) => void | boolean;
    show?: () => boolean;
}
