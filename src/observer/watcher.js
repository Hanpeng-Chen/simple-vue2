import { popTarget, pushTarget } from "./dep";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;

    // 默认应该让exprOrFn执行
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    }

    // 默认初始化，要取值
    this.get();
  }
  get() {
    // 在属性取值前，将属性和watcher进行关联，将关联关系收集到dep中
    // 一个属性可以对应多个watcher，一个watcher可以对应多个属性
    pushTarget(this);
    this.getter();
    popTarget();
  }
}

export default Watcher;
