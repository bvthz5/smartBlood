/**
 * Performance Optimization Utilities
 * Prevents forced reflows and improves rendering performance
 */

// Batch DOM updates to prevent reflows
export const batchDOMUpdates = (updates) => {
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      updates.forEach(update => update());
    });
  } else {
    setTimeout(() => {
      updates.forEach(update => update());
    }, 0);
  }
};

// Optimized state setter that batches updates
export const createBatchedStateSetter = (setState) => {
  let updateQueue = [];
  let isScheduled = false;

  const flushUpdates = () => {
    if (updateQueue.length > 0) {
      setState(prevState => {
        let newState = prevState;
        updateQueue.forEach(update => {
          newState = typeof update === 'function' ? update(newState) : update;
        });
        updateQueue = [];
        isScheduled = false;
        return newState;
      });
    }
  };

  return (update) => {
    updateQueue.push(update);
    if (!isScheduled) {
      isScheduled = true;
      if (window.requestIdleCallback) {
        requestIdleCallback(flushUpdates);
      } else {
        setTimeout(flushUpdates, 0);
      }
    }
  };
};

// Optimized event handler that prevents reflows
export const createOptimizedEventHandler = (handler) => {
  let isScheduled = false;
  let pendingEvent = null;

  const processEvent = () => {
    if (pendingEvent) {
      handler(pendingEvent);
      pendingEvent = null;
      isScheduled = false;
    }
  };

  return (event) => {
    pendingEvent = event;
    if (!isScheduled) {
      isScheduled = true;
      if (window.requestIdleCallback) {
        requestIdleCallback(processEvent);
      } else {
        setTimeout(processEvent, 0);
      }
    }
  };
};

// Optimized focus handler
export const optimizedFocus = (element) => {
  if (element) {
    if (window.requestIdleCallback) {
      requestIdleCallback(() => element.focus());
    } else {
      setTimeout(() => element.focus(), 0);
    }
  }
};

// Optimized scroll handler
export const createOptimizedScrollHandler = (handler) => {
  let ticking = false;
  
  return (event) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler(event);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// CSS optimization helpers
export const addWillChange = (element, properties) => {
  if (element && element.style) {
    element.style.willChange = properties.join(', ');
  }
};

export const removeWillChange = (element) => {
  if (element && element.style) {
    element.style.willChange = 'auto';
  }
};

// Memory cleanup utility
export const createCleanupManager = () => {
  const cleanupTasks = [];
  
  return {
    add: (task) => cleanupTasks.push(task),
    cleanup: () => {
      cleanupTasks.forEach(task => {
        try {
          task();
        } catch (error) {
          console.warn('Cleanup task failed:', error);
        }
      });
      cleanupTasks.length = 0;
    }
  };
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (end - start > 16) { // More than one frame
    console.warn(`Performance warning: ${name} took ${end - start}ms`);
  }
  
  return result;
};

// Debounced function with requestIdleCallback
export const createIdleDebounce = (fn, delay) => {
  let timeoutId;
  let isScheduled = false;
  
  return (...args) => {
    clearTimeout(timeoutId);
    
    if (!isScheduled) {
      isScheduled = true;
      timeoutId = setTimeout(() => {
        if (window.requestIdleCallback) {
          requestIdleCallback(() => {
            fn(...args);
            isScheduled = false;
          });
        } else {
          fn(...args);
          isScheduled = false;
        }
      }, delay);
    }
  };
};
