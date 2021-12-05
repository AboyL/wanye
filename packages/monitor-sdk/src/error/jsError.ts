// 监听js的错误

import { getLastEvent, getLines, getSelector } from "../utils/ErrorHandle";
import tracker from "../utils/tracker";

export function injectJsError() {
  //监听全局未捕获的错误
  window.addEventListener('error', function (event) {//错误事件对象
    let lastEvent = getLastEvent();//最后一个交互事件
    // 不处理资源上传事件
    if (event.target &&
      // 有可能是资源加载错误导致的
      ((event.target as any).src || (event.target as any).href)) {
      return
    }
    tracker.send({
      kind: 'stability',//监控指标的大类
      type: 'error',//小类型 这是一个错误
      errorType: 'jsError',//JS执行错误
      message: event.message,//报错信息
      filename: event.filename,//哪个文件报错了
      position: `${event.lineno}:${event.colno}`,
      stack: getLines(event.error.stack),
      //body div#container div.content input
      selector: lastEvent ? getSelector((lastEvent as any).path) : '' //代表最后一个操作的元素
    });
  }, true);

}