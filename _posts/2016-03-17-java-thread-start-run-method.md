---
layout: post
title: java多线程编程之一（start和run的区别）
date: 2016-03-17 14:59:01
category: java
tags: [java, 多线程]
comments: true
---

# java多线程的start和run方法的区别

代码MyRunnable：

```java
package thread;

public class MyRunnable implements Runnable{
  private int i;
  
  public MyRunnable(int i){
    super();
    this.i = i;    
  }
  
  @Override
  public void run() {
    // TODO Auto-generated method stub
    System.out.println("MyRunnable is running...");
  }
  
}
```

代码MyThreadTest:

```java
package thread;

public class MyThreadTest {
  public static void main(String[] args) {
    MyRunnable runnable = new MyRunnable(1);
    //thread0.run();
    
    Thread thread1 = new Thread(runnable);
    thread1.start();
    
    System.out.println("main is running...");
    
  }
}
```

运行MyThreadTest返回结果如下：

```bash
main is running...
MyRunnable is running...
```

# Thread运行的原理图

![java线程运行原理](/images/blog/java_thread_start.jpg)

1. Thread调用start方法，之后会调用start0()，start0()是native方法，调用JVM中JVM_startThread，之后调用vmSymbolHandles的run_method_name，最后回回调Thread中的run方法。

* 调用顺序如下

		>MainThread
		>>Thread.start()
		>>>Thread.start0()
		>>>>JVM中JVM_startThread()
		>>>>>vmSymbolHandles的run_method_name
		>>>>>>Thread.run()