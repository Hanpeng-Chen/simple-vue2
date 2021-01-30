import Watcher from "./observer/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode){
    // console.log('vnode', vnode)

    // 这里既有初始化，又有更新
    const vm = this
    vm.$el = patch(vm.$el, vnode) // 如果没有将path后的结果重新赋值给vm.$el，在第一次渲染后最开始的$el已经被删除，后续更新会报找不到老节点
  }

  Vue.prototype.$nextTick = nextTick;
}


export function mountComponent(vm, el) {

  let updateComponent = () => { // 后续更新可以调用updateComponent方法
    // 调用render函数，生成虚拟dom
    vm._update(vm._render())

    // 用虚拟dom生成真实dom
  }

  // updateComponent();
  new Watcher(vm, updateComponent, ()=> {
    console.log('更新视图')
  }, true) // 它是一个渲染watcher，后续会有其他的watcher
}