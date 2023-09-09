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
  children = children.flat();
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
const isProperty = (key: string) => key !== 'children' && !isEvent(key) && !isStyle(key);
const isElement = (dom: HTMLElement|Text) => dom.nodeType === Node.ELEMENT_NODE;
const isStyle = (key: string) => key === 'style';
const isUnchanged = (prev: ElementProps, next: ElementProps) => (key: string) => prev[key] === next[key];

export function updateDom(dom: HTMLElement|Text, prevProps: ElementProps|null, nextProps: ElementProps) {
  for (const prop in prevProps) {

    if (isStyle(prop) && isElement(dom)) {
      for (const styleProp in nextProps[prop] as any) {

        (dom as HTMLElement).style[styleProp] = '';
      }
    }

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
    if (isStyle(prop) && isElement(dom)) {
      for (const styleProp in nextProps[prop] as any) {
        const value = nextProps[prop][styleProp];

        (dom as HTMLElement).style[styleProp] = value;
      }
    }

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

  if (dom.nodeType === Node.ELEMENT_NODE && nextProps.styles)
    applyStyle(dom as HTMLElement, nextProps.styles)
}

function applyStyle(dom: HTMLElement, styles: any) {
  for (const style in styles) {
    dom.style[style] = styles[style];
  }
}