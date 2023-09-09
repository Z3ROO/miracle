import { IFiber } from './Fiber.js';
import { RenderEngine } from './RenderEngine.js';
import { ElementProps, IElement } from './vDom.js';

export type FunctionComponent = (props: ElementProps) => IElement;

type ActionFn<T> = (previousValue: T) => T

export type Hook<T> = {
  state: T
  queue: ActionFn<T>[]
}

let currentFiber: IFiber = null;
let hookIndex: number = null;

export function mountFunctionComponent(fiber: IFiber) {
  currentFiber = fiber;
  hookIndex = 0;

  return (fiber.type as FunctionComponent)(fiber.props);
}

export function useState<T>(initial: T): [T, (action: ActionFn<T>|T) => void] {
  const existingHook =  (currentFiber.alternate && currentFiber.alternate.hooks && currentFiber.alternate.hooks[hookIndex]);

  const hook: Hook<T> = {
    state: existingHook ? existingHook.state : initial,
    queue: []
  }

  const actions = existingHook ? existingHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  function setState(action: ActionFn<T>|T) {
    if (action instanceof Function)
      hook.queue.push(action);
    else
      hook.queue.push(() => action);

    RenderEngine.reRender();
  }

  currentFiber.hooks.push(hook);
  hookIndex++;

  return [hook.state, setState];
}