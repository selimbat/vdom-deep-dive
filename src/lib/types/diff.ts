import { VDOMAttributes, VDOMNode } from "./vdom"

export type AttributesUpdater = {
    set: VDOMAttributes;
    remove: string[];
}

export interface UpdateOperation {
    kind: 'update';
    attributes: AttributesUpdater;
    children: ChildUpdater[];
}

export interface ReplaceOperation {
    kind: 'replace';
    newNode: VDOMNode;
}

export interface SkipOperation {
    kind: 'skip';
}

export interface RemoveOperation {
    kind: 'remove';
}

export interface InsertOperation {
    kind: 'insert';
    node: VDOMNode;
}

export type VDOMNodeUpdater =
    | UpdateOperation
    | ReplaceOperation
    | SkipOperation

export type ChildUpdater =
    | UpdateOperation
    | ReplaceOperation
    | SkipOperation
    | RemoveOperation
    | InsertOperation
