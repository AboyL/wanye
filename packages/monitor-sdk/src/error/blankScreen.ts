import tracker from '../utils/tracker';
import onload from '../utils/onload';

let wrapperElements = ['html', 'body', '#container', '.content'];

export function blankScreen() {
  // 应该是配置式的
  let emptyPoints = 0;
  function getSelector(element: Element) {
    if (element.id) {
      return "#" + element.id;
    } else if (element.className) {// a b c => .a.b.c
      return "." + element.className.split(' ').filter((item: string) => !!item).join('.');
    } else {
      return element.nodeName.toLowerCase();
    }
  }
  function isWrapper(element: Element) {
    let selector = getSelector(element);
    if (wrapperElements.indexOf(selector) != -1) {
      emptyPoints++;
    }
  }
  onload(function () {
    // 进行取点分析
    const wrapperWidth = document.body.offsetWidth
    const wrapperHeight = document.body.offsetHeight

    for (let i = 1; i <= 9; i++) {
      let xElements = document.elementsFromPoint(
        wrapperWidth * i / 10, wrapperHeight / 2);
      let yElements = document.elementsFromPoint(
        wrapperWidth / 2, wrapperHeight * i / 10);
      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
    }

    if (emptyPoints >= 18) {
      let centerElements = document.elementsFromPoint(
        wrapperWidth / 2, wrapperHeight / 2
      );
      tracker.send({
        kind: 'stability',
        type: 'blank',
        screen: window.screen.width + "X" + window.screen.height,
        viewPoint: window.innerWidth + "X" + window.innerHeight,
        selector: getSelector(centerElements[0])
      });
    }
  });

}