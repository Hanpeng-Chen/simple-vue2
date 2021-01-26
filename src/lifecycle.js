export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode){}
}


export function mountComponent(vm, el) {

  let updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render())

    // 用虚拟dom生成真实dom
  }

  updateComponent();
}