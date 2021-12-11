// 元组转联合类型
// 元组转枚举类型
type TupleWithString<T, U extends string, Pre extends any[] = []> =
  T extends [infer L, ...infer R]
  ?
  L extends string ?
  TupleWithString<R, U, [...Pre, `${L}${U}`]> : never
  : Pre

type TupleToUnion<T extends readonly any[]> =
  T extends [infer R, ...infer args]
  ? R | TupleToUnion<args>
  : never

type TupleKeys<
  T extends readonly any[]
  > = T extends readonly [infer R, ...infer args]
  ? TupleKeys<args> | args['length']
  : never

type TupleToEnum<T extends readonly string[]> = {
  readonly [K in TupleKeys<T> as Capitalize<T[K]>]: T[K]
}

export type XHRError = TupleToUnion<TupleWithString<['load', 'error', 'abort'], 'XHRError'>>

// 实际上是一个接口而不是一个枚举
export type XHRErrorEnum = TupleToEnum<TupleWithString<['load', 'error', 'abort'], 'XHRError'>>


// 时间性能检测
export type TrackerTiming = Partial<{
  dnsTime: number, // dns解析耗时
  connectTime: number,  //连接时间
  ttfbTime: number, //首字节到达时间
  reqTime: number, // 内容传输耗时
  analysisDomTime: number, // 文档解析耗时
  blankTime: number, //白屏时间
  timeToInteractive: number, //首次可交互时间
  domContentLoadedTime: number, // 资源请求耗时
  parseDOMTime: number, //DOM解析的时间 整个的时间包括了资源的加载时间
  domReadyTime: number, // dom ready时间 此时是总的资源加载完了的这些时间
  loadTIme: number, //完整的加载时间
  firstPaint: number, // FP
  firstContentfulPaint: number, // FCP
  firstMeaningfulPaint: number, // FMP
  largestContentfulPaint: number, // LCP
}>

export type FIDTiming = Partial<{
  inputDelay: number,//延时的时间
  duration: number,//处理的时间
  startTime: number, // 开始时间
}>

export interface TrackerProps extends TrackerTiming, FIDTiming {
  // 监控指标的大类
  // stability 稳定性监控
  kind: 'stability' | 'experience',
  // 错误监控等
  type: 'error' | 'xhrError' | 'blank' | 'timing' | 'firstInputDelay',
  // JS执行错误
  // Promise 错误
  // 资源加载错误
  // 手动上报错误
  errorType?: 'jsError' | 'promiseError' | 'resourceError',
  eventType?: XHRError,
  status?: string,
  // 报错信息
  message?: string,
  duration?: number,
  response?: string,
  params?: any,
  requestUrl?: string,
  // filename 哪个文件报错了
  filename?: string,
  // tagName 哪个资源出错
  tagName?: string,
  // position 报错位置
  position?: `${number}:${number}`,
  // stack 报错堆栈
  stack?: string,
  // selector 报错的选择器位置
  selector?: string,
  // 白屏设置
  screen?: string,
  viewPoint?: string
}