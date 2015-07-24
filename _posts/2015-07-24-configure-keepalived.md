---
layout: post
title: keepalived安装和配置
description: keepalived高可用性配置
category: 负载均衡
tags: [keepalived, 负载均衡, 集群]
comments: true
share: true
---
#keepalived安装和配置
## 安装
``` bash
[root@node1 ~]# wget http://www.keepalived.org/software/keepalived-1.2.13.tar.gz
[root@node1 ~]# tar zxvf keepalived-1.2.13.tar.gz
[root@node1 keepalived-1.2.13]# cd keepalived-1.2.13
[root@node1 keepalived-1.2.13]# ./configure --prefix=/usr/local/keepalived --disable-fwmark
[root@node1 keepalived-1.2.13]# make
[root@node1 keepalived-1.2.13]# make install
[root@node1 keepalived-1.2.13]# cp /usr/local/keepalived/sbin/keepalived /usr/sbin/
[root@node1 keepalived-1.2.13]# cp /usr/local/keepalived/etc/sysconfig/keepalived /etc/sysconfig/
[root@node1 keepalived-1.2.13]# cp /usr/local/keepalived/etc/rc.d/init.d/keepalived /etc/init.d/
[root@node1 keepalived-1.2.13]# cd /etc/init.d/
[root@node1 init.d]# chkconfig --add keepalived
[root@node1 init.d]# chkconfig keepalived on
[root@node1 init.d]# mkdir -p /etc/keepalived
[root@node1 init.d]# vim /etc/keepalived/keepalived.conf
```
<!--more-->

``` bash
#Configuration File for keepalived 

global_defs { 
notification_email { 
abc@123.com 
} 
notification_email_from abc@123.com 
smtp_server 192.168.200.1 
smtp_connect_timeout 30 
router_id LVS_DEVEL 
} 

vrrp_instance VI_1 { 
state MASTER #备用服务器上改为 BACKUP 
interface eth1 
virtual_router_id 51 
priority 100 #备用服务器上改为99 
advert_int 1 
authentication { 
auth_type PASS 
auth_pass 1111 
} 
virtual_ipaddress { 
192.168.2.165/24 dev eth1 scope global 
} 
} 
```

``` bash
[root@node1 haproxy]# service keepalived start
Starting keepalived: [ OK ]
[root@node1 sbin]# ip add
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 16436 qdisc noqueue 
link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
inet 127.0.0.1/8 scope host lo
inet6 ::1/128 scope host 
valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast qlen 1000
link/ether 00:0c:29:c5:66:52 brd ff:ff:ff:ff:ff:ff
inet 192.168.228.156/24 brd 192.168.228.255 scope global eth0
inet6 fe80::20c:29ff:fec5:6652/64 scope link 
valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast qlen 1000
link/ether 00:0c:29:c5:66:5c brd ff:ff:ff:ff:ff:ff
inet 192.168.2.161/24 brd 192.168.2.255 scope global eth1
inet 192.168.2.165/24 scope global secondary eth1
inet6 fe80::20c:29ff:fec5:665c/64 scope link 
valid_lft forever preferred_lft forever
4: sit0: <NOARP> mtu 1480 qdisc noop 
link/sit 0.0.0.0 brd 0.0.0.0
```

## 配置

``` bash
##########主服务器（192.168.1.179）
global_defs { 
	notification_email {
		abc@123.com 
	} 
	notification_email_from abc@123.com 
	smtp_server 192.168.1.179
	smtp_connect_timeout 30 
	router_id LVS_DEVEL 
} 

vrrp_instance VI_1 { 
	state MASTER #备用服务器上改为 BACKUP 
	interface eth1 
	virtual_router_id 51 
	priority 100 #备用服务器上改为99 
	advert_int 1 
	authentication { 
		auth_type PASS 
		auth_pass 1111 
	} 
	virtual_ipaddress { 
		192.168.1.248/24 dev eth1 scope global 
	} 
} 
```

``` bash
#############备用服务器1（192.168.1.180 ）
global_defs { 
	notification_email {
		abc@123.com 
	} 
	notification_email_from abc@123.com 
	smtp_server 192.168.1.180
	smtp_connect_timeout 30 
	router_id LVS_DEVEL 
} 

vrrp_instance VI_1 { 
	state BACKUP #备用服务器上改为 BACKUP 
	interface eth1 
	virtual_router_id 51 
	priority 99 #备用服务器上改为99 
	advert_int 1 
	authentication { 
		auth_type PASS 
		auth_pass 1111 
	} 
	virtual_ipaddress { 
		192.168.1.248/24 dev eth1 scope global 
	} 
```

``` bash	
#############备用服务器2（192.168.1.181）
global_defs { 
	notification_email {
		abc@123.com 
	} 
	notification_email_from abc@123.com 
	smtp_server 192.168.1.181
	smtp_connect_timeout 30 
	router_id LVS_DEVEL 
} 

vrrp_instance VI_1 { 
	state BACKUP #备用服务器上改为 BACKUP 
	interface eth0 
	virtual_router_id 51 
	priority 98 #备用服务器上改为99 
	advert_int 1 
	authentication { 
		auth_type PASS 
		auth_pass 1111 
	} 
	virtual_ipaddress { 
		192.168.1.248/24 dev eth0 scope global 
	} 
} 
```

``` bash
* 网络拓扑图

主机名     网络IP                        VIP
node1 192.168.1.179(MASTER)         192.168.1.248
node2 192.168.1.180(BACKUP)
node2 192.168.1.181(BACKUP)
```

## 问题总结
1. configure报错

``` bash
checking openssl/ssl.h usability... no
checking openssl/ssl.h presence... no
checking for openssl/ssl.h... no
configure: error:
  !!! OpenSSL is not properly installed on your system. !!!
  !!! Can not include OpenSSL headers files. 
```

* 解决办法：
``` bash
[root@node1 keepalived-1.2.14]# yum install -y openssl openssl-devel
```

或者

``` bash
checking for openssl/ssl.h... no
configure: error: 
!!! OpenSSL is not properly installed on your system. !!!
!!! Can not include OpenSSL headers files. !!!
```
* 解决办法
``` bash
[root@node1 keepalived-1.2.14]# yum install openssl*
```

2. configure: error: No SO_MARK declaration in headers
* 报错：
``` bash
checking for kernel macvlan support... no
checking whether SO_MARK is declared... no
configure: error: No SO_MARK declaration in headers
```

* 解决办法

``` bash
[root@node1 keepalived-1.2.14]# ./configure --prefix=/usr/local/keepalived --disable-fwmark
```
