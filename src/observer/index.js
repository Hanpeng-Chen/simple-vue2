import { isObject } from "../utils";

class Observer {
  constructor(data) {
    // 对 对象中的所有属性进行劫持
    this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

// 核心方法
// Vue2 对对象进行遍历，每个属性用defineProperty重新定义，所以性能差
function defineReactive(obj, key, value) {
  observe(value); // 递归
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newVal) {
      observe(newVal); // 赋值新对象，在这里进行劫持操作
      value = newVal;
    },
  });
}

export function observe(data) {
  // console.log('observe', data);
  // 如果是对象才进行观测
  if (!isObject(data)) {
    return;
  }

  return new Observer(data);
}
