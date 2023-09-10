import { useState, useRef } from "./engine/FunctionComponent.js";
import { RenderEngine } from "./engine/RenderEngine.js";
import { createElement } from "./engine/vDom.js";

const Miracle = {
  createElement,
  render: RenderEngine.render,
  useState,
  useRef
 };

export const render = Miracle.render;
export { useState, useRef } from './engine/FunctionComponent.js';

export default Miracle
