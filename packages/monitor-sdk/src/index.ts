import { injectJsError } from "./error/jsError";
import { injectPromiseError } from "./error/promiseError";
import { injectResourceError } from "./error/resourceError";

injectJsError()
injectPromiseError()
injectResourceError()