import { observe } from "./observer";
import { isFunction } from "./utils";

export function initState(vm) {
  // 状态初始化

  const opts = vm.$options;

  if (opts.props) {
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get(){
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data;

  // vue2中使用Object.defineProperty对对象进行数据劫持
  // data有可能是函数或者是个对象
  // 如果是函数，用call让函数中的this指向vm
  // 此时data和vm没有任何关系，我们在vm实例上拿不到劫持后的数据，通过_data进行关联
  data = vm._data = isFunction(data) ? data.call(vm) : data;

  // console.log(data);

  // 用户通过 vm.xxx 的方式取值，等价于到 vm._data.xxx
  for (let key in data) {
    proxy(vm, '_data', key);
  }

  // 对数据进行观测
  observe(data)
}
