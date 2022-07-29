import {
    VDOMNodeUpdater,
    SkipOperation,
    RemoveOperation,
    ReplaceOperation,
    AttributesUpdater,
    ChildUpdater,
    UpdateOperation,
    InsertOperation,
} from "./types/diff"
import { VDOMAttributes, VDOMElement, VDOMNode } from "./types/vdom"


export const createDiff = (oldNode: VDOMNode, newNode: VDOMNode): VDOMNodeUpdater => {
    if (oldNode.kind == 'text' && newNode.kind == 'text' && oldNode.value == newNode.value) {
        return skip();
    }

    if (oldNode.kind == 'text' || newNode.kind == 'text') {
        return replace(newNode);
    }

    if (oldNode.tagname !== newNode.tagname) {
        return replace(newNode);
    }

    // get the updated and replaced attributes
    return update(oldNode, newNode);

}

const skip = (): SkipOperation => ({
    kind: 'skip',
});

const replace = (newNode: VDOMNode): ReplaceOperation => ({
    kind: 'replace',
    newNode,
});

const remove = (): RemoveOperation => ({
    kind: 'remove',
});

const insert = (newNode: VDOMNode): InsertOperation => ({
    kind: 'insert',
    node: newNode,
});

const update = (oldNode: VDOMElement, newNode: VDOMElement): UpdateOperation => {

    const attributesToRemove = Object.keys(oldNode.props ?? {})
        .filter(att => !Object.keys(newNode.props ?? {}).includes(att));

    let attributesToSet: VDOMAttributes;
    if (!newNode.props || Object.keys(newNode.props).length == 0) {
        attributesToSet = {};
    } else if (!oldNode.props || Object.keys(oldNode.props).length == 0) {
        attributesToSet = newNode.props;
    } else {
        attributesToSet = Object.keys(newNode.props)
            .filter(att => oldNode.props![att] != newNode.props![att])
            .reduce<VDOMAttributes>(
                (upd, att) => Object.assign(upd, { [att]: newNode.props![att] }),
                {},
            );
    }

    const attUpdater: AttributesUpdater = {
        remove: attributesToRemove,
        set: attributesToSet,
    }

    const childrenUpdater: ChildUpdater[] = childsDiff((oldNode.children ?? []), (newNode.children ?? []))

    return {
        kind: 'update',
        attributes: attUpdater,
        children: childrenUpdater,
    }
}

const childsDiff = (oldChilds: VDOMNode[], newChilds: VDOMNode[]): ChildUpdater[] => {

    const removeUntilkey = (operations: ChildUpdater[], elems: [string | number, VDOMNode][], key: string | number | undefined) => {
        while (elems[0] && elems[0][0] != key) {
            operations.push(remove())
            elems.shift()
        }
    }

    const insertUntilKey = (operations: ChildUpdater[], elems: [string | number, VDOMNode][], key: string | number | undefined) => {
        while (elems.length > 0 && elems[0][0] != key) {
            operations.push(insert(elems.shift()![1]))
        }
    }

    const remainingOldChilds: [string | number, VDOMNode][] = oldChilds.map(c => [c.key, c])
    const remainingNewChilds: [string | number, VDOMNode][] = newChilds.map(c => [c.key, c])

    const operations: ChildUpdater[] = []

    // find the first element that got updated
    let [nextUpdateKey] = remainingOldChilds.find(k => !remainingNewChilds.map(k => k[0]).includes(k[0])) ?? [null]

    while (nextUpdateKey) {

        // first remove all old childs before the update
        removeUntilkey(operations, remainingOldChilds, nextUpdateKey)

        // then insert all new childs before the update
        insertUntilKey(operations, remainingNewChilds, nextUpdateKey)

        // create the update
        if (remainingNewChilds.length > 0 && remainingOldChilds.length > 0) {
            operations.push(createDiff(remainingOldChilds.shift()![1], remainingNewChilds.shift()![1]));
        }

        // find the next update
        [nextUpdateKey] = remainingOldChilds.find(k => !remainingNewChilds.map(k => k[0]).includes(k[0])) ?? [null]
    }

    // remove all remaing old childs after the last update
    removeUntilkey(operations, remainingOldChilds, undefined)

    // insert all remaing new childs after the last update
    insertUntilKey(operations, remainingNewChilds, undefined)

    return operations
}
