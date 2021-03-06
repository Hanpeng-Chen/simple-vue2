import { createElement, createTextElement } from "./vdom";

export function renderMixin(Vue) {

  Vue.prototype._c = function() {
    return createElement(this, ...arguments)
  }

  Vue.prototype._v = function(text) {
    return createTextElement(this, text)
  }

  Vue.prototype._s = function(val) {
    return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
  }

  Vue.prototype._render = function () {
    // 调用render
    const vm = this;
    let render = vm.$options.render;

    // 用户自定义_c   _v  _s方法

    let vnode = render.call(vm);
    return vnode;
  };
}
