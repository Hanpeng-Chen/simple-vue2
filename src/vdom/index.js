import { isObject, isReservedTag } from "../utils";

export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key;
  }
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, key, children);
  } else {
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, key, children, Ctor);
  }
}

// 创建组件的虚拟节点
function createComponent(vm, tag, data, key, children, Ctor) {
  // 组件的构造函数
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }
  // 等会组件渲染时，需要调用此初始化方法
  data.hook = {
    init(vnode) {
      let vm = vnode.componentInstance = new Ctor({ _isComponent: true });
      vm.$mount();
    },
  };
  return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
    Ctor,
    children,
  });
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  };
}
