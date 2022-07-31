import { isEmpty } from "../utils/utils";
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

    const childrenUpdater: ChildUpdater[] = newChildrenDiff((oldNode.children ?? []), (newNode.children ?? []))

    return {
        kind: 'update',
        attributes: attUpdater,
        children: childrenUpdater,
    }
}

const newChildrenDiff = (oldChildren: VDOMNode[], newnewChildren: VDOMNode[]): ChildUpdater[] => {

    const removeUntilkey = (operations: ChildUpdater[], elems: VDOMNode[], key: string | number | undefined) => {
        while (!isEmpty(elems) && elems[0].key != key) {
            operations.push(remove())
            elems.shift()
        }
    }

    const insertUntilKey = (operations: ChildUpdater[], elems: VDOMNode[], key: string | number | undefined) => {
        while (!isEmpty(elems) && elems[0].key != key) {
            operations.push(insert(elems.shift()!))
        }
    }

    const remainingOldChildren: VDOMNode[] = [...oldChildren]
    const remainingNewChildren: VDOMNode[] = [...newnewChildren]

    const operations: ChildUpdater[] = []

    // find the first element that got updated
    let nextUpdateKey = remainingOldChildren.find(k => !remainingNewChildren.find(l => l.key === k.key))?.key ?? null

    while (nextUpdateKey) {

        // first remove all old newChildren before the update
        removeUntilkey(operations, remainingOldChildren, nextUpdateKey)

        // then insert all new newChildren before the update
        insertUntilKey(operations, remainingNewChildren, nextUpdateKey)

        // create the update
        if (!isEmpty(remainingNewChildren) && !isEmpty(remainingOldChildren)) {
            operations.push(createDiff(remainingOldChildren.shift()!, remainingNewChildren.shift()!));
        }

        // find the next update
        nextUpdateKey = remainingOldChildren.find(k => !remainingNewChildren.find(l => l.key === k.key))?.key ?? null
    }

    // remove all remaing old newChildren after the last update
    removeUntilkey(operations, remainingOldChildren, undefined)

    // insert all remaing new newChildren after the last update
    insertUntilKey(operations, remainingNewChildren, undefined)

    return operations
}
