---
layout: post
title: java多线程编程之三（sleep和wait区别）
date: 2016-03-17 20:59:01
category: java
tags: [java, 多线程]
comments: true
---

java多线程编程之三（sleep和wait、notify、notifyAll区别）
====

wait
-------
导致当前的线程等待，直到其他线程调用此对象的 notify方法或 notifyAll 方法。当前的线程必须拥有此对象监视器。该线程发布对此监视器的所有权并等待，直到其他线程通过调用 notify 方法，或 notifyAll 方法通知在此对象的监视器上等待的线程醒来。然后该线程将等到重新获得对监视器的所有权后才能继续执行，

sleep
-------
在指定的毫秒数内让当前正在执行的线程休眠（暂停执行）。该线程不丢失任何监视器的所属权。

wait与sleep
-------

- Wait是Object类的方法，范围是使该Object实例所处的线程。

- Sleep()是Thread类专属的静态方法，针对一个特定的线程。

-  Wait方法使实体所处线程暂停执行，从而使对象进入等待状态，直到被notify方法通知或者wait的等待的时间到。Sleep方法使持有的线程暂停运行，从而使线程进入休眠状态，直到用interrupt方法来打断他的休眠或者sleep的休眠的时间到。`Wait`方法进入等待状态时会`释放同步锁`(如上例中的lock对象)，而`Sleep方法不会释放同步锁`。所以，当一个线程无限Sleep时又没有任何人去interrupt它的时候，程序就产生大麻烦了notify是用来通知线程，但在notify之前线程是需要获得lock的。另个意思就是必须写在`synchronized(lockobj)` {...}之中。wait也是这个样子，一个线程需要释放某个lock，也是在其获得lock情况下才能够释放，所以wait也需要放在synchronized(lockobj) {...}之中。

## 注意死锁

代码Calculator如下：

```java
package thread.wait;

// 计算线程
public class Calculator extends Thread {
  int total;

  public void run() {
    synchronized (this) {
      for (int i = 0; i < 2; i++) {
        total += i;
      }
      // 通知所有在此对象上等待的线程
      //notifyAll();
      notify();
    }
    System.out.println("Calculator notifyAll begin");


  }
}
```

代码ReaderResult如下：

```java
package thread.wait;

// 获取计算结果并输出
public class ReaderResult extends Thread {
  Calculator c;

  public ReaderResult(Calculator c) {
    this.c = c;
  }

  public void run() {
    try{
      Thread.sleep(c.total*1000);
    }catch(Exception e){
      e.printStackTrace();
    }
    synchronized (c) {
      try {
        System.out.println(Thread.currentThread() + "等待计算结果。。。");
        c.wait();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
      System.out.println(Thread.currentThread() + "计算结果为：" + c.total);
    }
  }

  public static void main(String[] args) {
    Calculator calculator = new Calculator();
    // 启动50个线程，分别获取计算结果
    for (int i = 0; i < 50; i++) {
      ReaderResult reader = new ReaderResult(calculator);
      reader.setName("readerResult" + i);
      reader.start();
      
      //new ReaderResult(calculator).start();
      
    }
    // 启动计算线程
    calculator.start();
  }
}
```

		此线程会出现死锁情况

解析：
1. 因为所有线程都是异步的，有可能当calculator计算完毕,调用notifyAll()方法唤醒所有此对象c监视器上等待的线程的之后，而ReaderResult里面的有些线程才开始刚刚wait，这样程序就永远可能终止不了的情况。

* 参看之前的线程系列文章：

[我的博客](http://blog.leweg.com/)


