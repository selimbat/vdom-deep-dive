import { VDOMAttributes, VDOMNode, VDOMElement, VDOMText } from "./types/vdom"

export const createElement = (
    tagname: string,
    props: VDOMAttributes & { key: string | number },
    ...children: (VDOMNode | string)[]
): VDOMElement => {
    const key = props.key;
    const propsToPass: VDOMAttributes = props;
    delete propsToPass.key;

    const processedChildren = children.map(ch => {
        if (typeof ch !== 'string') return ch;
        return createText(ch)
    })

    return ({
        kind: 'element',
        tagname,
        props: propsToPass,
        children: processedChildren,
        key
    })
}

const createText = (value: string | number | boolean, key: string = ''): VDOMText => ({
    key, kind: 'text', value: value.toString()
})
