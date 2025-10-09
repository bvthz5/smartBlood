/**
 * Task scheduler to prevent long tasks and maintain 60fps performance
 */

class TaskScheduler {
  constructor() {
    this.taskQueue = [];
    this.isProcessing = false;
    this.frameBudget = 1; // 1ms budget per frame - EXTREME
    this.maxTasksPerFrame = 1; // Only 1 task per frame - EXTREME
    this.violationCount = 0;
    this.maxViolations = 3; // Stop processing after 3 violations
  }

  // Add a task to the queue
  schedule(task, priority = 'normal') {
    const taskItem = {
      task,
      priority,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: performance.now()
    };

    if (priority === 'high') {
      this.taskQueue.unshift(taskItem);
    } else {
      this.taskQueue.push(taskItem);
    }

    if (!this.isProcessing) {
      this.processQueue();
    }

    return taskItem.id;
  }

  // Process the task queue - EXTREME optimization
  async processQueue() {
    if (this.isProcessing || this.taskQueue.length === 0 || this.violationCount >= this.maxViolations) {
      return;
    }

    this.isProcessing = true;
    const startTime = performance.now();
    let tasksProcessed = 0;

    while (this.taskQueue.length > 0 && tasksProcessed < this.maxTasksPerFrame) {
      const currentTime = performance.now();
      const frameTime = currentTime - startTime;

      // EXTREME: If we've exceeded our 1ms budget, immediately yield control
      if (frameTime >= this.frameBudget) {
        this.violationCount++;
        break;
      }

      const taskItem = this.taskQueue.shift();
      
      try {
        // Execute the task with EXTREME time limit
        if (typeof taskItem.task === 'function') {
          const taskStartTime = performance.now();
          await taskItem.task();
          const taskEndTime = performance.now();
          const taskDuration = taskEndTime - taskStartTime;
          
          // If task took longer than 1ms, count as violation
          if (taskDuration > 1) {
            this.violationCount++;
          }
        }
        tasksProcessed++;
      } catch (error) {
        // Silent error handling for performance
        this.violationCount++;
      }
    }

    this.isProcessing = false;

    // Only schedule next frame if we haven't exceeded violation limit
    if (this.taskQueue.length > 0 && this.violationCount < this.maxViolations) {
      requestAnimationFrame(() => this.processQueue());
    } else if (this.violationCount >= this.maxViolations) {
      // Clear queue if too many violations
      this.taskQueue = [];
    }
  }

  // Cancel a scheduled task
  cancel(taskId) {
    const index = this.taskQueue.findIndex(item => item.id === taskId);
    if (index !== -1) {
      this.taskQueue.splice(index, 1);
      return true;
    }
    return false;
  }

  // Clear all tasks
  clear() {
    this.taskQueue = [];
  }

  // Get queue status
  getStatus() {
    return {
      queueLength: this.taskQueue.length,
      isProcessing: this.isProcessing,
      estimatedWaitTime: this.taskQueue.length * (this.frameBudget / this.maxTasksPerFrame)
    };
  }
}

// Create global task scheduler instance
export const taskScheduler = new TaskScheduler();

// Utility functions for common task types
export const scheduleTask = (task, priority = 'normal') => {
  return taskScheduler.schedule(task, priority);
};

export const scheduleHighPriorityTask = (task) => {
  return taskScheduler.schedule(task, 'high');
};

export const scheduleLowPriorityTask = (task) => {
  return taskScheduler.schedule(task, 'low');
};

// Batch DOM operations to prevent forced reflows
export const batchDOMOperations = (operations) => {
  return new Promise((resolve) => {
    scheduleTask(() => {
      const fragment = document.createDocumentFragment();
      const startTime = performance.now();

      operations.forEach(operation => {
        try {
          operation(fragment);
        } catch (error) {
          console.warn('DOM operation failed:', error);
        }
      });

      // Apply all changes at once
      if (fragment.children.length > 0) {
        document.body.appendChild(fragment);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 16) {
        console.warn(`DOM batch operation took ${duration.toFixed(2)}ms`);
      }

      resolve();
    }, 'high');
  });
};

// Schedule heavy computations in chunks
export const scheduleHeavyComputation = (computation, chunkSize = 1000) => {
  return new Promise((resolve) => {
    let result = null;
    let index = 0;

    const processChunk = () => {
      const startTime = performance.now();
      
      while (index < chunkSize && (performance.now() - startTime) < 5) {
        try {
          const chunkResult = computation(index);
          if (chunkResult !== undefined) {
            result = chunkResult;
          }
          index++;
        } catch (error) {
          console.warn('Computation chunk failed:', error);
          break;
        }
      }

      if (index >= chunkSize) {
        resolve(result);
      } else {
        scheduleTask(processChunk, 'low');
      }
    };

    scheduleTask(processChunk, 'low');
  });
};

// Optimize array processing
export const scheduleArrayProcessing = (array, processor, chunkSize = 100) => {
  return new Promise((resolve) => {
    const results = [];
    let index = 0;

    const processChunk = () => {
      const startTime = performance.now();
      const endIndex = Math.min(index + chunkSize, array.length);

      while (index < endIndex && (performance.now() - startTime) < 5) {
        try {
          const result = processor(array[index], index);
          results.push(result);
          index++;
        } catch (error) {
          console.warn('Array processing failed:', error);
          index++;
        }
      }

      if (index >= array.length) {
        resolve(results);
      } else {
        scheduleTask(processChunk, 'low');
      }
    };

    scheduleTask(processChunk, 'low');
  });
};

// Schedule image loading
export const scheduleImageLoad = (src) => {
  return new Promise((resolve, reject) => {
    scheduleTask(() => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    }, 'low');
  });
};

// Schedule data fetching
export const scheduleDataFetch = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    scheduleTask(async () => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    }, 'normal');
  });
};

// Performance monitoring for task scheduler
export const getSchedulerMetrics = () => {
  return {
    ...taskScheduler.getStatus(),
    performanceMetrics: {
      averageTaskTime: performance.now(), // Placeholder for actual metrics
      tasksPerSecond: 0, // Placeholder for actual metrics
      droppedTasks: 0 // Placeholder for actual metrics
    }
  };
};

// Initialize task scheduler monitoring
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const status = taskScheduler.getStatus();
    if (status.queueLength > 50) {
      console.warn(`Task scheduler queue is getting long: ${status.queueLength} tasks`);
    }
  }, 5000);
}
