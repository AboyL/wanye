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
export interface TrackerProps {
  // 监控指标的大类
  // stability 稳定性监控
  kind: 'stability',
  // 错误监控等
  type: 'error' | 'xhrError' | 'blank',
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