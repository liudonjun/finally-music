export function addClass(el:any, className:any) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el:any, className:any) {
  el.classList.remove(className)
}
