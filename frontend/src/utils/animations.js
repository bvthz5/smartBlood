// src/utils/animations.js
// Animation helpers disabled - provide no-op implementations so pages don't animate

export function entrance(node, options = {}){
  // no-op: ensure node is visible and reset transforms
  try {
    if (!node) return
    if (node.style) {
      node.style.opacity = ''
      node.style.transform = ''
    }
  } catch (e) { /* swallow */ }
}

export function staggerReveal(selector, opts = {}){
  // no-op: make sure elements are visible
  try {
    let nodes = selector
    if (typeof selector === 'string') nodes = document.querySelectorAll(selector)
    if (!nodes) return
    if (nodes.nodeType) nodes.style.opacity = ''
    else for (const n of nodes) if (n && n.style) n.style.opacity = ''
  } catch (e) { /* swallow */ }
}

export function marquee(el){
  // no-op: leave inner text as-is
  return
}
