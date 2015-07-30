---
layout: post
title: docker在windows下安装及共享文件夹配置
description: docker在windows下安装及问题解决
category: docker
tags: [docker, nginx, 容器, 虚拟化]
comments: true
share: true
---
# windows下安装docker
1. 安装参考文献
[windows下安装docker](http://bsr1983.iteye.com/blog/2124093)

2. 安装问题总结
- http://www.aixq.com/post-328.html     

我的环境：WIN7 X64 + VirtualBox-4.3.20-96997-Win.exe

错误提示如下：

Unable to load R3 module D:\Program Files\Oracle\VirtualBox/VBoxDD.dll
(VBoxDD):GetLastError=1790
(VERR_UNRESOLVED_ERROR)

返回 代码:
E_FAIL (0x80004005)
组件:
Console
界面:
IConsole {8ab7c520-2442-4b66-8d74-4ff1e195d2b6}
<!--more-->


- An error occurred trying to connect: Get https://192.168.59.104:2376/v1.19/version: x509: certificate is valid for 127.0.0.1, 10.0.2.15, not 192.168.59.104

$boot2docker delete
$boot2docker init
$boot2docker up
To connect the Docker client to the Docker daemon, please set:
    export DOCKER_CERT_PATH='C:\Users\yumin.pym\.boot2docker\certs\boot2docker-vm'
    export DOCKER_TLS_VERIFY=1
    export DOCKER_HOST=tcp://192.168.59.108:2376
	$export DOCKER_HOST=tcp://192.168.59.108:2376


3. 如何建立virtualbox和docker虚拟机的共享，以及docker虚拟机和docker容器之间的共享呢？


* 可以参考[百度经验](http://jingyan.baidu.com/article/2fb0ba40541a5900f2ec5f07.html)
* 打开virtualbox并且选择到boot2docker-vm虚拟机，右键点设置
* 点击共享文件夹设置框，右上角的添加按钮
* 选择之前本机设置的共享文件夹，此时一定不可以勾选自动挂载

* 设置好共享名后，进入docker虚拟机系统，打开终端，先执行命令，在挂载点目录添加“bdshare”目录，接着执行"mount -t vboxsf BaiduShare /mnt/bdshare/",就能完成共享文件夹的设置。请记住mount命令一定要带上参数-t vboxsf，BaiduShare就是共享文件夹名称，/mnt/bdshare/就是要在docker虚拟机中挂载的绝对路径.
* docker虚拟机系统默认使用docker用户，可能会遇到Permission denied错误，即权限不足，需要切换到root账户操作，只要输入“sudo su”命令即可，无需密码
首先输入boot2docker ssh，进入docker vm虚拟机内，然后将本地的文件夹与docker vm虚拟机进行共享（备注）


4. docker容器挂载docker虚拟机的目录
可以参考http://my.oschina.net/piorcn/blog/324202

上一步已经将windows内的文件夹共享到docker vm内了。下一步将要把docker vm的目录与docker容器共享了。

docker可以支持把一个宿主机上的目录挂载到镜像里。
docker run -it -v /home/dock/Downloads:/usr/Downloads ubuntu64 /bin/bash
通过-v参数，冒号前为宿主机目录，必须为绝对路径，冒号后为镜像内挂载的路径。

现在镜像内就可以共享宿主机里的文件了。

此处要挂载上一步virtualbox和docker虚拟机共享的文件夹，就在docker启动container时加上参数：
-v /mnt/bdshare/:/data
命令类似：
docker run -it -p 80:80 -v /mnt/bdshare/:/bdshare fe65a2781dae /bin/bash

这样就把宿主windows的K:\BaiduShare目录，挂载到了container的/bdshare目录

``` bash
			>#sudo su
			>#vi init.sh
```

``` bash
#!/bin/sh 
sudo mount -t vboxsf docker /mnt/docker/
docker run -it -v /mnt/docker/:/usr/docker/  -v /mnt/sda1/data:/data ubuntu
```
``` bash
>#chmod +x init.sh
>#./init.sh
```

参考文献：
http://dockerpool.com/static/books/docker_practice/index.html


5.3 映射host到container的端口和目录

映射主机到容器的端口是很有用的，比如在container中运行memcached，端口为11211，运行容器的host可以连接container的 internel_ip:11211 访问，如果有从其他主机访问memcached需求那就可以通过-p选项，形如-p <host_port:contain_port>，存在以下几种写法：

-p 11211:11211 这个即是默认情况下，绑定主机所有网卡（0.0.0.0）的11211端口到容器的11211端口上
-p 127.0.0.1:11211:11211 只绑定localhost这个接口的11211端口
-p 127.0.0.1::5000
-p 127.0.0.1:80:8080
目录映射其实是“绑定挂载”host的路径到container的目录，这对于内外传送文件比较方便，在搭建私服那一节，为了避免私服container停止以后保存的images不被删除，就要把提交的images保存到挂载的主机目录下。使用比较简单，-v <host_path:container_path>，绑定多个目录时再加-v。

-v /tmp/docker:/tmp/docker
另外在两个container之间建立联系可用--link，详见高级部分或官方文档。
下面是一个例子：

# docker run --name nginx_test \
> -v /tmp/docker:/usr/share/nginx/html:ro \
> -p 80:80 -d \
> nginx:1.7.6
在主机的/tmp/docker下建立index.html，就可以通过http://localhost:80/或http://host-ip:80访问了。

备注：也就是说，在Dockerfile编写时，一条RUN执行完，就会回到缺省目录中，因此不能跨多条命令进行一个目标操作，也就是说：比如你要切换到某些目录，再修改文件的操作，必须在一条RUN中完成，或者在多行命令中依靠绝对路径进行文件操作（我的第一个例子）。


## 实践总结
#####Dockerfile创建
``` bash
 >$ boot2docker ssh
 >$ sudo vi Dockerfile
# This is a comment
FROM ubuntu:latest
MAINTAINER Docker lonpo <jinking@leweg.com>
RUN apt-get update && apt-get install -y nginx
```

######docker build创建
``` bash
>$ sudo docker build -t="lonpo/ubuntu:nginx" .
```

#####docker启动容器，并挂载本地文件夹到nginx/html
``` bash
>$ sudo docker run --name nginx_test -it -v /mnt/docker/nginx:/usr/share/nginx/html -p 80:80 lonpo/ubuntu:nginx  /bin/bash
```
* 在d:/docker/nginx新建index.html
* 输入http://192.168.59.103/即可看到效果！

##关于本地文件与docker容器共享
- docker iamges
``` bash
	docker@boot2docker:/mnt/sda1$ docker images
	REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
	lonpo/ubuntu        nginx               58eaace4f049        34 minutes ago      227.6 MB
	nginx               latest              6886fb5a9b8d        12 days ago         132.9 MB
	ubuntu              latest              d2a0ecffe6fa        2 weeks ago         188.4 MB
	hello-world         latest              91c95931e552        3 months ago        910 B
```
- oracle vitualBox容器添加共享文件夹路径：d:/docker，文件名：docker，千万不要选择“自动挂载”选项
- docker虚拟机挂载本地文件夹，将共享文件夹挂载到/mnt/docker/
``` bash
	>$ cd /mnt/
	>$ mkdir docker
	>$ sudo mount -t vboxsf docker /mnt/docker/
```
- 运行docker容器，将/mnt/docker/挂载到容器里面
``` bash
	>$ docker run -it -v /mnt/docker/:/usr/docker/ ubuntu
```

