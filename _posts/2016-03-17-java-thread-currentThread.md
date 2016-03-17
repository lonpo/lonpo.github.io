---
layout: post
title: java多线程编程之二（currentThread）
date: 2016-03-17 19:59:01
category: java
tags: [java, 多线程]
comments: true
---

# currentThread方法

代码CountOperate：

```java
package thread.currentThread;

public class CountOperate extends Thread{
  public CountOperate(){
    System.out.println("countOperate Thread.currentThread().getName()====" + Thread.currentThread().getName());
    System.out.println("countOperate getName()=====" + this.getName());
  }
  
  @Override
  public void run(){
    System.out.println("run Thread.currentThread().getName()====" + Thread.currentThread().getName());
    System.out.println("run getName()====" + this.getName());
  }

  
  
}

```

代码CountOperateMain:

```java
package thread.currentThread;

public class CountOperateMain {
  public static void main(String[] args) {
    CountOperate thread = new CountOperate();
    thread.setName("countOperate");
    //thread.start();
    
    Thread mainThread = new Thread(thread);
    mainThread.setName("mainThread");
    mainThread.start();
    
  }
}

```

运行CountOperateMain返回结果如下：

```bash
countOperate Thread.currentThread().getName()====main
countOperate getName()=====Thread-0
run Thread.currentThread().getName()====mainThread
run getName()====countOperate
```

解析：
1.Thread.currentThread().getName()获取的是当前调用这部分程序块的线程；
2.如构造函数是由Main的线程调用的；
3.如CountOperate线程是作为参数target传入mainThread，被mainThread调用的，则返回的是mainThread
4.如this.getName()获取的则是这个线程对象的名称；

