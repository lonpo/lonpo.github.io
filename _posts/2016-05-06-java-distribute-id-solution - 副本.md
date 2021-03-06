---
layout: post
title: 分布式全局唯一ID解决方案
date: 2016-05-06 10:05:01
category: 算法
tags: [java, ID, ]
comments: true
---


# 分布式全局唯一ID解决方案

## 网友回答

全局id生成器。
我们日订单也有一万，说多不多说少不少，当然比起贴吧微博不在一个量级。改天介绍一下

1 设置主键自增为何不可取
这样的话，数据库本身是单点，不可拆库，因为id会重复。

2 依赖数据库自增机制达到全局ID唯一
使用如下语句：
REPLACE INTO Tickets64 (stub) VALUES ('a'); 
SELECT LAST_INSERT_ID();
这样可以保证全局ID唯一，但这个Tickets64表依旧是个单点。

3 依赖数据库自增机制达到全局ID唯一并消除单点
在2的基础上，部署两个（多个）数据库实例，
设置自增步长为2（多个则为实例数），即auto-increment-increment = 2
设置auto-increment-offset分别为1,2.....
这样第一台数据库服务器的自增id为 1 3 5 7 9
第二台为2 4 6 8 10

4 解决每次请求全局ID都读库写库压力过大的问题
比如第一次启动业务服务，会请求一个唯一id为3559
如果是2、3的方法，则id为3559，这样每次都请求数据库，对数据库压力比较大
可以用3559 * 65536（举个例子，并不一定是65536）+ 内存自增变量来作为id
当内存自增变量到达65535时，从数据库重新获取一个自增id
这样即使有多台业务服务器，id也不会重复：
第一台 3559 * 65536 + 1,2,3.....65535
第二台 3560 * 65536 + 1,2,3.....65535
然后第一台到65535了，换一个数据库自增id，这时候可能是3561 * 65536 + 1,2,3....

<!--more-->	
	
## 第二种情况
在分布式系统中经常遇到需要获取唯一ID的情况，在保证唯一的前提下一定要高性能，并且要相对占用很少的空间。
下面主要介绍几种生成方法：

### 一、数据库方式
1.1、单库单表方式
这个是很简单的方式了，用一个库一个表存放所有数据，数据库根据+1的方式获取。
优点：简单
缺点：大并发时性能较差
1.2、数据库+分表设计
按照一定的区域把数据划分到不同的表，分布式中机器按照一定的方式到对应的表获取。
比如说有 256个表，每个表放得是10w的数据，(第一个表0-10w,第二个表100001 - 20w，后面类似)，分布式中机器按照一定的规则 %256 到那个表就从对应表获取一个数字。当一个表数据用完后在重新分配。
优点：相比1.1方式性能有了一定的提升
缺点：需要提前分配好数据区域，当达到一定的并发后还会遇到性能问题。

### 二、语言自带方式
很多语言都自带了方法。比如java 中UUID方式 UUID.randomUUID().toString()

```java
/**
* get Id by UUID
* @return
*/
public static String createId(){
     return UUID.randomUUID().toString();
}
```

### 三、本机ip+当时时间+累加因子 方式

```java
public class IdGenerator {

    private static AtomicInteger count = new AtomicInteger(1024);

    /**
    * get Id by localIP + timeStamp + count
    * @return
    */
    public static String createIdByLocalIp() {
        return getId(InetAddressUtil.getLocalIpHex(), System.currentTimeMillis(), getNextId());
    }

    /**
    * get Id by IP + timeStamp + count
    * @param ip input IP
    * @return
    */
    public static String createIdByIp(String ip) {
        if ((ip != null) && (!(ip.isEmpty())) && (InetAddressUtil.validate(ip))){
            return getId(InetAddressUtil.IpToHex(ip), System.currentTimeMillis(),getNextId());
        }
        return createIdByLocalIp();
    } 

    private static String getId(String ip, long timestamp, int nextId) {
        StringBuilder appender = new StringBuilder(25);
        appender.append(ip).append(timestamp).append(nextId);
        return appender.toString();
    }

    private static int getNextId() {
        while (true) {
            int current = count.get();
            int next = (current > 8192) ? 1024 : current + 1;
            if (count.compareAndSet(current, next))
                return next;
        }
    }
}
```

该方式在一台机器如果启一个进程，那是可以保证唯一性的，如果一个机器启多个进程有可能会重复，因为ip是一样的，当前时间和后面的累加因子也完全是有概率重复的。由于该方式返回内容是字符串，在需要拿当前id做数据库主键存储时可能会占用空间比较大。

### 四、时间+机器id+业务id+累加因子 方式
该方式返回long类型，可以根据不同的进程，不同的业务做处理。
long类型：64位ID (42(毫秒)+5(机器ID)+5(业务编码)+12(重复累加因子))
12位重复累加因子是为了防止多线程获取时前面52位生成id一致而做的处理。
下面代码类似twitter id 生成算法。

```java
/**
 * 唯一ID 生成器
 * 64位ID (42(毫秒)+5(机器ID)+5(业务编码)+12(重复累加))
 */
public class IdCreater {
        private final static long idepoch = 1288834974657L;
        // 机器标识位数
        private final static long workerIdBits = 5L;
        // 业务标识位数
        private final static long datacenterIdBits = 5L;
        // 机器ID最大值
        private final static long maxWorkerId = -1L ^ (-1L << workerIdBits);
        // 业务ID最大值
        private final static long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);
        // 毫秒内自增位
        private final static long sequenceBits = 12L;
        // 机器ID偏左移12位
        private final static long workerIdShift = sequenceBits;
        // 业务ID左移17位
        private final static long datacenterIdShift = sequenceBits + workerIdBits;
        // 时间毫秒左移22位
        private final static long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;

        private final static long sequenceMask = -1L ^ (-1L << sequenceBits);

        private static long lastTimestamp = -1L;

        private long sequence = 0L;
        private final long workerId;
        private final long datacenterId;

        public IdCreater(long workerId, long datacenterId) {
                if (workerId > maxWorkerId || workerId < 0) {
                        throw new IllegalArgumentException("worker Id can't be greater than %d or less than 0");
                }
                if (datacenterId > maxDatacenterId || datacenterId < 0) {
                        throw new IllegalArgumentException("datacenter Id can't be greater than %d or less than 0");
                }
                this.workerId = workerId;
                this.datacenterId = datacenterId;
        }

        public IdCreater(long workerId) {
                if (workerId > maxWorkerId || workerId < 0) {
                        throw new IllegalArgumentException("worker Id can't be greater than %d or less than 0");
                }
                this.workerId = workerId;
                this.datacenterId = 0;
        }

        public long generate(){
                return this.nextId(false, 0);
        }

        public long generate(long busid){
                return this.nextId(true, busid);
        }

        private synchronized long nextId(boolean isPadding, long busid) {
                long timestamp = timeGen();
                long paddingnum = datacenterId;
                if(isPadding){
                        paddingnum = busid;
                }
                if (timestamp < lastTimestamp) {
                        try {
                                throw new Exception("Clock moved backwards.  Refusing to generate id for "+ (lastTimestamp - timestamp) + " milliseconds");
                        } catch (Exception e) {
                                e.printStackTrace();
                        }
                }

                if (lastTimestamp == timestamp) {
                        sequence = (sequence + 1) & sequenceMask;
                        if (sequence == 0) {
                                timestamp = tailNextMillis(lastTimestamp);
                        }
                } else {
                        sequence = 0;
                }
                lastTimestamp = timestamp;
                long nextId = ((timestamp - idepoch) << timestampLeftShift)
                                | (paddingnum << datacenterIdShift)
                                | (workerId << workerIdShift) | sequence;

                return nextId;
        }

        private long tailNextMillis(final long lastTimestamp) {
                long timestamp = this.timeGen();
                while (timestamp <= lastTimestamp) {
                        timestamp = this.timeGen();
                }
                return timestamp;
        }

        private long timeGen() {
                return System.currentTimeMillis();
        }
}
```

总结：
如果在小一点的系统，并发很低的情况，采用数据库的方式已经足够了。如果对性能有要求只需要一个唯一id，java的uuid也是一种很好的方式，在一台物理机不需要根据业务和进程进行区分id时，建议采用第三种方式。第四种方式可以根据不同的进程和业务编码生成对应的long类型的id，可以在单台物理机部署很多id生成器，但机器和业务id会有位数限制（比如机器id是5位表示，那么最多的排列是5位的组合，业务编码也一样）。在分布式系统中可以创建几个Id生成服务，分别部署在不同的机器，这种既可以解决机器id和业务id长度的限制，也可以高效的生成id。
其实在很多业务场景，生成Id的规则都可以灵活变化，针对分库分表的业务，生成的Id中可以包含库id，比如：业务编码变成库id，但要考虑将来db扩容，id生成器中位数不够的情况。



