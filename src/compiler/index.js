import { generate } from "./generate";
import { parseHTML } from "./parser";

// const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
// const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的
// const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
// //           aa  =   "  xxx "  | '  xxxx '  | xxx
// const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
// const startTagClose = /^\s*(\/?)>/; //     />   <div/>
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}

export function compileToFunction(template) {
  let root = parseHTML(template);
  // console.log('root', root)

  // 生成代码
  let code = generate(root);
  console.log(code);
}
