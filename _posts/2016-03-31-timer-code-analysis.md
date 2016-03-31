---
layout: post
title: java的Timer和TimerTask源码分析
date: 2016-03-30 14:05:01
category: java
tags: [java, Timer, TimerTask]
comments: true
---

Timer是设置计划任务，在某一个时间点开始执行某一个任务。但封装的类却是TimerTask类，执行执行任务的代码是放在TimerTask类里。


Timer调用图关系

![Timer](/images/timer-code.jpg)

<!--more-->

### Timer类

```java
public class Timer {
    /**
     * 任务队列，是一个平衡二分堆，调度时间越早的是放在最前面的。 节点[n]具有两个子节点[2*n]和[2*n+1]
     */
    private final TaskQueue queue = new TaskQueue();

    /**
     * 定时循环取出TaskQueue中的任务TimerTask去执行。
     */
    private final TimerThread thread = new TimerThread(queue);
	
	private static int serialNumber() {
        return nextSerialNumber.getAndIncrement();
    }
	
    public Timer() {
        this("Timer-" + serialNumber());
    }

    /**
	 * 是否为守护线程
     */
    public Timer(boolean isDaemon) {
        this("Timer-" + serialNumber(), isDaemon);
    }

    /**
     * 构造方法，设置线程名，并启动TimerThread
     */
    public Timer(String name) {
        thread.setName(name);
        thread.start();
    }
}
```


	
### TimerThread类

```java
class TimerThread extends Thread {

    boolean newTasksMayBeScheduled = true;

    private TaskQueue queue;

    TimerThread(TaskQueue queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            mainLoop();
        } finally {          
            synchronized(queue) {
                newTasksMayBeScheduled = false;
                queue.clear();  // Eliminate obsolete references
            }
        }
    }

    /**
     * 主循环线程，不断去轮询TaskQueue
     */
    private void mainLoop() {
        while (true) {
            try {
                TimerTask task;
                boolean taskFired;
                synchronized(queue) {
                    // Wait for queue to become non-empty
                    while (queue.isEmpty() && newTasksMayBeScheduled)
                        queue.wait();
                    if (queue.isEmpty())
                        break; // Queue is empty and will forever remain; die

                    // Queue nonempty; look at first evt and do the right thing
                    long currentTime, executionTime;
                    task = queue.getMin();
                    synchronized(task.lock) {
                        if (task.state == TimerTask.CANCELLED) {
                            queue.removeMin();
                            continue;  // No action required, poll queue again
                        }
                        currentTime = System.currentTimeMillis();
                        executionTime = task.nextExecutionTime;
                        if (taskFired = (executionTime<=currentTime)) {
                            if (task.period == 0) { // Non-repeating, remove
                                queue.removeMin();
                                task.state = TimerTask.EXECUTED;
                            } else { // Repeating task, reschedule
                                queue.rescheduleMin(
                                  task.period<0 ? currentTime   - task.period
                                                : executionTime + task.period);
                            }
                        }
                    }
                    if (!taskFired) // Task hasn't yet fired; wait
                        queue.wait(executionTime - currentTime);
                }
                if (taskFired)  // Task fired; run it, holding no locks
                    task.run();
            } catch(InterruptedException e) {
            }
        }
    }
}
```	

### TaskQueue

```java
class TaskQueue {
    /**
     * 平衡二分堆
     */
    private TimerTask[] queue = new TimerTask[128];

    /**
     *队列的标识位为是从【1】到【size】
     * queue[1] up to queue[size]).
     */
    private int size = 0;

    /**
     * Returns the number of tasks currently on the queue.
     */
    int size() {
        return size;
    }

    /**
     * 扩大数组的大小
     */
    void add(TimerTask task) {
        // Grow backing store if necessary
        if (size + 1 == queue.length)
            queue = Arrays.copyOf(queue, 2*queue.length);

        queue[++size] = task;
        fixUp(size);
    }

    /**
     * 取出头结点
     */
    TimerTask getMin() {
        return queue[1];
    }


    /**
     * 移除头节点
     */
    void removeMin() {
        queue[1] = queue[size];
        queue[size--] = null;  // Drop extra reference to prevent memory leak
        fixDown(1);
    }

    /**
     * 与父节点比较，如果小于父节点则交换节点，依次往上比较。
     */
    private void fixUp(int k) {
        while (k > 1) {
            int j = k >> 1;
            if (queue[j].nextExecutionTime <= queue[k].nextExecutionTime)
                break;
            TimerTask tmp = queue[j];  queue[j] = queue[k]; queue[k] = tmp;
            k = j;
        }
    }

    /**
     * 通过不断比较，把执行时间较大的放到对应的子节点上
     */
    private void fixDown(int k) {
        int j;
        while ((j = k << 1) <= size && j > 0) {
            if (j < size &&
                queue[j].nextExecutionTime > queue[j+1].nextExecutionTime)
                j++; // j indexes smallest kid
            if (queue[k].nextExecutionTime <= queue[j].nextExecutionTime)
                break;
            TimerTask tmp = queue[j];  queue[j] = queue[k]; queue[k] = tmp;
            k = j;
        }
    }
}
```

### TimerTask抽象类

```java
public abstract class TimerTask implements Runnable {
	public abstract void run();
}
```



