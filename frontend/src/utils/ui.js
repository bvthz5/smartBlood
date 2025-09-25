// src/utils/ui.js
// Small UI helper utilities used by the frontend pages.
// animations disabled - remove gsap dependency for counters

/**
 * Animate a numeric counter from start to end and write to `el` (DOM node)
 * @param {HTMLElement} el element whose innerText will be updated
 * @param {number} start starting number
 * @param {number} end ending number
 * @param {number} duration seconds
 */
export function animateCount(el, start, end, duration = 1.2) {
  if (!el) return
  // instant set to final value to avoid animation
  el.innerText = Math.floor(end).toLocaleString()
}

/**
 * Small ripple effect on button (adds then removes class)
 * @param {HTMLElement} btn
 */
export function ripple(btn) {
  // no-op ripple to avoid animated classes
  return
}
