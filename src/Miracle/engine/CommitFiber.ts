import { IFiber } from "./Fiber.js";
import { RootFiber } from "./RenderEngine.js";
import { updateDom } from "./vDom.js";

export class CommitFiber {
  fiber: IFiber;
  deletions: IFiber[];

  constructor(rootFiber: RootFiber, deletions: IFiber[]) {
    this.fiber = rootFiber as IFiber;
    this.deletions = deletions;
  }

  public commit() {
    this.deletions.forEach(this.commitWork);
    this.commitWork(this.fiber.child);
  }

  private commitWork(fiber: IFiber) {
    if (!fiber)
      return;

    let domParentFiber = fiber.parent;

    while (!domParentFiber.dom) 
      domParentFiber = domParentFiber.parent;

    const domParent = domParentFiber.dom;

    if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null)
      domParent.appendChild(fiber.dom);
    else if (fiber.effectTag === 'UPDATE' && fiber.dom != null)
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    else if (fiber.effectTag === 'DELETION')
      this.commitDeletion(fiber, domParent as HTMLElement)

    this.commitWork(fiber.child);
    this.commitWork(fiber.sibling);
  }

  private commitDeletion(fiber: IFiber, domParent: HTMLElement) {
    if (fiber.dom)
      domParent.removeChild(fiber.dom);
    else
      this.commitDeletion(fiber.child, domParent);
  }
}

