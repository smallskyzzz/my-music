export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout()
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// 经典的节流函数封装
