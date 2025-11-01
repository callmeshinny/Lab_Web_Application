declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface Element { }
    interface ElementClass { }
    interface IntrinsicAttributes { key?: any }
  }
}

export {}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
