import { Point } from './geo/point';

const docStyle: { [key: string]: any } =
  window.document && window.document.documentElement.style;

type ELType = HTMLElement | SVGElement;
// @ts-ignore
const suppress = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  window.removeEventListener('click', suppress, true);
};

export function suppressClick() {
  window.addEventListener('click', suppress, true);
  window.setTimeout(() => {
    window.removeEventListener('click', suppress, true);
  }, 0);
}
export function getContainer(domId: string | HTMLDivElement) {
  let $dom = domId as HTMLDivElement;
  if (typeof domId === 'string') {
    $dom = document.getElementById(domId) as HTMLDivElement;
  }
  return $dom;
}

export function trim(str: string) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
export function splitWords(str: string) {
  return trim(str).split(/\s+/);
}

function testProp(props: string[]): string {
  if (!docStyle) {
    return props[0];
  }
  for (const i in props) {
    if (props[i] && props[i] in docStyle) {
      return props[i];
    }
  }

  return props[0];
}
export function create(
  tagName: string,
  className?: string,
  container?: HTMLElement,
) {
  const el = document.createElement(tagName);
  el.className = className || '';

  if (container) {
    container.appendChild(el);
  }
  return el;
}

export function createNS(namespaceURI: string, tagName: string) {
  const el = window.document.createElementNS(namespaceURI, tagName);
  return el;
}
// @function remove(el: HTMLElement)
// Removes `el` from its parent element
export function remove(el: ELType) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el);
  }
}

// @function addClass(el: HTMLElement, name: String)
// Adds `name` to the element's class attribute.
export function addClass(el: ELType, name: string) {
  if (el.classList !== undefined) {
    const classes = splitWords(name);
    for (let i = 0, len = classes.length; i < len; i++) {
      el.classList.add(classes[i]);
    }
  } else if (!hasClass(el, name)) {
    const className = getClass(el);
    setClass(el, (className ? className + ' ' : '') + name);
  }
}

// @function removeClass(el: HTMLElement, name: String)
// Removes `name` from the element's class attribute.
export function removeClass(el: ELType, name: string) {
  if (el.classList !== undefined) {
    el.classList.remove(name);
  } else {
    setClass(
      el,
      trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')),
    );
  }
}

// @function hasClass(el: HTMLElement, name: String): Boolean
// Returns `true` if the element's class attribute contains `name`.
export function hasClass(el: ELType, name: string) {
  if (el.classList !== undefined) {
    return el.classList.contains(name);
  }
  const className = getClass(el);
  return (
    className.length > 0 &&
    new RegExp('(^|\\s)' + name + '(\\s|$)').test(className)
  );
}

// @function setClass(el: HTMLElement, name: String)
// Sets the element's class.
export function setClass(el: ELType, name: string) {
  if (el instanceof HTMLElement) {
    el.className = name;
  } else {
    // in case of SVG element
    el.className.baseVal = name;
  }
}

// @function getClass(el: HTMLElement): String
// Returns the element's class.
export function getClass(el: ELType) {
  // Check if the element is an SVGElementInstance and use the correspondingElement instead
  // (Required for linked SVG elements in IE11.)
  if (el instanceof SVGElement) {
    el = el.correspondingElement;
  }
  return el.className.baseVal === undefined
    ? el.className
    : el.className.baseVal;
}

export function empty(el: ELType) {
  while (el && el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

const transformProp = testProp(['transform', 'WebkitTransform']);

export function setTransform(el: ELType, value: string) {
  // @ts-ignore
  el.style[transformProp] = value;
}

export function triggerResize() {
  if (typeof Event === 'function') {
    // modern browsers
    window.dispatchEvent(new Event('resize'));
  } else {
    // for IE and other old browsers
    // causes deprecation warning on modern browsers
    const evt = window.document.createEvent('UIEvents');
    // @ts-ignore
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
  }
}

export function printCanvas(canvas: HTMLCanvasElement) {
  const css = [
    'padding: ' + (canvas.height / 2 - 8) + 'px ' + canvas.width / 2 + 'px;',
    'line-height: ' + canvas.height + 'px;',
    'background-image: url(' + canvas.toDataURL() + ');',
  ];
  // tslint:disable-next-line:no-console
  console.log('%c\n', css.join(''));
}

const selectProp = testProp([
  'userSelect',
  'MozUserSelect',
  'WebkitUserSelect',
  'msUserSelect',
]);
let userSelect: any;

export function disableDrag() {
  if (docStyle && selectProp) {
    userSelect = docStyle[selectProp];
    docStyle[selectProp] = 'none';
  }
}

export function enableDrag() {
  if (docStyle && selectProp) {
    docStyle[selectProp] = userSelect;
  }
}

let passiveSupported = false;

try {
  // https://github.com/facebook/flow/issues/285
  // $FlowFixMe
  const options = Object.defineProperty({}, 'passive', {
    get() {
      // eslint-disable-line
      passiveSupported = true;
    },
  });
  window.addEventListener('test', options, options);
  window.removeEventListener('test', options, options);
} catch (err) {
  passiveSupported = false;
}

export function addEventListener(
  target: any,
  type: any,
  callback: any,
  options: { passive?: boolean; capture?: boolean } = {},
) {
  if ('passive' in options && passiveSupported) {
    target.addEventListener(type, callback, options);
  } else {
    target.addEventListener(type, callback, options.capture);
  }
}

export function removeEventListener(
  target: any,
  type: any,
  callback: any,
  options: { passive?: boolean; capture?: boolean } = {},
) {
  if ('passive' in options && passiveSupported) {
    target.removeEventListener(type, callback, options);
  } else {
    target.removeEventListener(type, callback, options.capture);
  }
}

export function mousePos(el: HTMLElement, e: MouseEvent | Touch) {
  const rect = el.getBoundingClientRect();
  return new Point(
    e.clientX - rect.left - el.clientLeft,
    e.clientY - rect.top - el.clientTop,
  );
}

export function mouseButton(e: MouseEvent) {
  if (
    // @ts-ignore
    typeof window.InstallTrigger !== 'undefined' &&
    e.button === 2 &&
    e.ctrlKey &&
    window.navigator.platform.toUpperCase().indexOf('MAC') >= 0
  ) {
    // Fix for https://github.com/mapbox/mapbox-gl-js/issues/3131:
    // Firefox (detected by InstallTrigger) on Mac determines e.button = 2 when
    // using Control + left click
    return 0;
  }
  return e.button;
}

export function touchPos(el: HTMLElement, touches: Touch[] | TouchList) {
  const rect = el.getBoundingClientRect();
  const points = [];
  for (const touche of touches) {
    points.push(
      new Point(
        touche.clientX - rect.left - el.clientLeft,
        touche.clientY - rect.top - el.clientTop,
      ),
    );
  }
  return points;
}
