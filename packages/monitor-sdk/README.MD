# xingzhi-monitor-sdk

提供一个简单的监控平台sdk

支持上报到阿里云日志监控平台

## 错误捕获

### JS错误捕获

**window.onerror** 可以捕获所有的js代码执行错误，但是无法捕获到资源加载错误 `<br/>`
**window.addEventListener('error',handle)**也可以做到 `<br/>`
但是当我们设置了addEventListener的第三个参数 **useCapture** 为true 那么就可以捕获到资源加载错误

```javascript
window.onerror
window.addEventListener('error',handle)
```

### 资源加载错误

```javascript
window.addEventListener('error',handle,true)
```

### Promise错误捕获

监控error事件无法捕获到Promise内发生的错误。我们需要监听的是**unhandledrejection**事件。同时需要注意的是，Promise的错误存在两种。

* 未catch的reject错误
* 在Promise执行过程中产生的js错误

这两种错误的返回格式有所不同。

```typescript
  window.addEventListener('unhandledrejection', (event) => {
  }, true);
```

### 接口错误监控

对接口的监控，我们可以直接对**XMLHttpRequest**以及**fetch**进行代理操作就好了。`<br/>`
需要注意的对上传错误接口这些进行一些特殊处理，避免重复发送，假如使用的是XHR或者fetch进行上传

### 白屏监控

可以通过**elementsFromPoint**获取到某个像素点上的元素，通过设置一个算法来判断当前的屏幕是否存在白屏的情况，不过从个人的理解上来看，白屏是一个业务上的问题，因此可能在不同业务上需要不同的判断方案。例如

* 通过十字交叉法判断 当前的页面上是否只有body元素
* 在一些框架项目中进行判断，**#root** 元素是否为空，假如为空 也是白屏

## 性能

### 性能指标

1. 首次绘制时间(FP)
2. 首次有内容的绘制时间 (FCP)
3. 首屏时间，一般是根据业务场景自己来决定
4. 自定义指标
5. 网络以及DOM的时间统计
6. TTFB : ResponseStart - RequestStart (首包时间，关注网络链路耗时)
7. FPT : ResponseEnd - FetchStart （首次渲染时间 / 白屏时间）
8. TTI : DomInteractive - FetchStart （首次可交付时间）
9. Ready : DomContentLoadEventEnd - FetchStart （加载完成时间）
10. Load : LoadEventStart - FetchStart （页面完全加载时间）

**首次绘制（FP）时间** ：对于应用页面，用户在视觉上首次出现不同于跳转之前的内容时间点，或者说是页面发生第一次绘制的时间点。

**首次有内容绘制（FCP）时间** ：指浏览器完成渲染 DOM 中第一个内容的时间点，可能是文本、图像或者其他任何元素，此时用户应该在视觉上有直观的感受。

**首次有意义绘制（FMP）时间** ：指页面关键元素渲染时间。这个概念并没有标准化定义，因为关键元素可以由开发者自行定义——究竟什么是“有意义”的内容，只有开发者或者产品经理自己了解。

**首屏时间** ：对于所有网页应用，这是一个非常重要的指标。用大白话来说，就是进入页面之后，应用渲染完整个手机屏幕（未滚动之前）内容的时间。需要注意的是，业界对于这个指标其实同样并没有确切的定论，比如这个时间是否包含手机屏幕内图片的渲染完成时间。　

**用户可交互时间** ：顾名思义，也就是用户可以与应用进行交互的时间。一般来讲，我们认为是 domready 的时间，因为我们通常会在这时候绑定事件操作。如果页面中涉及交互的脚本没有下载完成，那么当然没有到达所谓的用户可交互时间。那么如何定义 domready 时间呢？参考司徒正美的文章：[何谓 domReady](https://www.cnblogs.com/rubylouvre/p/4536334.html)。

通过浏览器api进行一些数据的收集

**`PerformanceTiming`** 接口是为保持向后兼容性而保留的传统接口，并且提供了在加载和使用当前页面期间发生的各种事件的性能计时信息。

### [PerformanceTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceTiming)

| 字段                       | 含义                                                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| navigationStart            | 初始化页面，在同一个浏览器上下文中前一个页面unload的时间戳，如果没有前一个页面的unload,则与fetchStart值相等                                                                             |
| redirectStart              | 第一个HTTP重定向发生的时间,有跳转且是同域的重定向,否则为0                                                                                                                               |
| redirectEnd                | 最后一个重定向完成时的时间,否则为0                                                                                                                                                      |
| fetchStart                 | 浏览器准备好使用http请求获取文档的时间,这发生在检查缓存之前。一般情况下我们使用这个时间来作为一切检查的起始点，也就是不怎么考虑redirect的数据                                           |
| domainLookupStart          | DNS域名开始查询的时间,如果有本地的缓存或keep-alive则时间为0                                                                                                                             |
| domainLookupEnd            | DNS域名结束查询的时间                                                                                                                                                                   |
| connectStart               | TCP开始建立连接的时间,如果是持久连接,则与 `fetchStart`值相等                                                                                                                            |
| secureConnectionStart      | https 连接开始的时间,如果不是安全连接则为0                                                                                                                                              |
| connectEnd                 | TCP完成握手的时间，如果是持久连接则与 `fetchStart`值相等                                                                                                                                |
| requestStart               | HTTP请求读取真实文档开始的时间,包括从本地缓存读取                                                                                                                                       |
| requestEnd                 | HTTP请求读取真实文档结束的时间,包括从本地缓存读取                                                                                                                                       |
| responseStart              | 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳                                                                                                                  |
| responseEnd                | 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时的Unix毫秒时间戳                                                                                              |
| unloadEventStart           | 前一个页面的unload的时间戳 如果没有则为0                                                                                                                                                |
| unloadEventEnd             | 与 `unloadEventStart`相对应，返回的是 `unload`函数执行完成的时间戳                                                                                                                      |
| domLoading                 | 返回当前网页DOM结构开始解析时的时间戳,此时 `document.readyState`变成loading,并将抛出 `readyStateChange`事件                                                                             |
| domInteractive             | 返回当前网页DOM结构结束解析、开始加载内嵌资源时时间戳,`document.readyState` 变成 `interactive`，并将抛出 `readyStateChange`事件(注意只是DOM树解析完成,这时候并没有开始加载网页内的资源) |
| domContentLoadedEventStart | 网页domContentLoaded事件发生的时间                                                                                                                                                      |
| domContentLoadedEventEnd   | 网页domContentLoaded事件脚本执行完毕的时间,domReady的时间，表示内嵌的资源已经加载好了，例如内嵌的js之类的内容                                                                           |
| domComplete                | DOM树解析完成,且资源也准备就绪的时间,`document.readyState`变成 `complete`.并将抛出 `readystatechange`事件                                                                               |
| loadEventStart             | load 事件发送给文档，也即load回调函数开始执行的时间                                                                                                                                     |
| loadEventEnd               | load回调函数执行完成的时间，这个结束时间其实与load函数的执行时间有关，假如我们在里面写一个while循环，那么就会导致时间变长，实际上这个时间基本上可以不使用                               |

具体流程入下图

![](https://camo.githubusercontent.com/45327f77b2861fb366ba4be64da2ecec6ae06fbd94f9cf24d1dd6c5faf9dc0df/687474703a2f2f696d672e696d7a71672e746f702f31353432363830383635383738372e706e67)

**流程解析**

1. 从**fetchStart**开始，不考虑重定向的情况
2. 会先进行dns解析
3. 再开始进行浏览器与服务器的连接建立，开始发送请求
4. 获得请求的第一个字节，此时也就是**首包时间**，请求结束
5. 此时已经获取到了index.html这个文档，随后对这个文档进行解析，在domInteractive的时候解析完成，这个时候也就是**首次可交互时间**
6. 此时只是单纯的加载了html的文档，并没有加载文档中的内嵌资源，例如脚本以及图片，因此会进行**domComtentLoadedEventStart**，表示开始加载这部分的资源，直到end
7. 再进行了domComplete，此时才是表示dom完全渲染好了

[DOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/DOMContentLoaded_event)
[你不知道的 DOMContentLoaded](https://zhuanlan.zhihu.com/p/25876048)

综上，我们可以得知，这个时间主要是针对第一个文档来的

通过这些时间节点我们进行计算。可以得到一些经典的指标

```javascript

const calcTime = {
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
        loadTIme: loadEventStart - fetchStart //完整的加载时间
}

```

但是以上的api存在被废弃的可能。因此我们可以需要使用新的API

[PerformanceTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming)

[PerformanceResourceTiming](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceResourceTiming)

[掘金-PerformanceResourceTiming]([PerformanceResourceTiming](https://juejin.cn/post/6844904198941704206#heading-6))

[前端页面性能优化总结](https://www.pptail.life/zy/posts/12#%E5%89%8D%E7%AB%AF%E9%A1%B5%E9%9D%A2%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E6%80%BB%E7%BB%93)

以上是一些重点的时间戳的获取。

FP与FCP

这两个都可以使用 `performance.getEntriesByName` 来获取

```
        // 首次绘制时间 这个是默认chrome给出来的 会更加准确一点 但是不知道是用哪个减去哪个进行计算的
        // 某种意义上来说，可以代替 blankTime 介于blankTime与timeToInteractive 之间
        // 因此应该直接使用下面这个来代替 blankTime
        FP: performance.getEntriesByName('first-paint')[0].startTime,
        // 首次有内容的绘制时间 与FP的区别是，假如页面上只有一个有背景的元素，fp会进行计算，而fcp不会
        FCP: performance.getEntriesByName('first-contentful-paint')[0].startTime,

```

相对而言会更加准确

### FMP

有意义的元素

这个是我们自己来进行定义的，也就是所谓的FMP。针对FMP有一些自动的设置方案，我们也可以使用chrome的API手动来设置什么元素是有意义的元素，直到这个元素渲染完成，表示FMP成功

当给一个元素设置一个属性 `elementtiming` 为 `meaningful`的时候，表示他是一个有意义的元素

```

            ele.setAttribute('elementtiming', 'meaningful');

```

那么通过 `PerformanceObserver` 我们可以观测到这个元素

```

        new PerformanceObserver((entryList, observer) => {
            let perfEntries = entryList.getEntries();
            FMP = perfEntries[0];//startTime 2000以后
            observer.disconnect();//不再观察了
        }).observe({ entryTypes: ['element'] });//观察页面中的意义的元素

```

对以上的代码。当存在设置 elementtiming 属性的元素被添加到document中的时候将会进行观测

此外也有人给了一套自动的算法出来

[fmp-timing](https://github.com/qbright/fmp-timing)

### LCP

同样可以通过 **PerformanceObserver** 获得。这里有一点是需要注意的，就是什么样子的元素才会被当成LMP的元素？具体可以参考[对应的文档](https://developer.mozilla.org/en-US/docs/Web/API/Largest_Contentful_Paint_API)。简单来说

1. img
2. svg
3. video
4. Elements with a [`background-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-image). 带图像的元素
5. Groups of text nodes, such as [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p).

对于

```html
<img src="large_image.jpg">
<p id='large-paragraph'>This is large body of text.</p>

```

```javascript
const observer = new PerformanceObserver((list) => {
  let perfEntries = list.getEntries();
  let lastEntry = perfEntries[perfEntries.length - 1];
  // Process the latest candidate for largest contentful paint
});
observer.observe({entryTypes: ['largest-contentful-paint']});

```

对以上的代码来说**PerformanceObserver**可能观测多次。因此具体来说这个是什么，还需要我们进行判断

[PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

[entryType](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/entryType)

[PerformanceElementTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceElementTiming)

[自定义性能指标](https://juejin.cn/post/6857366000153837582)


### FID

指用户首次与界面进行交互的时间

[参考](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)

[FID](https://web.dev/fid/)

实现

```
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});
```


通过以上的内容，我们可以很好的设置FMP、LCP以及FID了。



## TODO

- [ ] 抽离成单独的sdk
- [ ] 支持配置tracker
