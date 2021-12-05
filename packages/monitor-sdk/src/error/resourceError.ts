// 监听js的错误

import { getSelector } from "../utils/ErrorHandle";
import tracker from "../utils/tracker";

// 一样在jsError里面进行处理
// 注意进行区分 对资源文件
export function injectResourceError() {
  window.addEventListener('error', function (event: any) {//错误事件对象
    if (event.target && (event.target.src || event.target.href)) {
      tracker.send({
        kind: 'stability',//监控指标的大类
        type: 'error',//小类型 这是一个错误
        errorType: 'resourceError',//js或css资源加载错误
        filename: event.target.src || event.target.href,//哪个文件报错了
        tagName: event.target.tagName,//SCRIPT
        selector: getSelector(event.target) //代表最后一个操作的元素
      });
    }
  }, true);
}