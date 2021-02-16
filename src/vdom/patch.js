export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    // 如果没有el元素，直接根据虚拟节点返回真实节点
    return createEle(vnode);
  }

  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 如果老节点是真实节点，用vnode来生成真实dom，替换原来的dom元素

    const parentEle = oldVnode.parentNode;

    let element = createEle(vnode);

    parentEle.insertBefore(element, oldVnode.nextSibling);

    parentEle.removeChild(oldVnode); // 删除旧节点

    return element;
  } else {
    // diff
    // 如果老的标签名和新的标签名不一样，直接替换掉
    if (oldVnode.tag !== vnode.tag) {
      // 可以通过vnode.el属性，获取现在真实的dom元素
      oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
    }
    let el = (vnode.el = oldVnode.el);
    // 如果两个虚拟节点是文本节点，比较文本内容
    if (vnode.tag == undefined) {
      if (oldVnode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
      return;
    }

    // 如果标签一样，比较属性，传入新的虚拟节点，和老的属性，用新的属性更新老的节点属性
    updateProperties(vnode, oldVnode.props);

    // 新老节点一方没有子节点
    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 双方都有儿子
      patchChildren(el, oldChildren, newChildren);
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        let child = createEle(newChildren[i]);
        el.appendChild(child);
      }
    } else if (oldChildren.length > 0) {
      // 直接删除老节点的子节点
      el.innerHTML = ``;
    }
  }
}

// 创建组件的真实节点
function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);
  }
  // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了vnode.componentInstance.$el
  if (vnode.componentInstance) {
    return true;
  }
  return false;
}

function createEle(vnode) {
  let { tag, data, key, children, text } = vnode;
  if (typeof tag === "string") {
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el;
    }

    vnode.el = document.createElement(tag); // 虚拟节点会有一个el属性对应真实节点
    updateProperties(vnode); // 设置属性值
    children.forEach((child) => {
      return vnode.el.appendChild(createEle(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {};
  let el = vnode.el;

  // 如果老的属性有，新的没有直接删除
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = "";
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  for (let key in newProps) {
    if (key === "style") {
      // 如果属性是style
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      // 如果属性是class
      el.className = newProps.class;
    } else {
      // 其他属性
      el.setAttribute(key, newProps[key]);
    }
  }
}

function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag == newVnode.tag && oldVnode.key == newVnode.key;
}

// 比对儿子节点
function patchChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  if (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 同时循环新的节点和老的节点，有一方循环完毕就结束

    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头头比较，发现标签一致
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 头尾比较
      patch(oldStartVnode, newEndVnode)
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 尾头比较
      patch(oldEndVnode, newStartVnode)
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    }

    // 用户追加了一个怎么办？

    if (newStartIndex <= newEndIndex) {
      for (let i = newStartIndex; i < newEndIndex; i++) {
        // el.appendChild(createEle(newChildren[i]));
        // 看指针的下一个节点是否为空
        let anchor =
          newChildren[newEndIndex + 1] == null
            ? null
            : newChildren[newEndIndex + 1].el;
        el.insertBefore(createEle(newChildren[i]), anchor);
      }
    }

    // 老的有多余的节点
    if (oldStartIndex <= oldEndIndex) {
      for (let i = oldStartIndex; i < oldEndIndex; i++) {
        el.removeChild(oldChildren[i].el);
      }
    }
  }
}
