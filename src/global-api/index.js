import { mergeOptions } from "../utils";

export function initGlobalApi(Vue) {
  // 用来存放全局的配置，每个组件初始化的时候都会和options选项进行合并
  // Vue.components   Vue.filter   Vue.directive这些全局配置
  Vue.options = {};
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    return this; // 支持链式调用
  };

  // _base 就是Vue的构造函数
  Vue.options._base = Vue; // 无论后续创建多少个子类，都可以通过_base找到Vue
  Vue.options.components = {};
  Vue.component = function (id, definition) {
    // 保证组件的隔离，每个组件都会产生一个新的类，去继承父类
    definition = this.options._base.extend(definition);
    this.options.components[id] = definition;
  };


  // 产生一个继承于Vue的类，并且身上应该有父类的所有功能
  Vue.extend = function (opts) {
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options)
    };

    // 原型继承
    Sub.prototype = Object.create(Super.prototype);
    // 需要重写constructor，否则它指向的是父类
    Sub.prototype.constructor = Sub;
    // options合并，让子类也包含全局的options
    Sub.options = mergeOptions(Super.options, opts)
    return Sub;
  };
}
