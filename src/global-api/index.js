import {mergeOptions} from '../utils'

export function initGlobalApi(Vue) {
  // 用来存放全局的配置，每个组件初始化的时候都会和options选项进行合并
  // Vue.components   Vue.filter   Vue.directive这些全局配置
  Vue.options = {};
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    return this; // 支持链式调用
  };
}
