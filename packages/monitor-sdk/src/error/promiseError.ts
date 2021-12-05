// 监听Promise的错误

import { getLastEvent, getLines, getSelector } from "../utils/ErrorHandle";
import tracker from "../utils/tracker";

export function injectPromiseError() {
  //监听全局未捕获的错误
  window.addEventListener('unhandledrejection', (event) => {
    let lastEvent = getLastEvent();
    let message;
    let filename;
    let line = 0;
    let column = 0;
    let stack = '';
    let reason = event.reason;
    // Promise的错误类型分为两种情况
    // 一种是直接reject出来了并且没有进行catch
    // 一种是直接在运行中产生了报错
    // 这两种报错都不会被window.onerror给捕获到
    if (typeof reason === 'string') {
      message = reason;
    } else if (typeof reason === 'object') {//说明是一个错误对象
      message = reason.message;
      if (reason.stack) {
        // Promise错误的报错函数是在stack里面的
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        line = matchResult[2];
        column = matchResult[3];
      }

      stack = getLines(reason.stack);
    }
    tracker.send({
      kind: 'stability',//监控指标的大类
      type: 'error',//小类型 这是一个错误
      errorType: 'promiseError',//JS执行错误
      message,//报错信息
      filename,//哪个文件报错了
      position: `${line}:${column}`,
      stack,
      selector: lastEvent ? getSelector((lastEvent as any).path) : '' //代表最后一个操作的元素
    });
  }, true);

}