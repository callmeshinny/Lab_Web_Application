import { createElement, mount } from './jsx-runtime'

console.log('=== Benchmark createElement ===')

console.time('CreateElement')
for (let i = 0; i < 10000; i++) {
  createElement('div', { id: 'x' + i }, 'Hello')
}
console.timeEnd('CreateElement')

// Render benchmark: build a deep tree and mount to a hidden container in the document when run in browser via Vite
function buildTree(depth: number, breadth: number) {
  const make = (d: number) => {
  if (d === 0) return 'Leaf'
    const children = [] as any[]
    for (let i = 0; i < breadth; i++) children.push(make(d - 1))
    return createElement('div', { className: 'node' + d }, ...children)
  }
  return make(depth)
}

if (typeof document !== 'undefined') {
  console.log('\n=== Browser render benchmark ===')
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  document.body.appendChild(container)
  const tree = buildTree(4, 6) // ~6^4 nodes
  console.time('Mount')
  mount(tree, container)
  console.timeEnd('Mount')
  console.log('✅ Render benchmark finished (see console)')
}
