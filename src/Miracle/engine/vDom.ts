import { FunctionComponent } from "./FunctionComponent.js";
import { IFiber } from "./Fiber.js";

export type ElementType = string|FunctionComponent
export type ElementChildren = (IFiber|IElement)[]
export type ElementProps = {children: ElementChildren} & {[key: string]: any}

export interface IElement {
  type: ElementType
  props: ElementProps
}

export function createElement(type: ElementType, props: {[key: string]: any}, ...children: (string|number|IFiber|IElement)[]): IElement {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child !== 'object')
          return createTextElement(child);

        return child;
      })
    }
  }
}

function createTextElement(value: string|number): IElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: value,
      children: []
    }
  }
}

export function createDom(fiber: IFiber): HTMLElement|Text {
  if (typeof fiber.type !== 'string')
    throw new Error("Element or Fiber type should be a string in this point but is: "+typeof fiber.type)

  const dom = (
    fiber.type === 'TEXT_ELEMENT' ? 
    document.createTextNode('') :
    document.createElement(fiber.type)
  );

  updateDom(dom, null, fiber.props);

  return dom;
}

const isEvent = (key:string) => key.startsWith('on');
const isProperty = (key: string) => key !== 'children' && !isEvent(key);
const isUnchanged = (prev: ElementProps, next: ElementProps) => (key: string) => prev[key] === next[key];

export function updateDom(dom: HTMLElement|Text, prevProps: ElementProps|null, nextProps: ElementProps) {
  for (const prop in prevProps) {
    if (prevProps && isUnchanged(prevProps, nextProps)(prop))
      continue;

    if (isEvent(prop)) {
      const eventName = prop.toLowerCase().substring(2);
      dom.removeEventListener(eventName, prevProps[prop]);
    }
    else if (isProperty(prop)) {
      (dom as any)[prop] = "";
    }
  }

  for (const prop in nextProps) {
    if (prevProps && isUnchanged(prevProps, nextProps)(prop))
      continue;

    if (isEvent(prop)) {
      const eventName = prop.toLowerCase().substring(2);
      dom.addEventListener(eventName, nextProps[prop]);
    }
    else if (isProperty(prop)) {
      (dom as any)[prop] = nextProps[prop];
    }
  }
}