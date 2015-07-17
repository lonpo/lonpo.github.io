---
layout: post
title: 使用fullpage.js和animate.css打造全屏滚动网站
description: 使用全屏滚动插件fullpage.js和animator.css的CSS3打造全屏滚动网站
category: 前端技术
tags: [fullpage.js, animate.css, 全屏滚动网站]
comments: true
share: true
---

# 简介
  如今我们经常看到很多大型网站，比如[QQ浏览器](http://browser.qq.com/?adtag=SEM1)、网易邮箱、百度史记、[小米饮水机](http://www.mi.com/water/)等，都是采用几幅很大的图片作为背景，然后再添加一些简单的内容，显得格外高大上；于是乎便找到了全屏滚动插件fullpage.js，效果非常好！再配合上animate.css动画就非常完美啦。
	 ![fullpage.jpg](/images/fullpage.jpg)
 
# 前话
	 做为程序员的我，其实并不浪漫，但一直想给女朋友一份独特的礼物，于是想到做一个浪漫网站可以永远记住我们之间的爱情；爱真的就是很疯狂的，爱会让人充满了无限能量；从开始的点点滴滴生活记录、到我们在一起的相片搜集筛选、到图片美工处理、到网站搭建技术熟悉、最后到手机移动端的适配；花了我整整4-5天的时间、每天晚上下班回来都会做到2-3点，想到心中的她看到我给她制作的网站，脸上绽放开心的笑容时，我就没有丝毫困意；这或许真的就是爱情的力量吧！O(∩_∩)O

	 
<!--more-->

# 技术总结
## fullpage.js全屏滚动插件

fullPage.js 是一个基于 jQuery 的插件，它能够很方便、很轻松的制作出全屏网站，主要功能有：

* 支持鼠标滚动
* 支持前进后退和键盘控制
* 多个回调函数
* 支持手机、平板触摸事件
* 支持 CSS3 动画
* 支持窗口缩放
* 窗口缩放时自动调整
* 可设置滚动宽度、背景颜色、滚动速度、循环选项、回调、文本对齐方式等等

详细文档和demo可以参考：[jQuery全屏滚动插件fullPage.js](http://www.dowebok.com/77.html)

## animate.css

  animate.css是一个css3动画库，可以到[github](http://daneden.github.io/animate.css/)上去下载，里面预设了很多种常用的动画，或者去：[看下演示效果](http://www.cnblogs.com/2050/p/3409129.html) ;
 
* 效果图预览：

![demo](/images/demo.jpg)


* 点击网站送上祝福吧：[宝宝，我们结婚吧](http://blog.leweg.com/love/)

* 所有的代码可以上我的github项目[lonpo.github.io](http://github.com/lonpo/lonpo.github.io)下载；

## 福利
* 能够看到最后的朋友，我要送上福利了！

* 自动生成浪漫网址（请替换year、month、day、hour、boy、girl参数即可）
```java
	http://blog.leweg.com/love/lovestory.html?year=2011&month=11&day=11&hour=23&boy=我&girl=女神
```
效果演示：[http://blog.leweg.com/love/lovestory.html?year=2014&month=6&day=8&hour=20&boy=jinking&girl=popo](http://blog.leweg.com/love/lovestory.html?year=2014&month=6&day=8&hour=20&boy=jinking&girl=popo)

	再次由衷地谢谢各位的祝福！