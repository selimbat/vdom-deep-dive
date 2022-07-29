import { VDOMAttributes, VDOMNode, VDOMElement, VDOMText } from "./types/vdom"

export const createElement = (
    tagname: string,
    props: VDOMAttributes & { key: string },
    ...children: VDOMNode[]
): VDOMElement => {
    const key = props.key;
    const propsToPass: VDOMAttributes = props;
    delete propsToPass.key;
    return ({
        kind: 'element',
        tagname,
        props: propsToPass,
        children,
        key
    })
}

export const createText = (value: string | number | boolean, key: string = ''): VDOMText => ({
    key, kind: 'text', value: value.toString()
})
