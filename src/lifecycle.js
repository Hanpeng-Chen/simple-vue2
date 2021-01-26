import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode){
    // console.log('vnode', vnode)

    // 这里既有初始化，又有更新
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}


export function mountComponent(vm, el) {

  let updateComponent = () => { // 后续更新可以调用updateComponent方法
    // 调用render函数，生成虚拟dom
    vm._update(vm._render())

    // 用虚拟dom生成真实dom
  }

  updateComponent();
}