export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 如果老节点是真实节点，用vnode来生成真实dom，替换原来的dom元素

    const parentEle = oldVnode.parentNode;

    let element = createEle(vnode);

    parentEle.insertBefore(element, oldVnode.nextSibling);

    parentEle.removeChild(oldVnode); // 删除旧节点
  }
}

function createEle(vnode) {
  let { tag, data, key, children, text } = vnode;
  if (typeof tag === "string") {
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

function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;
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
