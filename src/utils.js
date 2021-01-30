export function isFunction(val) {
  return typeof val === "function";
}

export function isObject(val) {
  return typeof val === "object" && val !== null;
}

const callbacks = [];

function flushCallbacks() {
  callbacks.forEach((cb) => cb());
  waiting = false;
}

let waiting = false;

let timerFn = () => {};

// Promise和MutationObserver是微任务，都是一个异步任务
// 微任务是在页面渲染前完成，但是我们取的是内存中的dom，不关系页面渲不渲染
if (Promise) {
  timerFn = () => {
    Promise.resolve().then(flushCallbacks);
  };
} else if (MutationObserver) {
  let textNode = document.createTextNode(1);
  let observer = new MutationObserver(flushCallbacks);
  observer.observe(textNode, {
    characterData: true,
  });
  timerFn = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timerFn = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFn = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb) {
  callbacks.push(cb);
  if (!waiting) {
    // setTimeout(flushCallbacks, 0);
    // 在Vue3中不考虑兼容性问题，直接用 Promise.resolve().then(flushCallbacks)
    // Vue2写法，考虑了兼容性问题
    timerFn();
    waiting = true;
  }
}
