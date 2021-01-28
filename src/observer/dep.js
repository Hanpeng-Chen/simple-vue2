let id = 0;
class Dep {
  // 每个属性分配一个dep，dep可以存放watcher，watcher中还要存放这个dep
  constructor() {
    this.id = id++;
  }
}

Dep.target = null;

export function pushTarget(watcher) {
  Dep.target = watcher;
}

export function popTarget() {
  Dep.target = null;
}

export default Dep;
