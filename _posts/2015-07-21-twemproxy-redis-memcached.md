---
layout: post
title: twemproxy代理redis和memcached
description: twemproxy代理redis和memcached
category: redis
tags: [twemproxy, redis, memcached]
comments: true
share: true
---


# 简介
 twemproxy，是一个轻量级的管理cache集群的，主要服务对象是memcached集群和redis集群。github网站在： [twemproxy](https://github.com/twitter/twemproxy) 

# 安装步骤

				apt-get install automake
				apt-get install libtool
				git clone git://github.com/twitter/twemproxy.git
				cd twemproxy
				autoreconf -fvi
				./configure --enable-debug=log
				make
				src/nutcracker -h

* 备注：如果提示automake、autoconf、libtool版本过低，并且没有网络的情况的，请自行下载最高版本的：
* [http://mirrors.ustc.edu.cn/gnu/](http://mirrors.ustc.edu.cn/gnu/)
* 执行三部曲：./configure  && make  && make install 即可
* 如果提示被占用：请输入：
`src/nutcracker -s [端口]`

* redis相关配置资料：[redis单机多实例、主从配置](http://www.cnblogs.com/super-d2/p/3855229.html)

# 配置
修改配置文件nutcracker.yml
`vim ./conf/nutcracker.yml`


	redis1:
	  listen: 0.0.0.0:9999 #使用哪个端口启动Twemproxy
	  redis: true #是否是Redis的proxy
	  hash: fnv1a_64 #指定具体的hash函数
	  distribution: ketama #具体的hash算法
	  auto_eject_hosts: true #是否在结点无法响应的时候临时摘除结点
	  timeout: 400 #超时时间（毫秒）
	  server_retry_timeout: 2000000 #重试的时间（毫秒）
	  server_failure_limit: 0 #结点故障多少次就算摘除掉
	  servers: #下面表示所有的Redis节点（IP:端口号:权重）
			   - 127.0.0.1:6379:1
			   - 127.0.0.1:6380:1
			   - 127.0.0.1:6381:1
			   - 127.0.0.1:6382:1

* 备注：如果需要twemproxy自动摘除异常redis节点，则需要配置server_retry_timeout一个超大数值，并且设置server_failure_limit为0；
* 启动twemproxy，为了方便调试，可以新建一个nutcracker.backup.yml	

				cp conf/nutcracker.yml conf/nutcracker.backup.yml
				./src/nutcracker -c /opt/module/twenproxy/conf/nutcracker.backup.yml

* 客户端连接redis1：

				redis-cli -h 127.0.0.1 -p 9999
				set key1 name1
				set key2 name2
				get key1
				get key2

以上是twenproxy安装配置与测试连接

# 故障节点自动摘除测试
* 第一步，打开两个窗口，窗口1输入：
			> redis-cli -h 127.0.0.1 -p 9999 
			> set key1 name1
			> set key2 name2

* 第二步，打开窗口2输入：
			> redis-cli -h 127.0.0.1 -p 6379
			> get key1
			> "name1"  (返回name1)
* 第三步，现在需要将redis 6379关闭：
				> ps -aux | grep redis
				#找到redis 6379的进程号
				> kill -9 进程号

 * 现在重复第一步、然后重复第二步，这个时候服务连接成功，就窗口2中需要连接6380端口的redis
			> redis-cli -h 127.0.0.1 -p 6380
			> get key1
			> "name1"  (返回name1)

* 自动摘除异常redis成功；

# 优点
这是一个轻量级的 Redis和memcached代理。使用它可以减少缓存服务器的连接数，并且利用它来作分片。这个代理的速度是相当快的，明月在网上查到会有20%的性 能损耗，但明月用redis-benchmark做了测试，发现性能几乎是无损的，甚至有时更快。后来找到英文原文，作者是说最差情况下，性能损耗不会多 于20%。明月觉得这个很了不起，按道理说，有了一层代理，怎么说都得折损一部分性能，但是他切能使得访问更快。看了源码，原来是用了pipeline. 首先redis是支持使用pipeline批处理的。twemproxy与每个redis服务器都会建立一个连接，每个连接实现了两个FIFO的队列，通 过这两个队列实现对redis的pipeline访问。将多个客户端的访问合并到一个连接,这样既减少了redis服务器的连接数，又提高了访问性能。
# 缺点
虽然可以动态移除节点，但该移除节点的数据就丢失了。
redis集群动态增加节点的时候,twemproxy不会对已有数据做重分布.maillist里面作者说这个需要自己写个脚本实现
性能上的损耗





	