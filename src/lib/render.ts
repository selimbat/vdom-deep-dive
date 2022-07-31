import { ChildUpdater, VDOMNodeUpdater } from "./types/diff";
import { VDOMNode } from "./types/vdom"

const renderElement = (rootNode: VDOMNode): HTMLElement | Text => {
  if (rootNode.kind == 'text') {
    return document.createTextNode(rootNode.value)
  }

  const elem = document.createElement(rootNode.tagname)

  for (const att in (rootNode.props ?? {})) {
    (elem as any)[att] = rootNode.props ? rootNode.props[att] : undefined;
  }

  (rootNode.children ?? []).forEach(child =>
    elem.appendChild(renderElement(child))
  )

  return elem
}

export const applyDiff = (elem: Element | Text, diff: VDOMNodeUpdater): Element | Text => {
  if (diff.kind == 'skip') return elem 

  if (diff.kind == 'replace') {
    const newElem = renderElement(diff.newNode)
    elem.replaceWith(newElem)
    return newElem
  }

  if ('wholeText' in elem) {
    throw new Error('invalid update for Text node')
  }

  for (const att in diff.attributes.remove) {
    elem.removeAttribute(att)
  }

  for (const att in diff.attributes.set) {
    (elem as any)[att] = diff.attributes.set[att]
  }

  applyChildrenDiff(elem, diff.children)

  return elem
}

const applyChildrenDiff = (elem: Element, operations: ChildUpdater[]) => {
  let offset = 0
  for (let i = 0; i < operations.length; i++) {
    const childUpdater = operations[i]

    if (childUpdater.kind == 'skip') continue

    if (childUpdater.kind == 'insert') {
      const newChild = renderElement(childUpdater.node)
      if (elem.childNodes[i + offset - 1]) {
        elem.childNodes[i + offset - 1].after(newChild)
      } else {
        elem.appendChild(newChild)
      }
      continue
    }
    
    const childElem = elem.childNodes[i + offset]

    if (childUpdater.kind == 'remove') {
      childElem.remove()
      offset -= 1
      continue
    }

    applyDiff(childElem as Element, childUpdater)
  }
}