import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.user = !!options.user; // 是不是用户自己写的watcher
    this.cb = cb;
    this.options = options;
    this.id = id++;

    // 默认应该让exprOrFn执行
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    } else if (typeof exprOrFn === "string") {
      // 用户自定义的watcher中exprOrFn是字符串，需要将其转化成一个函数
      this.getter = function () {
        // 取值就会触发getter方法，进行依赖收集
        // exprOrFn可能值：name  age.value
        let path = exprOrFn.split(".");
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      };
    }
    this.deps = [];
    this.depsId = new Set();

    // 默认初始化，要取值
    this.value = this.get(); // 第一次的value
  }
  get() {
    // 在属性取值前，将属性和watcher进行关联，将关联关系收集到dep中
    // 一个属性可以对应多个watcher，一个watcher可以对应多个属性
    pushTarget(this);
    const value = this.getter(); // 这里的value是新的值
    popTarget();
    return value;
  }
  update() {
    // 这里需要加上防抖，不然连续多次直接调用this.get()更新属性，每次更新都会执行update
    // this.get();

    // 每次更新时 将watcher存起来
    queueWatcher(this); // 多次调用update，先将watcher缓存下来，等一会一起更新  =》  Vue中的更新操作时异步的
  }
  run() {
    let newValue = this.get();
    let oldValue = this.value;
    this.value = newValue; // 为了保证下一次更新时，上一次的最新值是下一次的老值
    if (this.user) {
      this.cb.call(this.vm, this.value, oldValue)
    }
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
