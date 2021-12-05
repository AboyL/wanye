# xingzhi-monitor-sdk
提供一个简单的监控平台sdk

支持上报到阿里云日志监控平台



## 错误捕获

### JS错误捕获

**window.onerror** 可以捕获所有的js代码执行错误，但是无法捕获到资源加载错误 <br/>
**window.addEventListener('error',handle)**也可以做到<br/>
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
对接口的监控，我们可以直接对**XMLHttpRequest**以及**fetch**进行代理操作就好了。<br/>
需要注意的对上传错误接口这些进行一些特殊处理，避免重复发送，假如使用的是XHR或者fetch进行上传


### 白屏监控

可以通过**elementsFromPoint**获取到某个像素点上的元素，通过设置一个算法来判断当前的屏幕是否存在白屏的情况，不过从个人的理解上来看，白屏是一个业务上的问题，因此可能在不同业务上需要不同的判断方案。例如

* 通过十字交叉法判断 当前的页面上是否只有body元素
* 在一些框架项目中进行判断，**#root** 元素是否为空，假如为空 也是白屏



## TODO

- [ ] 抽离成单独的sdk
- [ ] 支持配置tracker