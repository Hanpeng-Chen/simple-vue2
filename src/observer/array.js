let oldArrayPrototype = Array.prototype;

export let arrayMethods = Object.create(oldArrayPrototype); // 继承 arrayMethods.__proto__ = Array.prototype

let methods = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"];

methods.forEach((method) => {
  // 用户调用的如果是上面七个方法中之一，调用下面重写的方法，否则调用原来数组原型上的方法
  arrayMethods[method] = function (...args) {
    // console.log("数组数据发生变化");
    oldArrayPrototype[method].call(this, ...args);

    let inserted;
    let ob = this.__ob__; // 根据当前数组获取到observer实例
    switch (method) {
      case "push":
      case "unshift":
        // args就是新增的数据
        inserted = args;
        break;
      case "splice":
        inserted = args.splice(2);
      default:
        break;
    }

    // 新增内容需要继续进行劫持，需要观测数组中的每一项，而不是数组
    if (inserted) {
      ob.observeArray(inserted);
    }
  };
});
