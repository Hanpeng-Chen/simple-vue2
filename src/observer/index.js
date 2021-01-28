import { isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(value) {
    // value.__ob__ = this; // 所有被劫持过得属性都有__ob__，this是对象，如果这样写会导致一直循环劫持this，导致爆栈
    // 将__ob__设置为不可枚举
    Object.defineProperty(value, "__ob__", {
      enumerable: false,
      configurable: false,
      value: this,
    });
    if (Array.isArray(value)) {
      // 对数组原来的方法进行改写，这里用到切片编程，即高阶函数
      value.__proto__ = arrayMethods;
      // 如果数组中的数据是对象类型，需要监控对象的变化
      this.observeArray(value);
    } else {
      // 对 对象中的所有属性进行劫持
      this.walk(value);
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
  }
}

// 核心方法
// Vue2 对对象进行遍历，每个属性用defineProperty重新定义，所以性能差
function defineReactive(data, key, value) {
  observe(value); // 递归
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      // 取值时将watcher与属性对应起来
      if (Dep.target) {
        // 如果取值时有watcher
        dep.depend(); // 让watcher保存dep，并且让dep 保存watche
      }
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        observe(newVal); // 赋值新对象，在这里进行劫持操作
        value = newVal;
        dep.notify()
      }
    },
  });
}

export function observe(data) {
  // console.log('observe', data);

  // 如果是对象才进行观测
  if (!isObject(data)) {
    return;
  }

  if (data.__ob__) return;

  return new Observer(data);
}
