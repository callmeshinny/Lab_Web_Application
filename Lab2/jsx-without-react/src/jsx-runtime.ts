/** @jsx createElement */

// === Enhanced JSX Runtime (with refs, CSS-in-JS, event delegation) ===

export interface VNode {
  type: string | ComponentFunction
  props: Record<string, any>
  children: (VNode | string | number)[]
}
export type ComponentFunction = (props: any) => VNode

// runtime state
let __hooks: any[] = []
let __hookIndex = 0
let __rootVNode: VNode | null = null
let __rootContainer: HTMLElement | null = null
let __oldResolved: VNode | string | number | null = null

// global event delegation registry (click delegation)
const __delegatedEvents: Record<string, (e: Event, el: HTMLElement) => void> = {}
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement | null
  if (!target) return
  const el = target.closest?.("[data-click-id]") as HTMLElement | null
  if (!el) return
  const id = el.getAttribute("data-click-id")
  if (id && __delegatedEvents[id]) __delegatedEvents[id](e, el)
})

// --- createElement ---
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  props = props || {}
  const flat = children.flat(Infinity).filter(c => c != null)
  return { type, props, children: flat }
}

// --- renderToDOM ---
export function renderToDOM(vnode: VNode | string | number): Node {
  if (typeof vnode === "string" || typeof vnode === "number") return document.createTextNode(String(vnode))
  if ((vnode as VNode).type === "fragment") {
    const frag = document.createDocumentFragment()
    const children = (vnode as VNode).children || []
    for (const c of children) frag.appendChild(renderToDOM(c as any))
    return frag
  }
  if (typeof (vnode as VNode).type === "function") {
    // resolve component output before rendering
    const rendered = ((vnode as VNode).type as ComponentFunction)({ ...(vnode as VNode).props, children: (vnode as VNode).children || [] })
    const resolved = resolveVNode(rendered)
    return renderToDOM(resolved as any)
  }

  const el = document.createElement((vnode as VNode).type as string)

  for (const [k, v] of Object.entries((vnode as VNode).props || {})) {
    if (k === "style") {
      // ✅ CSS-in-JS Support
      if (typeof v === "string") {
        (el as HTMLElement).setAttribute("style", v)
      } else if (v && typeof v === "object") {
        for (const [prop, val] of Object.entries(v as Record<string, any>)) {
          const kebab = prop.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
          ;(el as HTMLElement).style.setProperty(kebab, String(val))
        }
      }
    }
    else if (k === "ref" && typeof v === "function") {
      // ✅ Refs Support
      v(el)
    }
    else if (k.startsWith("on") && typeof v === "function") {
      // ✅ Event Delegation for onClick
      const ev = k.substring(2).toLowerCase()
      if (ev === "click") {
        const id: string = Math.random().toString(36).slice(2)
        el.setAttribute("data-click-id", id)
        __delegatedEvents[id] = ((e: Event, el: HTMLElement) => { try { ;(v as any)(e, el) } catch {} }) as any
      } else {
        el.addEventListener(ev, v)
      }
    }
    else if (k === "className") {
      if (v != null && v !== false) el.setAttribute("class", String(v))
    }
    else if (k === "checked" || k === "selected" || k === "disabled" || k === "multiple") {
      ;(el as any)[k] = !!v
    }
    else if (k === "value") {
      ;(el as any).value = v
    }
    else if (v !== false && v != null) {
      el.setAttribute(k, String(v))
    }
  }

  for (const c of (vnode as VNode).children || []) el.appendChild(renderToDOM(c as any))
  return el
}

// --- diffing helpers (same as before) ---
const __listeners = new WeakMap<Node, Record<string, EventListener | string>>()

function removeDelegatedIdIfAny(el: Element) {
  const id = el.getAttribute('data-click-id')
  if (id) {
    delete __delegatedEvents[id]
    el.removeAttribute('data-click-id')
  }
}

function applyProps(element: Element, oldProps: any, newProps: any) {
  oldProps = oldProps || {}
  newProps = newProps || {}

  // remove props that disappeared
  for (const k of Object.keys(oldProps)) {
    if (k === 'children') continue
    if (newProps[k] !== undefined) continue
    if (k === 'style') {
      if (typeof oldProps.style === 'string') element.removeAttribute('style')
      else if (typeof oldProps.style === 'object') {
        for (const prop of Object.keys(oldProps.style)) {
          (element as HTMLElement).style.removeProperty(prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase()))
        }
      }
    } else if (k === 'className') {
      element.removeAttribute('class')
    } else if (k.startsWith('on') && typeof oldProps[k] === 'function') {
      const ev = k.substring(2).toLowerCase()
      const listeners = __listeners.get(element)
      if (ev === 'click') {
        // delegated click
        removeDelegatedIdIfAny(element)
      } else {
        if (listeners && listeners[ev]) element.removeEventListener(ev, listeners[ev] as EventListener)
        if (listeners) { delete listeners[ev]; __listeners.set(element, listeners) }
      }
    } else if (k === 'value') {
      try { ;(element as any).value = '' } catch {}
    } else {
      element.removeAttribute(k)
    }
  }

  // add / update props
  for (const [k, v] of Object.entries(newProps || {})) {
    if (k === 'children') continue
    if (k === 'style') {
      if (typeof v === 'string') element.setAttribute('style', v)
      else if (typeof v === 'object') {
        for (const [prop, val] of Object.entries(v)) {
          ;(element as HTMLElement).style.setProperty(prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), String(val))
        }
      }
    }
    else if (k === 'ref' && typeof v === 'function') {
      try { v(element) } catch {}
    }
    else if (k === 'className') {
      if (v != null && v !== false) element.setAttribute('class', String(v))
      else element.removeAttribute('class')
    }
    else if (k.startsWith('on') && typeof v === 'function') {
      const ev = k.substring(2).toLowerCase()
      if (ev === 'click') {
        // delegated click handler: store a random id on element and central registry
        // remove old delegated id if present
        removeDelegatedIdIfAny(element);
        const id: string = Math.random().toString(36).slice(2);
        (element as HTMLElement).setAttribute('data-click-id', id);
        __delegatedEvents[id] = ((e: Event, el: HTMLElement) => { try { ;(v as Function)(e, el) } catch {} }) as any
        // store marker in listeners map so removal works
        const listeners = __listeners.get(element) || {}
        listeners['click'] = id
        __listeners.set(element, listeners)
      } else {
        const listeners = __listeners.get(element) || {}
        // remove previous if different
        if (listeners[ev]) element.removeEventListener(ev, listeners[ev] as EventListener)
        element.addEventListener(ev, v as EventListener)
        listeners[ev] = v as EventListener
        __listeners.set(element, listeners)
      }
    }
    else if (k === 'checked' || k === 'selected' || k === 'disabled' || k === 'multiple') {
      try { ;(element as any)[k] = !!v } catch {}
    }
    else if (k === 'value') {
      // set as property to preserve caret when possible
      try { ;(element as any).value = v } catch { element.setAttribute('value', String(v)) }
    }
    else if (v !== false && v != null) {
      element.setAttribute(k, String(v))
    }
  }
}

export function resolveVNode(vnode: VNode | string | number): VNode | string | number {
  if (typeof vnode === "string" || typeof vnode === "number") return vnode
  if (typeof vnode.type === "function")
    return resolveVNode((vnode.type as ComponentFunction)({ ...vnode.props, children: vnode.children }))
  if (vnode.type === "fragment")
    return { type: "fragment", props: vnode.props, children: vnode.children.map(c => resolveVNode(c) as any) }
  return { type: vnode.type, props: vnode.props, children: vnode.children.map(c => resolveVNode(c) as any) }
}

function patch(parent: Node, domNode: Node | null, oldVNode: any, newVNode: any): Node | null {
  if (oldVNode == null && newVNode != null) {
    const nd = renderToDOM(newVNode); if (domNode) parent.insertBefore(nd, domNode); else parent.appendChild(nd); return nd
  }
  if (newVNode == null && domNode) { parent.removeChild(domNode); return null }
  if (typeof oldVNode === "string" || typeof oldVNode === "number") {
    if (String(oldVNode) !== String(newVNode) && domNode) {
      const t = document.createTextNode(String(newVNode)); parent.replaceChild(t, domNode); return t
    }
    return domNode
  }
  if (typeof oldVNode !== "string" && typeof newVNode !== "string") {
    if (oldVNode.type !== newVNode.type) {
      const nd = renderToDOM(newVNode); if (domNode) parent.replaceChild(nd, domNode); else parent.appendChild(nd); return nd
    }
    const el = domNode as Element
    applyProps(el, oldVNode.props || null, newVNode.props || null)
    const oldCh = oldVNode.children || [], newCh = newVNode.children || []
    const max = Math.max(oldCh.length, newCh.length)
    for (let i = 0; i < max; i++) patch(el, el.childNodes[i] || null, oldCh[i] ?? null, newCh[i] ?? null)
    return el
  }
  const nd = renderToDOM(newVNode); if (domNode) parent.replaceChild(nd, domNode); else parent.appendChild(nd); return nd
}

export function mount(vnode: any, container: HTMLElement) {
  __rootVNode = vnode
  __rootContainer = container
  __hookIndex = 0
  const resolved = resolveVNode(__rootVNode!)
  container.innerHTML = ""
  container.appendChild(renderToDOM(resolved))
  __oldResolved = resolved
}

function renderRoot() {
  if (!__rootVNode || !__rootContainer) return
  __hookIndex = 0
  const newResolved = resolveVNode(__rootVNode)
  try {
    patch(__rootContainer, __rootContainer.childNodes[0] || null, __oldResolved, newResolved)
  } catch {
    __rootContainer.innerHTML = ""
    __rootContainer.appendChild(renderToDOM(newResolved))
  }
  __oldResolved = newResolved
}

export function useState<T>(initial: T): [() => T, (v: T) => void] {
  const i = __hookIndex++
  if (__hooks[i] === undefined) __hooks[i] = initial
  const getter = () => __hooks[i] as T
  const setter = (v: T) => { __hooks[i] = v; renderRoot() }
  return [getter, setter]
}
