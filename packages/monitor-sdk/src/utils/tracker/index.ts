// 参考文档
// https://help.aliyun.com/document_detail/31752.html

import { project, host, logStore } from "./config";
import { TrackerProps } from "./types";

let userAgent = require('user-agent');

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
    //用户ID
  }
}

//gif图片做上传 图片速度 快没有跨域 问题，
class SendTracker {
  url: string
  xhr: XMLHttpRequest
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logStore}/track`;//上报的路径
    this.xhr = new XMLHttpRequest;
  }
  send(data:TrackerProps) {
    let extraData = getExtraData();
    let log: { [props: string]: any } = { ...extraData, ...data };
    //对象 的值不能是数字
    for (let key in log) {
      if (typeof log[key] === 'number') {
        log[key] = `${log[key]}`;
      }
    }
    let body = JSON.stringify({
      __logs__: [log]
    });
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('Content-Type', 'application/json');//请求体类型
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');//版本号
    this.xhr.setRequestHeader('x-log-bodyrawsize', `${body.length}`);//请求体的大小
    this.xhr.onload = function () {
      // console.log('on load')
    }
    this.xhr.onerror = function (error) {
      console.error('onerror', error);
    }

    this.xhr.send(body);
  }
}

export default new SendTracker();