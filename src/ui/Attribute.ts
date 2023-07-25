export enum AttributeType {
    Number = "number",
    String = "text",
    Boolean = "checkbox",
    Color = "color",
    Vector = "vector",
}

export interface Attribute {
    name: string;
    // value: any;
    type: AttributeType;
    min?: number;
    max?: number;
    step?: number;
}
