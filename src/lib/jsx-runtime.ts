import { createElement, } from "lib/vdom"
import { Component, ComponentProps, createComponent } from "lib/component"
import { VDOMAttributes, VDOMComponent, VDOMElement, VDOMNode } from "./types/vdom";

export function jsxs(
    tagOrComponent: string,
    props: VDOMAttributes & { children?: VDOMNode[] },
    key: string | number,
): VDOMElement;
export function jsxs<P extends ComponentProps>(
    tagOrComponent: { new(): Component<P> },
    props: P & { children?: VDOMNode[] },
    key: string | number,
): VDOMComponent<P>;
export function jsxs<P extends ComponentProps>(
    tagOrComponent: string | { new(): Component<P> },
    props: (VDOMAttributes | P) & { children?: VDOMNode[] },
    key: string | number,
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

export function jsxLib(
    tagOrComponent: string,
    props: VDOMAttributes & { key: string | number },
    ...children: VDOMNode[]
): VDOMElement;
export function jsxLib<P extends ComponentProps>(
    tagOrComponent: { new(): Component<P> },
    props: P & { key: string | number },
    ...children: VDOMNode[]
): VDOMComponent<P>;
export function jsxLib<P extends ComponentProps>(
    tagOrComponent: string | { new(): Component<P> },
    props: (VDOMAttributes | P) & { key: string | number },
    ...children: VDOMNode[]
) {
    props = props ?? {};

    if (typeof tagOrComponent !== 'string') {

        return createComponent(
            tagOrComponent,
            props as P & { key: string | number },
        );

    }
    delete props.children;

    const resolvedChildren =
        Array.isArray(children)
            ? children.length === 1 && Array.isArray(children[0])
                ? children[0] as VDOMNode[]
                : children
            : [children];

    return createElement(
        tagOrComponent,
        props as VDOMAttributes & { key: string | number },
        ...resolvedChildren
    );
}
