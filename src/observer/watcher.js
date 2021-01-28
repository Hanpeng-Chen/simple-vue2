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
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }
    this.deps = [];
    this.depsId = new Set();

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
  update() {
    // 这里需要加上防抖，不然连续多次更新属性，每次更新都会执行update
    this.get();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
}

export default Watcher;
