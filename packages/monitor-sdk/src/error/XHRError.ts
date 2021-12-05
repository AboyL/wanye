import tracker from '../utils/tracker';
import { XHRError } from '../utils/tracker/types';

export function injectXHRError() {
  let XMLHttpRequest = window.XMLHttpRequest;
  let oldOpen = XMLHttpRequest.prototype.open;
  let logData: any = null

  XMLHttpRequest.prototype.open = function (method, url: string, async?, username?, password?) {
    if (!url.match(/logstores/) && !url.match(/sockjs/)) {
      logData = { method, url, async, username, password };
    } else {
      logData = null
    }
    return oldOpen.apply(this, arguments as any);
  }

  //axios 背后有两种 如果 browser XMLHttpRequest  node http
  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    if (logData) {
      let startTime = Date.now();//在发送之前记录一下开始的时间
      let handler = (type: XHRError) => () => {
        let duration = Date.now() - startTime;
        let status = this.status;//200 500
        let statusText = this.statusText;// OK Server Error
        tracker.send({
          kind: 'stability',
          type: 'xhrError',
          eventType: type,//load error abort
          requestUrl: logData.url,//请求路径
          status: status + '-' + statusText,//状态码
          duration,//持续时间
          response: this.response ? JSON.stringify(this.response) : '',//响应体
          params: body || ''
        });
      }

      this.addEventListener('load', handler('loadXHRError'), false);
      this.addEventListener('error', handler('errorXHRError'), false);
      this.addEventListener('abort', handler('abortXHRError'), false);

    }
    return oldSend.apply(this, arguments as any);
  }
}