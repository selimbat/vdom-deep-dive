import { createElement, } from "lib/vdom"
import { Component, ComponentProps, createComponent } from "lib/component"
import { VDOMAttributes, VDOMComponent, VDOMElement, VDOMNode } from "./types/vdom";

export function jsxs(
    tagOrComponent: string,
    props: VDOMAttributes & { children?: VDOMNode[] },
    key: string,
): VDOMElement;
export function jsxs<P extends ComponentProps>(
    tagOrComponent: { new(): Component<P> },
    props: P & { children?: VDOMNode[] },
    key: string,
): VDOMComponent<P>;
export function jsxs<P extends ComponentProps>(
    tagOrComponent: string | { new(): Component<P> },
    props: (VDOMAttributes | P) & { children?: VDOMNode[] },
    key: string,
) {
    Object.assign(props, { key });

    if (typeof tagOrComponent !== 'string') {

        return createComponent(
            tagOrComponent,
            props as P & { key: string | number },
        );

    }
    const children = props.children ?? [];
    delete props.children;

    return createElement(
        tagOrComponent,
        props as VDOMAttributes & { key: string | number },
        ...(Array.isArray(children) ? children : [children])
    );
}

export const jsx = jsxs;