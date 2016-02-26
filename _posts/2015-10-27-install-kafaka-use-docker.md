---
layout: post
title: docker环境下搭建Kafka教程
description: 使用docker搭建Kafka教程
category: 消息队列
tags: [docker, zookeeper, Kafka]
comments: true
share: true
---

# 简介
  Kafka is a distributed,partitioned,replicated commit logservice。它提供了类似于JMS的特性，但是在设计实现上完全不同，此外它并不是JMS规范的实现。kafka对消息保存时根据Topic进行归类，发送消息者成为Producer,消息接受者成为Consumer,此外kafka集群有多个kafka实例组成，每个实例(server)成为broker。无论是kafka集群，还是producer和consumer都依赖于zookeeper来保证系统可用性集群保存一些meta信息。
  [Apache](http://kafka.apache.org)
 
# 第一步、搭建docker环境
	docker虚拟化应用容器引擎，可以快速方便的搭建自己的环境。详细的可以参考之前的文章
	* $docker images列出所有images
```bash
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
lonpo/ubuntu        ubuntu              2bdf1ee34eec        About an hour ago   818.8 MB
lonpo/ubuntu        nginx               72cdd523f710        20 hours ago        227.7 MB
ubuntu              14.04               c29e52d44f69        8 days ago          188 MB
ubuntu              latest              c29e52d44f69        8 days ago          188 MB
hello-world         latest              91c95931e552        10 months ago       910 B
```
	* 创建一个容器并进入
	```bash
	$ docker run -it lonpo/ubuntu:ubuntu
	```
	
# 第二步、安装zookeeper并配置
	* 下载zookeeper #wget http://mirrors.cnnic.cn/apache/zookeeper/zookeeper-3.4.6/zookeeper-3.4.6.tar.gz 
	* 修改zookeeper/conf/zoo.cfg并启动zookeeper
	```bash
		cd zookeeper-3.4.6
		cp -rf conf/zoo_sample.cfg conf/zoo.cfg
		vi zoo.cfg
		./zkServer.sh start
	```
<!--more-->	
# 第三步、安装kafka并配置
	* 下载kafka #wget http://apache.fayea.com/kafka/0.8.2.1/kafka_2.10-0.8.2.1.tgz
	* 配置server.properties中的advertised.host.name为当前IP地址（可通过ifconfig查看）例如当前ip为：172.17.0.5
		** 否则会报错：kafka FailedToSendMessageException Failed to send messages 和 kafka.common.KafkaException: fetching topic metadata for topics
	* 启动kafaka服务： #bin/kafka-server-start.sh config/server.properties
		** advertised.host.name=172.17.0.5

# 第四步、保存当前容器container为最新的images
	* 列出当前正在运行container
		```bash
	$ docker ps
CONTAINER ID        IMAGE                 COMMAND             CREATED             STATUS              PORTS               NAMES
667cdc98bd61        lonpo/ubuntu:ubuntu   "/bin/bash"         22 minutes ago      Up 22 minutes       80/tcp              ecstatic_goodall
f8a65985fadc        lonpo/ubuntu:ubuntu   "/bin/bash"         52 minutes ago      Up 52 minutes       80/tcp              ecstatic_tesla
e9cfaa838f35        lonpo/ubuntu:ubuntu   "/bin/bash"         17 hours ago        Up 17 hours         80/tcp              admiring_almeida
	```
	* 保存最新的CONTAINER ID为之前Image
	```bash
		$ docker commit 667cdc98bd61 lonpo/ubuntu:ubuntu
	```
	
# 第五步、 创建topics和启动producer
	* 再创建一个容器
	```bash
	$ docker run -it lonpo/ubuntu:ubuntu
	```
	* 新建一个TOPIC
	** kafka-topics.sh --create --topic kafkatopic --replication-factor 1 --partitions 1 --zookeeper 172.17.0.5:2181 &
	* 启动KAFKA生产者
	** kafka-console-producer.sh --broker-list 172.17.0.5:9092 --sync --topic kafkatopic & 
#第六步、启动consumer
	* 再创建一个容器
	```bash
	$ docker run -it lonpo/ubuntu:ubuntu
	```
	* 启动KAFKA消费者
	** kafka-console-consumer.sh --zookeeper 172.17.0.5:2181 --topic kafkatopic --from-beginning & 
	 
最后在生产者窗口输入对应字符串回车，则可以观察到消费者窗口显示数字；

![kafka演示](/images/kafka.jpg)