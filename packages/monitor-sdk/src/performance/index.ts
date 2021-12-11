import { getFMP, getLCP, getFID } from './observer';
import tracker from '../utils/tracker';
import onload from '../utils/onload';
import { TrackerTiming } from '../utils/tracker/types';
import { getLastEvent, getSelector } from '../utils/ErrorHandle';

export function timing() {

  //用户的第一次交互 点击页面 
  const FMPP = getFMP()
  const LCPP = getLCP()
  onload(function () {
    setTimeout(() => {
      // 通过Promise.all 获取到FMP的时间
      Promise.all<Promise<PerformanceEntry>[]>([FMPP, LCPP])
        .then(([FMP, LCP]) => {
          // 对这里的内容考虑使用新的api进行代替
          const {
            fetchStart,
            domainLookupEnd,
            domainLookupStart,
            connectStart,
            connectEnd,
            requestStart,
            responseStart,
            responseEnd,
            domLoading,
            domInteractive,
            domContentLoadedEventStart,
            domContentLoadedEventEnd,
            domComplete,
            loadEventStart
          } = performance.timing; // 已经启用了 考虑使用其他的来进行代替


          const time: TrackerTiming = {
            dnsTime: domainLookupEnd - domainLookupStart, // dns解析耗时
            connectTime: connectEnd - connectStart,//连接时间
            ttfbTime: responseStart - requestStart,//首字节到达时间
            reqTime: responseEnd - responseStart, // 内容传输耗时
            analysisDomTime: domInteractive - domLoading, // 文档解析耗时
            blankTime: domLoading - fetchStart,//白屏时间
            timeToInteractive: domInteractive - fetchStart,//首次可交互时间
            domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // 资源请求耗时
            parseDOMTime: loadEventStart - domLoading, //DOM解析的时间 整个的时间包括了资源的加载时间
            domReadyTime: domComplete - fetchStart,// dom ready时间 此时是总的资源加载完了的这些时间
            loadTIme: loadEventStart - fetchStart, //完整的加载时间
            // 首次绘制时间 这个是默认chrome给出来的 会更加准确一点 但是不知道是用哪个减去哪个进行计算的
            // 某种意义上来说，可以代替 blankTime 介于blankTime与timeToInteractive 之间
            // 因此应该直接使用下面这个来代替 blankTime
            firstPaint: performance.getEntriesByName('first-paint')[0].startTime,
            // 首次有内容的绘制时间 与FP的区别是，假如页面上只有一个有背景的元素，fp会进行计算，而fcp不会
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0].startTime,
            firstMeaningfulPaint: FMP.startTime,
            largestContentfulPaint: LCP.startTime
          }
          console.log('time', time)
          tracker.send({
            kind: 'experience',//用户体验指标
            type: 'timing',//统计每个阶段的时间
            ...time,
          });
        })

      // FID 自己进行上报
      getFID().then((time) => {
        let lastEvent = getLastEvent();
        tracker.send({
          kind: 'experience',//用户体验指标
          type: 'timing',//统计每个阶段的时间
          selector: lastEvent ? getSelector((lastEvent as any).path || lastEvent.target) : '',
          ...time,
        });
      })
    }, 1000);
  });

}