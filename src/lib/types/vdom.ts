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

export type VDOMNode = VDOMElement | VDOMText; 
