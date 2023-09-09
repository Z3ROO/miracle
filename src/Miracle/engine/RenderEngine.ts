import { CommitFiber } from "./CommitFiber.js";
import { IFiber, Fiber } from "./Fiber.js";
import { mountFunctionComponent } from "./FunctionComponent.js";
import { ElementProps, IElement, createDom } from "./vDom.js";

export interface RootFiber {
  dom: HTMLElement
  props: ElementProps
  alternate: RootFiber
}

export class RenderEngine {
  static wipRoot: RootFiber;
  static currentRoot: RootFiber;
  static nextUnitOfWork: RootFiber|IFiber;
  static deletions: IFiber[];
  static reRenderScheduled: boolean = false;

  private constructor() {}

  public static render(element: IElement, container: HTMLElement) {
    RenderEngine.wipRoot = {
      dom: container,
      props: {
        children: [element]
      },
      alternate: RenderEngine.currentRoot
    }

    CommitFiber.deletions = [];
    RenderEngine.nextUnitOfWork = RenderEngine.wipRoot;
    requestIdleCallback(RenderEngine.workLoop);
  }

  public static reRender() {
    RenderEngine.wipRoot = {
      dom: RenderEngine.currentRoot.dom,
      props: RenderEngine.currentRoot.props,
      alternate: RenderEngine.currentRoot
    }

    CommitFiber.deletions = [];
    RenderEngine.nextUnitOfWork = RenderEngine.wipRoot;
    requestIdleCallback(RenderEngine.workLoop);
  }

  private static workLoop(deadline: IdleDeadline) {
    let shouldYield = false;

    while (RenderEngine.nextUnitOfWork && !shouldYield) {
      RenderEngine.nextUnitOfWork = RenderEngine.performNextUnitOfWork(
        RenderEngine.nextUnitOfWork as IFiber
      );

      shouldYield = deadline.timeRemaining() < 1;
    }

    if (!RenderEngine.nextUnitOfWork && RenderEngine.wipRoot) 
      RenderEngine.commitRoot();

    if (RenderEngine.nextUnitOfWork || RenderEngine.wipRoot)
      requestIdleCallback(RenderEngine.workLoop);
  }

  private static performNextUnitOfWork(fiber: IFiber) {
    if (fiber.type  instanceof Function)
      RenderEngine.updateFunctionComponent(fiber);
    else
      RenderEngine.updateHostComponent(fiber);

    if (fiber.child)
      return fiber.child;

    let nextFiber: IFiber|undefined = fiber;
    while (nextFiber) {
      if (nextFiber.sibling)
        return nextFiber.sibling;

      nextFiber = nextFiber.parent;
    }
  }

  private static updateFunctionComponent(fiber: IFiber)  {
    const children = [mountFunctionComponent(fiber)];

    Fiber.reconcileChildren(fiber, children);
  }

  private static updateHostComponent(fiber: IFiber) {
    if (!fiber.dom)
      fiber.dom = createDom(fiber);

    Fiber.reconcileChildren(fiber, fiber.props.children);
  }

  private static commitRoot() {
    CommitFiber.commit(RenderEngine.wipRoot);
    RenderEngine.currentRoot = RenderEngine.wipRoot;
    RenderEngine.wipRoot = null;
  }

  public static queueDeletion(fiber: IFiber) {
    fiber.effectTag = 'DELETION';
    CommitFiber.deletions.push(fiber);
  }
}
