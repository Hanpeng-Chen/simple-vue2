import { nextTick } from "../utils";

let queue = [];
let has = {}; // 做列表的，列表维护存放了哪些watcher

let pending = false;
export function queueWatcher(watcher) {
  const id = watcher.id;

  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;

    // 开启一次更新操作，批处理，也就是防抖操作

    if (!pending) {
      // setTimeout(flushSchedulerQueue, 0);
      // 使用setTimeout是宏任务
      nextTick(flushSchedulerQueue)
      pending = true;
    }
  }
}

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  has = {};
  pending = false;
}
