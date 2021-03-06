import { injectXHRError } from './error/XHRError';
import { injectJsError } from "./error/jsError";
import { injectPromiseError } from "./error/promiseError";
import { injectResourceError } from "./error/resourceError";
import { blankScreen } from './error/blankScreen';
import { timing } from './performance';

injectJsError()
injectPromiseError()
injectResourceError()
injectXHRError()
blankScreen()
timing()