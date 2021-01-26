const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 针对style这个属性进行特殊处理，将其值转为对象
    if (attr.name === "style") {
      let obj = {};
      // attr.value.split(';').forEach(item => {
      //   let [key, value] = item.split(':')
      //   obj[key] = value
      // });

      // 正则匹配
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
        obj[arguments[1]] = arguments[2];
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function gen(el) {
  if (el.type === 1) {
    return generate(el);
  } else {
    // 处理本文
    let text = el.text;
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`;
    }
    let lastIndex = (defaultTagRE.lastIndex = 0); // 重置正则为空
    let tokens = [];
    let match;
    while ((match = defaultTagRE.exec(text))) {
      let index = match.index; //开始索引
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      tokens.push(`_s(${match[1].trim()})`); // 有可能是对象，等同于JSON.stringify
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return `_v(${tokens.join("+")})`;
  }
}

function genChildren(el) {
  let children = el.children;
  if (children) {
    return children.map((c) => gen(c)).join(",");
  }
  return false;
}

export function generate(el) {
  // _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
  // 本质就是遍历树，拼接成字符串

  let children = genChildren(el);
    let code = `_c('${el.tag}',${
        el.attrs.length? genProps(el.attrs):'undefined'
    }${
        children? `,${children}`:''
    })`;

  return code;
}
