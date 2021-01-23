import { initState } from "./state";

export function initMixin(Vue) {
  // 表示在Vue的基础上做一次混合操作
  Vue.prototype._init = function (options) {
    // console.log(options);
    // options中有el、data、props、methods等数据
    const vm = this;
    vm.$options = options; // 后面还会对options进行扩展操作

    // 对数据进行初始化 watch props data methods computed
    initState(vm);
  };
}
