---
layout: post
title: docker基本命令
date: 2016-05-06 14:59:01
category: docker
tags: [docker]
comments: true
---

# 简介
  docker简介 [Docker](http://www.docker.com/)
 
# docker命令

### 1.拉镜像文件【默认是从docker hub】

```shell
	$ docker pull lonpo/ubuntu:ubuntu
```

	*如果拉取镜像文件网络失败，可以去国内镜像拉去。如进入[DaoCloud](http://www.daocloud.io/)控制台,
	如：

```shell
	$ docker pull daocloud.io/library/centos:7.2.1511
```	

如图：
	![daocloud](/images/blog/docker-registry.png)

### 1.运行容器并进入 `docker run -it [image]`

```shell
	$ docker run -it lonpo/ubuntu:ubuntu
```

### 2.保存当前容器container为最新的images
** 列出当前正在运行container `docker ps`
	
```shell
$ docker ps
CONTAINER ID        IMAGE                 COMMAND             CREATED             STATUS              PORTS               NAMES
667cdc98bd61        lonpo/ubuntu:ubuntu   "/bin/bash"         22 minutes ago      Up 22 minutes       80/tcp              ecstatic_goodall
f8a65985fadc        lonpo/ubuntu:ubuntu   "/bin/bash"         52 minutes ago      Up 52 minutes       80/tcp              ecstatic_tesla
e9cfaa838f35        lonpo/ubuntu:ubuntu   "/bin/bash"         17 hours ago        Up 17 hours         80/tcp              admiring_almeida
```

* 保存最新的CONTAINER ID为之前Image
	
```shell
	$ docker commit 667cdc98bd61 lonpo/ubuntu:ubuntu
```
	
### 3.列出images列表

```shell
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
lonpo/ubuntu        ubuntu              2bdf1ee34eec        About an hour ago   818.8 MB
lonpo/ubuntu        nginx               72cdd523f710        20 hours ago        227.7 MB
ubuntu              14.04               c29e52d44f69        8 days ago          188 MB
ubuntu              latest              c29e52d44f69        8 days ago          188 MB
hello-world         latest              91c95931e552        10 months ago       910 B
```



<!--more-->



![kafka演示](/images/kafka.jpg)

