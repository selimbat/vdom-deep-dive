import { createDiff, skip } from "./diff"
import { applyDiff } from "./render"
import { VDOMNodeUpdater } from "./types/diff"
import { VDOMComponent, VDOMNode } from "./types/vdom"

export type ComponentProps = {
  [prop: string]: any,
}

type ComponentState = {
  [prop: string]: any,
}

export abstract class Component<
  P extends ComponentProps = ComponentProps,
  S extends ComponentState = ComponentState,
> {

  protected props: P
  protected state: S

  private currentRootNode: VDOMNode
  private mountedElement: Element | Text | null

  protected setState(updater: ((s: S) => S)) {
    if (!this.mountedElement) {
      throw new Error("Updating an unmounted component")
    }
    const newState = updater(this.state)
    if (newState !== this.state) {
      this.state = newState
      const diff = this.getUpdateDiff();
      applyDiff(this.mountedElement, diff)
    }
  }

  public setProps(props: P): VDOMNodeUpdater {
    if (!this.mountedElement) {
      throw new Error("Setting the props of an unmounted component")
    }
    const newState = this.componentWillRecieveProps(props, this.state)
    if (newState !== this.state || props !== this.props) {
      this.state = newState
      this.props = props
      return this.getUpdateDiff()
    }
    return skip()
  }

  public initProps(props: P): VDOMNode {
    this.props = props
    this.currentRootNode = this.render()
    return this.currentRootNode
  }

  private getUpdateDiff(): VDOMNodeUpdater {
    const newRootNode = this.render()
    const diff = createDiff(this.currentRootNode, newRootNode)
    if (diff.kind == 'replace') {
      diff.callback = elem => this.mountedElement = elem
    }
    this.currentRootNode = newRootNode
    requestAnimationFrame(() => this.componentDidUpdate())
    return diff
  }

  public notifyMounted(elem: Element | Text) {
    this.mountedElement = elem
    requestAnimationFrame(() => this.componentDidMount())
  }

  public unmount() {
    this.componentWillUnmount()
    this.mountedElement = null
  }

  public componentDidMount() { }
  public componentWillRecieveProps(props: P, state: S): S { return state }
  public componentDidUpdate() { }
  public componentWillUnmount() { }

  public abstract render(): VDOMNode
}

export function createComponent<P extends ComponentProps>(
  component: { new(): Component<P> },
  props: P & { key: string | number },
): VDOMComponent<P> {
  const componentProps: P = { ...props };
  delete componentProps.key;
  return {
    kind: 'component',
    key: props.key,
    component,
    props: componentProps,
    instance: null
  }
}
