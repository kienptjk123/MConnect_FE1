// Throttle utility for limiting function calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();

    if (!previous) {
      // First call, execute immediately
      func.apply(null, args);
      previous = now;
      return;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      // Time has passed, execute immediately
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func.apply(null, args);
      previous = now;
    } else if (!timeout) {
      // Set timeout for the remaining time
      timeout = setTimeout(() => {
        func.apply(null, args);
        previous = Date.now();
        timeout = null;
      }, remaining);
    }
  };
}
