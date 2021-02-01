// console.log("手写Vue2源码入口文件");

import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
import { stateMixin } from "./state";

function Vue(options) {
  // options为用户传入的选项

  this._init(options); // 初始化操作
}

initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
stateMixin(Vue);

export default Vue;
