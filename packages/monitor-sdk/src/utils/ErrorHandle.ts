


let lastEvent: Event;
['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
  document.addEventListener(eventType, (event) => {
    lastEvent = event;
  }, {
    capture: true,//捕获阶段
    passive: true//默认不阻止默认事件
  });
});

export const getLastEvent = () => {
  return lastEvent;
}

export const getLines = (stack: string): string => {
  return stack.split('\n')
    .slice(1)
    .map((item: string) => item.replace(/^\s+at\s+/g, ""))
    .join('^');
}


function _getSelectors(path:any[]) {
  return path.reverse().filter(element => {
      return element !== document && element !== window;
  }).map(element => {
      let selector = "";
      if (element.id) {
          return `${element.nodeName.toLowerCase()}#${element.id}`;
      } else if (element.className && typeof element.className === 'string') {
          return `${element.nodeName.toLowerCase()}.${element.className}`;
      } else {
          selector = element.nodeName.toLowerCase();
      }
      return selector;
  }).join(' ');
}

export const getSelector = (pathsOrTarget:any[]|any)=> {
  if (Array.isArray(pathsOrTarget)) {//可能是一个数组
      return _getSelectors(pathsOrTarget);
  } else {//也有可有是一个对象 
      let path = [];
      while (pathsOrTarget) {
          path.push(pathsOrTarget);
          pathsOrTarget = pathsOrTarget.parentNode;
      }
      return _getSelectors(path);
  }
}