const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
//           aa  =   "  xxx "  | '  xxxx '  | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
const startTagClose = /^\s*(\/?)>/; //     />   <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

let root; // 根元素
let stack = [];
const ELEMENT_TYPE = 1; // 元素类型
const TEXT_TYPE = 3; // 文本类型

function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    parent: null,
    attrs,
  };
}

function start(tagName, attributes) {
  // console.log("start tag", tagName, attributes);
  let parent = stack[stack.length - 1]
  let element = createAstElement(tagName, attributes);
  if (!root) {
    root = element;
  }
  // currentParent = element;
  element.parent = parent;
  if (parent) {
    parent.children.push(element)
  }
  stack.push(element);
}

function end(tagName) {
  // console.log("end tagName", tagName);
  let last = stack.pop();
  if (last.tag !== tagName) {
    throw new Error("标签有误");
  }
  
}

function chars(text) {
  // console.log("text", text);
  text = text.replace(/\s/g, ""); // 去除空格
  let parent = stack[stack.length - 1];
  if (text) {
    // currentParent
    parent.children.push({
      type: TEXT_TYPE,
      text,
    });
  }
}

export function parseHTML(html) {
  function advance(n) {
    html = html.substring(n);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);
      let end, attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }

  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      // html字符串以<开头，可能是开始标签，或者是结束标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      // 匹配结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }

    // 匹配文本
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }

  return root;
}
