export interface TrackerProps {
  // 监控指标的大类
  // stability 稳定性监控
  kind: 'stability',
  // 错误监控等
  type: 'error',
  // JS执行错误
  // Promise 错误
  // 资源加载错误
  // 手动上报错误
  errorType: 'jsError' | 'promiseError' | 'resourceError',
  // 报错信息
  message?: string,
  // filename 哪个文件报错了
  filename: string,
  // tagName 哪个资源出错
  tagName?: string,
  // position 报错位置
  position?: `${number}:${number}`,
  // stack 报错堆栈
  stack?: string,
  // selector 报错的选择器位置
  selector: string
}