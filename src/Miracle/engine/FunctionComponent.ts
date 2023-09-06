import { IFiber } from './Fiber.js';
import { RenderEngine } from './RenderEngine.js';
import { ElementProps, IElement } from './vDom.js';

export type FunctionComponent = (props: ElementProps) => IElement;

type ActionFn<T> = (previousValue: T) => T

export type Hook<T> = {
  state: T
  queue: ActionFn<T>[]
}

let wipFiber: IFiber = null;
let hookIndex: number = null;

export function mountFunctionComponent(fiber: IFiber) {
  wipFiber = fiber;
  hookIndex = 0;

  return (fiber.type as FunctionComponent)(fiber.props);
}

export function useState<T>(initial: T): [T, (action: ActionFn<T>) => void] {
  const oldHook = (wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex]);

  const hook: Hook<T> = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  function setState(action: ActionFn<T>) {
    hook.queue.push(action);
    RenderEngine.reRender();
  }

  wipFiber.hooks.push(hook);
  hookIndex++;

  return [hook.state, setState];
}