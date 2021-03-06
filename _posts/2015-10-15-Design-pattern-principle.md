---
layout: post
title:  设计模式总结
description: 设计模式【工厂方法,观察者模式,装饰者模式,策略模式, 命令模式】
category: 设计模式
tags: [设计模式, 简单工厂]
comments: true
share: true
---
# 设计模式原则
1. 第一个原则：找出应用中可能需要改变之处，把它们独立出来，不要和那些不需要改变的代码混在一起；
2. 第二个原则：针对接口编程，而不是针对实现编程；
3. 原则三：多用组合，少用继承；
4. 原则四：为交互对象之间的松耦合设计而努力；


# 设计模式
1. 策略模式(Strategy pattern)：定义了算法族，分别封装起来，让他们之间可以相互替换，此模式让算法的变化独立于使用算法的客户；
【可以把每组的行为想象成一个算法族，然后以组合方式，一个Character角色可以“有一个”weaponBehavior"行为，行为就是一组算法族】
2. 观察者模式（Observer）：定义了对象之间的一对多依赖，这样一来，当一个对象改变状态时，它的所有用依赖者都会收到通知并自动更新；出版者+订阅者=观察者模式；
【使用Java内置的观察者模式，Obervable可观察的，Observer观察者】
【后续】