---
layout: post
title: java多线程编程之四（interrupted和isInterrupted区别）
date: 2016-03-17 20:59:01
category: java
tags: [java, 多线程]
comments: true
---

java多线程编程之三（interrupted和isInterrupted区别）
====

在java的线程Thread类中有三个方法，比较容易混淆，在这里解释一下
（1）interrupt：置线程的中断状态
（2）isInterrupted：线程是否中断
（3）interrupted：返回线程的上次的中断状态，并清除中断状态，静态方法

## interrupted()

```java
    public static boolean interrupted() {
        return currentThread().isInterrupted(true);
    }
```

## isInterrupted()

```java
    public boolean isInterrupted() {
        return isInterrupted(false);
    }
```


##　为什么interrupt，isInterrupted是`实例方法`，而interrupted是`类方法`？

摘抄网上的解释：

interrupt的语义 是：中断一个线程。线程可以在其内部调用this.interrupt()来中断自己，但是如果自己遇到阻塞或睡眠了，怎么办呢？所以，就需要从另外一个外部线程上将其中断，即在Thread1上调用Thread2.interrupt() 来中断thread2。

同时，thread1有时候也想去看看其他线程（thread2）目前的状态是怎样的，所以在Thread1上调用Thread2.isInterrupted()就可以检查thread2的中断状态。

但是，thread2的中断状态是它自己的内部属性，你thread1要看一下无所谓，但你想来改，就不对了;

	因为如果你要来改，我thread2是不知道的，我就不能通过中断状态的查询来做一些事件了，所以还是让我自己来改吧，所以我就要用类方法interrupted来实现这个功能！这样的话，也能够保证只有在当前线程运行的时候，才去调用interrupted，如果当前线程不在运行，那么调用interrupted又有什么意义呢？（因为interrupted会改变当前线程的中断状态，如果你都不在运行，又何来中断不中断一说？？？）

# 源码解析

下载地址：http://openjdk.java.net/groups/hotspot/	



	
	
