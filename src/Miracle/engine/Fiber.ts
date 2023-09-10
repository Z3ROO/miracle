import { Hook } from "./FunctionComponent.js";
import { RenderEngine } from "./RenderEngine.js";
import { ElementChildren, IElement } from "./vDom.js";

export interface IFiber extends IElement {
  dom: HTMLElement|Text|null
  parent?: IFiber
  child?: IFiber
  sibling?: IFiber
  alternate: IFiber|null
  effectTag: 'PLACEMENT'|'UPDATE'|'DELETION'
  hooks: Hook<any>[]
}

export class Fiber {
  private constructor() {}

  static reconcileChildren(fiber: IFiber, children: ElementChildren) {
    let newFiber: IFiber, prevSibling: IFiber, index = 0;

    let oldFiber = (fiber.alternate && fiber.alternate.child);

    while (index < children.length || oldFiber != null) {
      const child = children[index];

      const sameType = (
        child && oldFiber && child.type === oldFiber.type
      );

      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: child.props,
          dom: oldFiber.dom,
          parent: fiber,
          alternate: oldFiber,
          effectTag: 'UPDATE',
          hooks: []
        }
      }

      if (child && !sameType) {
        newFiber = {
          type: child.type,
          props: child.props,
          dom: null,
          parent: fiber,
          alternate: null,
          effectTag: 'PLACEMENT',
          hooks: []
        }
      }

      if (oldFiber && !sameType) {
        RenderEngine.queueDeletion(oldFiber);
      }

      if (oldFiber)
        oldFiber = oldFiber.sibling

      if (index === 0)
        fiber.child = newFiber;
      else if (prevSibling)
        prevSibling.sibling = newFiber;

      prevSibling = newFiber;
      newFiber = undefined;
      index++;
    }
    
  }
}