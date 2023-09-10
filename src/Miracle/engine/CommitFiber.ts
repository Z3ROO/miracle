import { IFiber } from "./Fiber.js";
import { RootFiber } from "./RenderEngine.js";
import { updateDom } from "./vDom.js";


export class CommitFiber {
  static deletions: IFiber[] = [];

  static commit(rootFiber: RootFiber) {

    CommitFiber.deletions.forEach(CommitFiber.commitWork);
    CommitFiber.commitWork((rootFiber as IFiber).child);
  }

  private static commitWork(fiber: IFiber) {
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
      CommitFiber.commitDeletion(fiber, domParent as HTMLElement)
    
    CommitFiber.commitWork(fiber.child);
    CommitFiber.commitWork(fiber.sibling);
  }  

  private static commitDeletion(fiber: IFiber, domParent: HTMLElement) {
    if (fiber.dom) {
      requestAnimationFrame(() =>{
        domParent.removeChild(fiber.dom);
      })
    }
    else
      CommitFiber.commitDeletion(fiber.child, domParent);
  }
}

