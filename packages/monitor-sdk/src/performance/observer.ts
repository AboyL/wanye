import { FIDTiming } from "../utils/tracker/types";

export const getFMP = (): Promise<PerformanceEntry> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList, observer) => {
      let perfEntries = entryList.getEntries();
      const FMP = perfEntries[0];//startTime 2000以后
      resolve(FMP)
      console.log('FMP', FMP)
      observer.disconnect();//不再观察了
    }).observe({ entryTypes: ['element'] });//观察页面中的意义的元素
  })
}

export const getLCP = (): Promise<PerformanceEntry> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList, observer) => {
      let perfEntries = entryList.getEntries();
      const LCP = perfEntries[0];
      resolve(LCP)
      observer.disconnect();//不再观察了
    }).observe({ entryTypes: ['largest-contentful-paint'] });//观察页面中的意义的元素
  })
}

export const getFID = (): Promise<FIDTiming> => {
  return new Promise((resolve) => {
    new PerformanceObserver((entryList, observer) => {
      let firstInput: any = entryList.getEntries()[0];
      console.log('FID', firstInput)
      if (firstInput) {
        // processingStart 开始处理的时间 startTime开点击的时间 差值就是处理的延迟
        let inputDelay = firstInput.processingStart - firstInput.startTime;
        let duration = firstInput.duration;//处理的耗时
        if (inputDelay > 0 || duration > 0) {
          resolve({
            inputDelay,//延时的时间
            duration,//处理的时间
            startTime: firstInput.startTime,
          })
        }
      }
      observer.disconnect();//不再观察了
    }).observe({ type: 'first-input', buffered: true });
  })
}