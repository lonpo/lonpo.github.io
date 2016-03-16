---
layout: post
title:  重构方法总结
description: 重构
category: docker
tags: [重构, 设计模式]
comments: true
share: true
---

1. 重构之前必须要有一套可靠的测试机制
2. 某类的方法内应该有来自该类的信息，否则就是放错了地方；
3. 执行结果不会再任何改变，运用replace Temp with Query()
4. 运用Extract Method()重构方法
5. State模式【Gang of Four】 State模式或者Strategy模式
6. 尽量将不稳定的变化造成的影响降低到最小；只在有变化的类里面操作；
7. Extract Method, Move Method, Replace Conditional with Polymorphism, Self Encapsulate Field, Replace Type Code with State/Strategy.
8. 重构（名词）：对软件内部结构的一种调整，目的是在不改变软件可观察的前提下，提高其理解性，降低其修改成本；
9. 重构（动词）：使用一系列重构手法，在不改变软件可观察行为的前提下，调整其结构；
10. 三次准则：第一次做某件事时只管去做；第二次做类似的事情会产生反感，但无论如何还是可以去做；第三次再做类似的事，你就应该重构。【事不过三，三则重构】
11. 构造函数：Replace Temp with Query（以查询取代临时变量）