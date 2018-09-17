import raf, { cancel } from 'raf';

export default function throttleByAnimationFrame(fn: (...args: any[]) => void) {
  let requestId: number | null;

  const later = (args: any[]) => () => {
    requestId = null;
    fn(...args);
  };

  const throttled = (...args: any[]) => {
    if (requestId == null) {
      requestId = raf(later(args));
    }
  };

  (throttled as any).cancel = () => cancel(requestId!);

  return throttled;
}

export function throttleByAnimationFrameDecorator() {
  return function(target: any, key: string, descriptor: any) {
    let fn = descriptor.value;
    let definingProperty = false;
    return {
      configurable: true,
      get() {
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        let boundFn = throttleByAnimationFrame(fn.bind(this));
        definingProperty = true;
        Object.defineProperty(this, key, {
          value: boundFn,
          configurable: true,
          writable: true,
        });
        definingProperty = false;
        return boundFn;
      },
    };
  };
}
