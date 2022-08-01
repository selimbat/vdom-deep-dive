import { Component, ComponentProps } from "../component";

export type VDOMAttributes = {
    [_: string]: string | number | boolean | ((_: any) => any);
};

export interface VDOMElement {
    kind: 'element';
    tagname: string;
    props?: VDOMAttributes;
    children: VDOMNode[];
    key: string | number;
};

export interface VDOMText {
    kind: 'text';
    value: string;
    key: string | number;
};

export interface VDOMComponent<P extends ComponentProps = ComponentProps> {
    kind: 'component';
    key: string | number;
    instance: Component | null;
    props: P;
    component: { new(): Component };
}

export type VDOMNode = VDOMElement | VDOMText | VDOMComponent; 
