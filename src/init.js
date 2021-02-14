import { compileToFunction } from "./compiler";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./utils";

export function initMixin(Vue) {
  // 表示在Vue的基础上做一次混合操作
  Vue.prototype._init = function (options) {
    // console.log(options);
    // options中有el、data、props、methods等数据
    const vm = this;
    vm.$options = mergeOptions(vm.constructor.options, options); // 后面还会对options进行扩展操作

    callHook(vm, "beforeCreate");
    // 对数据进行初始化 watch props data methods computed
    initState(vm);
    callHook(vm, "created");

    if (vm.$options.el) {
      // 将数据挂载到这个模板上
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;

    el = document.querySelector(el);
    vm.$el = el;
    // console.log(el)

    // 这里如果直接用正则去替换真实DOM中的数据，太消耗性能
    // 思路：将模板转化成 对应的渲染函数 =》 产生虚拟dom =》 利用diff算法更新虚拟dom =》 最后产生真实dom
    if (!options.render) {
      // 如果没有渲染函数
      let template = options.template;
      if (!template && el) {
        // 没有模板但是有el
        template = el.outerHTML;
      }
      let render = compileToFunction(template);
      options.render = render;
    }
    // 此时options.render就是渲染函数

    // 组件挂载
    mountComponent(vm, el);
  };
}
