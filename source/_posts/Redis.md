---
title: Redis
date: 2022-12-06 22:18:31
author: 文永达
top_img: https://gcore.jsdelivr.net/gh/volantis-x/cdn-wallpaper/abstract/67239FBB-E15D-4F4F-8EE8-0F1C9F3C4E7C.jpeg
---
---

# 安装Redis

下载解压后

```shell
tar -zxvf redis-4.0.11.tar.gz 
```

安装gcc

```shell
yum install -y gcc
```

进入redis解压目录

使用make命令

```shell
make MALLOC=libc
make install PREFIX=/usr/redis
```

# Redis配置

复制解压后的安装程序文件夹里的redis.conf

到redis安装文件夹

修改监听端口

```conf
bind 127.0.0.1 6379
```

修改库的个数

```shell
# Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT <dbid> where
# dbid is a number between 0 and 'databases'-1
databases 16
```
修改端口号port

```shell
# Accept connections on the specified port, default is 6379 (IANA #815344).
# If port 0 is specified Redis will not listen on a TCP socket.
port 6379
```

设置密码

```conf
requirepass yourpassword
```

# Redis指令

Redis 命令用于在 redis 服务上执行操作。

要在 redis 服务上执行命令需要一个 redis 客户端。Redis 客户端在我们之前下载的的 redis 的安装包中。语法

Redis 客户端的基本语法为：

```
$ redis-cli
```

### 实例

以下实例讲解了如何启动 redis 客户端：

启动 redis 服务器，打开终端并输入命令 **redis-cli**，该命令会连接本地的 redis 服务。

```shell
$ redis-cli
redis 127.0.0.1:6379>
redis 127.0.0.1:6379> PING

PONG
```

在以上实例中我们连接到本地的 redis 服务并执行 **PING** 命令，该命令用于检测 redis 服务是否启动。在远程服务上执行命令

如果需要在远程 redis 服务上执行命令，同样我们使用的也是 **redis-cli** 命令。

### 语法

```shell
$ redis-cli -h host -p port -a password
```

### 实例

以下实例演示了如何连接到主机为 127.0.0.1，端口为 6379 ，密码为 mypass 的 redis 服务上。

```shell
$redis-cli -h 127.0.0.1 -p 6379 -a "mypass"
redis 127.0.0.1:6379>
redis 127.0.0.1:6379> PING

PONG
```

## key操作指令

1. set: 设置key-value

2. get: 获取指定的key对应的value

3. keys *: 查看所有的key

4. del: 删除一个key或多个key。自动忽略掉不存在的key

5. exists: 判断一个key是否存在，如果存在返回1，不存在返回0

6. expire: 为某一个key设置过期时间单位秒seconds

7. move: 将当前数据库中的key移动到其他库

8. pexpire: 为某一个key设置过期时间单位毫秒milliseconds

9. （expireat）pexpireat: 以毫秒为单位设置过期时间戳

10. ttl: 查看对应key的过期时间。单位是秒。

11. pttl: 查看对应key的过期时间。单位是毫秒。

12. randomkey: 随机返回一个key

13. rename: 重命名

14. type: 查看key对应的数据类型

## Redis数据类型

### string类型
   1. mset: 一次设置多个key-value
   2. mget: 一次获取多个key-value
   3. getset: 获得原始的key的值，同时设置新值，如果不存在key则新建一个key
   4. strlen: 获得对应的key的存储的value的长度
   5. append: 为对应的key的value追加内容
   6. getrange: 字符串截取

### List类型

> 相当于Java中的List集合
>
> 特点：有序（添加的先后顺序），可以重复

   1. lpush: 将某个值加入到一个list列表，将这个元素添加到列表的头部
   2. lrange：获取某一个下标区间内的元素
   3. rpush：将某个值加入到一个list列表，将这个元素添加到列表的尾部
   4. lpushx：和lpush基本相同，必须要保证这个key是否存在
   5. rpushx：和rpush基本相同，必须要保证这个key是否存在
   6. lpop：返回和移除列表左边的第一个元素
   7. rpop：返回和移除列表右边的第一个元素
   8. llen：获取列表元素的个数
   9. lset：设置某一个指定索引的值（索引有效），修改操作
   10. lindex：获取某一个指定索引位置的元素
   11. lrem：删除重复元素（少用）
   12. ltrim：保留列表中特定区间内的元素。列表的截取
   13. linsert：在某一个元素之前或者之后插入元素

### Set类型

> 相当于Java中的set集合
>
> 特点：无序，不可以重复，若重复，则会覆盖

1. sadd：为集合添加元素
2. smembers：显示集合中的所有元素。无序（添加的先后顺序）
3. scard：返回集合中的元素的个数
4. spop：随机返回一个元素并将元素在集合中删除
5. smove：从一个集合中向另一个集合中移动元素（前提：必须是同一种类型）
6. srem：从集合中删除一个元素
7. sismember：判断一个集合中是否有这个元素
8. srandmember：随机返回一个元素
9. sdiff：去掉第一个集合中和第二个集合中相同的元素
10. sinter：求交集
11. sunion：求并集


### Zset类型

> 相当于Java中的TreeSet集合
>
> 特点：不可以重复，但有序

 1. zadd：添加一个有序集合，添加元素时需要指定每一个元素的分数
 2. zcard：返回集合中元素的个数
 3. zrange：升序排列集合返回一个范围内的元素
 4. zrevrange：降序排列
 5. zrangebyscore：安装分数查找一个范围内的元素（类似于分页）
 6. zrank：返回排名（升序）
 7. zrevrank：返回排名（降序）
 8. zscore：查看一个元素的分数
 9. zrem：移除某一个元素
 10. zincrby：给某一个元素加分

### Hash类型

> 相当于Java中的Map集合
>
> 特点：key不可重复，value可重复。无序

1. hset：设置一个key/value对
2. hget：获取一个key对应的value
3. hgetall：获得所有的key/value对
4. hdel: 删除某一个key/value对
5. hexists:判断一个key是否存在
6. hkeys:获得所有的key
7. hvals:获得所有的value
8. hmset:设置多个key/value
9. hmget:获取多个key/value
10. hsetnx:设置一个不存在的key的值
11. hincrby:为value进行加法计算
12. hincrbyfloat:为value进行加分计算,小数

# Redis主从架构

在redis主从架构中，Master节点负责处理写请求，Slave节点只处理读请求。对于写请求少，读请求多的场景，例如电商详情页，通过这种读写分离的操作可以大幅提高并发量，通过增加redis从节点的数量可以使得redis的QPS达到10W+。

在根目录下创建三个文件夹 master slave1 slave2

```shell
mkdir master slave1 slave2
```

将redis压缩包解压后文件夹内的redis.conf分别复制到这三个文件夹中

修改 master redis.conf内容

```shell
vim redis.conf
:/bind #查找bind
bind 0.0.0.0 #修改bind为0.0.0.0 让其可被外界访问
```

修改 slave1和slave2 redis.conf内容

```shell
vim redis.conf
:/bind #查找bind
bind 0.0.0.0 #修改bind为0.0.0.0 让其可被外界访问
:/slave #查找slave
slaveof <masterip> <masterport> #将这行注释取消
# 修改为 对应主机redis的ip 对应主机redis的port
slaveof 192.168.56.101 6379
```

此时redis主从机构配置好了，主机负责读和写，主要负责写，而从机负责读，但不能写。

此时问题来了，如果主机挂了，那么数据就没法写到redis缓存中，从机只负责读，不能写，但此时仍可读数据

此时就需要用到Redis哨兵机制

# Redis哨兵机制

哨兵机制就是起一台机器用作哨兵，这个哨兵负责监听主机，如果主机挂了，那么它会让从机接替主机位，以此类推，需要用到选举

在根目录下新建sentinel文件夹

```shell
mkdir sentinel
vim sentinel.conf
# 第一行输入如下 哨兵名 主机ip			主机port 选举数
sentinel monitor mymaster 192.168.56.101 6379 1
```

将sentinel.conf 复制到redis安装目录 bin下

```shell
cp /root/sentinel/sentinel.conf /usr/redis/bin
```

启动哨兵

```shell
./redis-sentinel sentinel.conf
```

# Redis缓存穿透

> 缓存穿透指的查询缓存和数据库中都不存在的数据，这样每次请求直接打到数据库，就好像缓存不存在一样。

